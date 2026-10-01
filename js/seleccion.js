(function(){
const $ = id => document.getElementById(id);
const session = loadJSON('lyl_session', null);
if(!session){ location.replace('index.html'); return; }
const prev = loadJSON('lyl_sel', null);
let pick = {career: prev && prev.career, uni: prev && prev.uni};
function render(){
  $('selUser').textContent = 'Hola, ' + session.user;
  $('careerGrid').innerHTML = CAREERS.map(c => `<div class="col"><button type="button" class="career-opt card h-100 w-100 text-start p-3" data-career="${c.id}" aria-pressed="${pick.career===c.id}"><span class="small text-secondary">${c.icon} ${c.area}</span><b>${c.name}</b></button></div>`).join('');
  const c = CAREERS.find(x => x.id === pick.career), us = $('uniSelect');
  us.disabled = !c;
  us.innerHTML = c ? '<option value="">Elige una universidad</option>' + c.unis.map(u => `<option value="${u}" ${pick.uni===u?'selected':''}>${UNIS[u]}</option>`).join('') : '<option>Primero elige una carrera</option>';
  const f = pick.uni && EXAM_FORMATS[pick.uni];
  $('uniNote').classList.toggle('d-none', !f);
  if(f) $('uniNote').textContent = 'Simulacro de referencia: ' + f.n + ' preguntas en ' + f.min + ' minutos. Verifica el formato oficial en la página de admisiones.';
  $('selContinue').disabled = !(c && pick.uni);
}
$('careerGrid').addEventListener('click', e => {
  const b = e.target.closest('[data-career]'); if(!b) return;
  if(pick.career !== b.dataset.career) pick = {career: b.dataset.career, uni: null};
  render();
});
$('uniSelect').addEventListener('change', e => { pick.uni = e.target.value || null; render(); });
$('selContinue').addEventListener('click', () => {
  if(!(pick.career && pick.uni)) return;
  if(!prev || prev.career !== pick.career || prev.uni !== pick.uni){ try{ localStorage.removeItem('lyl_chat_v2'); }catch(_){} }
  saveJSON('lyl_sel', {career: pick.career, uni: pick.uni});
  location.href = 'guia.html';
});
render();
})();
