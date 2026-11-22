const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Progress = require('../models/Progress');
const { sendEmail } = require('../utils/email');

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '7d',
  });
}

function isStrongPassword(password) {
  // Mínimo 8, al menos 1 mayúscula, 1 minúscula y 1 número
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

exports.register = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Usuario, email y contraseña son obligatorios.' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.',
      });
    }

    const usernameNorm = username.trim().toLowerCase();
    const emailNorm = email.trim().toLowerCase();

    const existsUser = await User.findOne({ username: usernameNorm });
    if (existsUser) {
      return res.status(409).json({ error: 'Ese nombre de usuario ya está en uso.' });
    }

    const existsEmail = await User.findOne({ email: emailNorm });
    if (existsEmail) {
      return res.status(409).json({ error: 'Ese email ya está registrado.' });
    }

    const user = await User.create({
      username: usernameNorm,
      email: emailNorm,
      password,
      name: (name || username).trim(),
    });

    await Progress.create({ user: user._id });

    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Usuario o email ya registrado.' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son obligatorios.' });
    }

    // Permite login con username o email
    const login = username.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ username: login }, { email: login }],
    }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      name: req.user.name,
    },
  });
};

// ——— Recuperación de contraseña ———

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'El email es obligatorio.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    // Siempre respondemos igual para no filtrar si el email existe
    const genericMsg = 'Si el email está registrado, recibirás un enlace para restablecer tu contraseña.';

    if (!user) {
      return res.json({ message: genericMsg });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const frontendUrl = process.env.FRONTEND_URL || 'https://lgs-zajv.netlify.app';
    const resetUrl = `${frontendUrl}/restablecer?token=${resetToken}`;

    const html = `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
        <h2>Restablecer contraseña — LGS</h2>
        <p>Hola ${user.name || user.username},</p>
        <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón (o copia el enlace):</p>
        <p style="margin:24px 0">
          <a href="${resetUrl}" style="background:#7b1e2b;color:#fff;padding:12px 20px;text-decoration:none;border-radius:6px">
            Restablecer contraseña
          </a>
        </p>
        <p style="font-size:14px;color:#555">Este enlace expira en <strong>15 minutos</strong>.</p>
        <p style="font-size:13px;color:#888">Si no solicitaste este cambio, puedes ignorar este correo.</p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Restablecer tu contraseña — LGS',
      html,
    });

    res.json({ message: genericMsg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo enviar el correo. Intenta más tarde.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token y nueva contraseña son obligatorios.' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.',
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({ error: 'El enlace no es válido o ya expiró. Solicita uno nuevo.' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Opcional: iniciar sesión automáticamente
    const jwtToken = signToken(user._id);

    res.json({
      message: 'Contraseña actualizada correctamente.',
      token: jwtToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
