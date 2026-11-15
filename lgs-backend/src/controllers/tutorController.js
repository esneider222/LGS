const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 12000;
const MAX_TOTAL_LENGTH = 30000;
const ALLOWED_MODES = new Set(['explicar', 'examinar', 'corregir', 'plan', 'ingles', 'material']);

function tutorStatus(req, res) {
  res.json({
    ok: Boolean(process.env.GEMINI_API_KEY),
    configured: Boolean(process.env.GEMINI_API_KEY),
    model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
  });
}

function createSystemInstruction(mode, career, university, context) {
  const instructions = {
    explicar: 'Explica conceptos con claridad, ejemplos y pasos adecuados al nivel del estudiante.',
    examinar: 'Haz preguntas de práctica, espera respuestas cuando corresponda y explica cada solución.',
    corregir: 'Da retroalimentación respetuosa sobre claridad, estructura, gramática y ortografía. No reescribas todo sin explicar los cambios.',
    plan: 'Propón un plan realista, organizado por sesiones y con objetivos verificables.',
    ingles: 'Ayuda a practicar inglés; adapta el idioma al mensaje del estudiante y explica correcciones con ejemplos.',
    material: 'Usa solo el texto fuente proporcionado. Crea cinco preguntas de opción múltiple con cuatro opciones cada una, una respuesta correcta y una explicación breve. Al final incluye una clave de respuestas. Si el texto no contiene información suficiente para una pregunta, no inventes datos.',
  };
  const details = [
    `Modo de tutoría: ${instructions[mode]}`,
    career ? `Carrera seleccionada: ${career}.` : '',
    university ? `Universidad seleccionada: ${university}.` : '',
    context ? `Contexto de estudio:\n${context.slice(0, 2500)}` : '',
    'Responde en el idioma del estudiante y distingue claramente los hechos de cualquier incertidumbre.',
  ];
  return details.filter(Boolean).join('\n\n');
}

exports.tutorStatus = tutorStatus;

exports.askTutor = async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'El tutor no está configurado. Añade GEMINI_API_KEY a lgs-backend/.env.' });
  }

  const { messages, mode = 'explicar', career, university, context } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return res.status(400).json({ error: `messages debe contener entre 1 y ${MAX_MESSAGES} mensajes.` });
  }
  if (!ALLOWED_MODES.has(mode)) {
    return res.status(400).json({ error: 'Modo de tutoría no válido.' });
  }
  if (context !== undefined && (typeof context !== 'string' || context.length > 2500)) {
    return res.status(400).json({ error: 'El contexto debe ser texto de hasta 2500 caracteres.' });
  }

  let totalLength = 0;
  const contents = [];
  for (const message of messages) {
    if (!message || !['user', 'assistant'].includes(message.role) || typeof message.content !== 'string') {
      return res.status(400).json({ error: 'Cada mensaje debe tener un role y content válidos.' });
    }
    const content = message.content.trim();
    if (!content || content.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: 'Cada mensaje debe tener entre 1 y 12000 caracteres.' });
    }
    totalLength += content.length;
    if (totalLength > MAX_TOTAL_LENGTH) {
      return res.status(413).json({ error: 'El historial es demasiado largo. Borra parte de la conversación e inténtalo de nuevo.' });
    }
    contents.push({ role: message.role === 'assistant' ? 'model' : 'user', parts: [{ text: content }] });
  }
  if (messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'El último mensaje debe ser una pregunta del estudiante.' });
  }

  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  let upstream;

  try {
    upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: createSystemInstruction(mode, career, university, context) }],
        },
        contents,
        generationConfig: {
          maxOutputTokens: 1800,
          temperature: 0.6,
          thinkingConfig: { thinkingLevel: 'minimal' },
        },
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!upstream.ok) {
      let providerMessage = '';
      try {
        const providerError = await upstream.json();
        providerMessage = providerError.error?.message || '';
      } catch {
        providerMessage = '';
      }
      const safeDetail = providerMessage
        .replaceAll(apiKey, '[clave oculta]')
        .slice(0, 300);
      console.error(`Gemini rechazó una solicitud (HTTP ${upstream.status})${safeDetail ? `: ${safeDetail}` : '.'}`);

      if (upstream.status === 429) {
        return res.status(503).json({ error: 'Gemini alcanzó su límite temporal o de cuota. Revisa la cuota de la API key e inténtalo más tarde.' });
      }
      if (upstream.status === 503) {
        return res.status(503).json({ error: 'El modelo de Gemini está temporalmente saturado. Inténtalo de nuevo más tarde.' });
      }
      if (upstream.status === 401 || upstream.status === 403) {
        return res.status(502).json({ error: 'Gemini no autorizó la API key. Revísala en Google AI Studio y comprueba sus restricciones.' });
      }
      if (upstream.status === 404) {
        return res.status(502).json({ error: `El modelo "${model}" no está disponible para esta API key.` });
      }
      return res.status(502).json({
        error: safeDetail
          ? `Gemini rechazó la solicitud: ${safeDetail}`
          : `Gemini rechazó la solicitud (HTTP ${upstream.status}). Revisa el modelo y el contenido enviado.`,
      });
    }

  } catch (err) {
    const timedOut = err.name === 'TimeoutError' || err.name === 'AbortError';
    return res.status(timedOut ? 504 : 502).json({
      error: timedOut ? 'El tutor tardó demasiado en responder. Inténtalo de nuevo.' : 'No se pudo contactar al servicio de tutor.',
    });
  }

  try {
    const result = await upstream.json();
    const reply = result.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('')
      .trim();
    if (!reply) {
      return res.status(502).json({ error: 'El tutor no devolvió una respuesta de texto.' });
    }

    return res.json({ reply, truncated: result.candidates[0].finishReason === 'MAX_TOKENS' });
  } catch (err) {
    console.error('Respuesta inválida del servicio de tutor:', err.message);
    return res.status(502).json({ error: 'El servicio de tutor devolvió una respuesta inválida.' });
  }
};
