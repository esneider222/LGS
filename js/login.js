(function(){
const $ = id => document.getElementById(id), cap = {a:0,b:0};
saveJSON('lyl_session', null);
function newCaptcha(){ cap.a = 2 + Math.floor(Math.random()*8); cap.b = 2 + Math.floor(Math.random()*8); $('capQ').textContent = cap.a + ' + ' + cap.b; $('capA').value = ''; }
function fail(m){ const e = $('loginErr'); e.textContent = m; e.classList.remove('d-none'); }
$('capNew').addEventListener('click', newCaptcha);
$('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const user = $('loginUser').value.trim();
  if(!user || !$('loginPass').value){ fail('Escribe tu usuario y tu contraseña.'); return; }
  if(parseInt($('capA').value, 10) !== cap.a + cap.b){ fail('La verificación no coincide. Resuelve la nueva suma.'); newCaptcha(); return; }
  saveJSON('lyl_session', {user});
  location.href = 'seleccion.html';
});
newCaptcha();
})();
