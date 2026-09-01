// 1. Base de datos extraída de tu Excel (36 registros con sus pases exactos)
const INVITADOS_EXCEL = [
  { id: 1, nombre: "Pachita", pases: 1 },
  { id: 2, nombre: "Marisol Marin", pases: 5 },
  { id: 3, nombre: "Andrés Marín", pases: 2 },
  { id: 4, nombre: "Daniel Marín", pases: 2 },
  { id: 5, nombre: "Margot Marín", pases: 3 },
  { id: 6, nombre: "Esmeralda Marín", pases: 3 },
  { id: 7, nombre: "Verónica Andrade", pases: 5 },
  { id: 8, nombre: "Sanjuana Rivera", pases: 2 },
  { id: 9, nombre: "Coral Rivera", pases: 2 },
  { id: 10, nombre: "Leslie", pases: 5 },
  { id: 11, nombre: "Luis Martínez", pases: 4 },
  { id: 12, nombre: "Edgar", pases: 3 },
  { id: 13, nombre: "Celene", pases: 4 },
  { id: 14, nombre: "Miriam Avelar", pases: 4 },
  { id: 15, nombre: "Dulce", pases: 4 },
  { id: 16, nombre: "Roger", pases: 2 },
  { id: 17, nombre: "Oswaldo", pases: 5 },
  { id: 18, nombre: "Guadalupe Rivera", pases: 1 },
  { id: 19, nombre: "Refugio Esquivel", pases: 1 },
  { id: 20, nombre: "Desiree", pases: 1 },
  { id: 21, nombre: "Esmeralda", pases: 1 },
  { id: 22, nombre: "Vanessa", pases: 1 },
  { id: 23, nombre: "Arelly", pases: 1 },
  { id: 24, nombre: "Francisco", pases: 1 },
  { id: 25, nombre: "Santiago", pases: 1 },
  { id: 26, nombre: "Sofia", pases: 1 },
  { id: 27, nombre: "Danna", pases: 1 },
  { id: 28, nombre: "Aaron", pases: 1 },
  { id: 29, nombre: "Christian", pases: 1 },
  { id: 30, nombre: "Rodrigo", pases: 1 },
  { id: 31, nombre: "Abbie", pases: 1 },
  { id: 32, nombre: "Jamileth", pases: 1 },
  { id: 33, nombre: "Dafne", pases: 1 },
  { id: 34, nombre: "Luis Ángel Martínez", pases: 2 },
  { id: 35, nombre: "Jorge Gómez", pases: 1 },
  { id: 36, nombre: "Johan Gómez", pases: 1 },
  { id: 37, nombre: "Prueba", pases: 5 }
];

let invitadoActual = null;
const SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyF92WUFRilqVC4xhR9jyQMDasXT00GyY0KB1IR4RiiNThV9Z4EEoClFKOaRECqug9y/exec";

// 2. Inicializar selector mostrando SOLO el nombre
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  const selectEl = document.getElementById('guestSelect');
  if (selectEl) {
    INVITADOS_EXCEL.forEach((inv) => {
      const opt = document.createElement('option');
      opt.value = inv.id;
      opt.textContent = inv.nombre; // Solo el nombre sin paréntesis ni conteo de pases
      selectEl.appendChild(opt);
    });
  }

  // Soporte para URL directa (?id=15)
  const urlParams = new URLSearchParams(window.location.search);
  const guestId = parseInt(urlParams.get('id'), 10);
  if (guestId) {
    const found = INVITADOS_EXCEL.find(i => i.id === guestId);
    if (found) {
      if (selectEl) selectEl.value = found.id;
      cargarDatosInvitado(found);
    }
  }
});

// 3. Entrar a la invitación
function entrarConInvitado() {
  const selectEl = document.getElementById('guestSelect');
  const selectedId = parseInt(selectEl ? selectEl.value : 0, 10);

  if (!selectedId) {
    alert("Por favor selecciona tu nombre en la lista para ingresar.");
    return;
  }

  invitadoActual = INVITADOS_EXCEL.find(i => i.id === selectedId);
  cargarDatosInvitado(invitadoActual);

  const splash = document.getElementById('welcomeOverlay');
  if (splash) splash.classList.add('hidden');

  if (bgMusic) {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      if (musicIcon) musicIcon.classList.remove('music-paused');
    }).catch(() => {});
  }
}

// 4. Asignar datos en Pase de Honor y Formulario
function cargarDatosInvitado(inv) {
  invitadoActual = inv;

  const guestNameEl = document.getElementById('guestName');
  const passBadgeEl = document.getElementById('passBadge');
  const guestInput = document.getElementById('guestInput');
  const passesSelect = document.getElementById('passesSelect');

  // Asigna nombre y los pases calculados en el Pase de Honor
  if (guestNameEl) guestNameEl.textContent = inv.nombre;
  if (passBadgeEl) passBadgeEl.textContent = `${inv.pases} ${inv.pases === 1 ? 'Pase Asignado' : 'Pases Asignados'}`;
  if (guestInput) guestInput.value = inv.nombre;

  // Llenar opciones del formulario RSVP
  if (passesSelect) {
    passesSelect.innerHTML = '';
    for (let p = inv.pases; p >= 1; p--) {
      const opt = document.createElement('option');
      opt.value = p;
      opt.textContent = p === 1 ? '1 Persona (Asistirá)' : `${p} Personas (Asistirán)`;
      passesSelect.appendChild(opt);
    }
    const noOpt = document.createElement('option');
    noOpt.value = 0;
    noOpt.textContent = 'No podré asistir';
    passesSelect.appendChild(noOpt);
  }

  // Bloqueo si ya confirmó previamente en este dispositivo
  const yaRegistrado = localStorage.getItem(`rsvp_confirmado_${inv.id}`);
  const btnSubmit = document.getElementById('btnSubmitRsvp');
  if (yaRegistrado && btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i data-lucide="check-check" class="icon-heart"></i><span>ASISTENCIA YA REGISTRADA</span>';
    btnSubmit.style.opacity = '0.7';
    btnSubmit.style.cursor = 'not-allowed';
    if (window.lucide) lucide.createIcons();
  }
}

// 5. Envío a Google Sheets
function enviarConfirmacion() {
  if (!invitadoActual) {
    alert("Por favor selecciona tu nombre en la lista de bienvenida.");
    return;
  }

  const btnSubmit = document.getElementById('btnSubmitRsvp');
  const selectedPasses = document.getElementById('passesSelect') ? document.getElementById('passesSelect').value : invitadoActual.pases;
  const guestMsg = document.getElementById('messageInput') ? document.getElementById('messageInput').value.trim() : '';

  const originalContent = btnSubmit.innerHTML;
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<span>REGISTRANDO...</span>';

  const payload = {
    invitado: invitadoActual.nombre,
    pases: selectedPasses,
    mensaje: guestMsg
  };

  fetch(SHEETS_WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  })
  .then(() => {
    localStorage.setItem(`rsvp_confirmado_${invitadoActual.id}`, "true");

    const modal = document.getElementById('confirmationModal');
    const modalMsg = document.getElementById('modalMessage');
    if (modal) {
      if (modalMsg) {
        if (selectedPasses == 0) {
          modalMsg.innerHTML = `¡Gracias por avisarnos, <strong>${invitadoActual.nombre}</strong>!<br>Lamentamos que no puedas asistir, te mandamos un abrazo.`;
        } else {
          modalMsg.innerHTML = `¡Muchas gracias, <strong>${invitadoActual.nombre}</strong>!<br>Tu confirmación para <strong>${selectedPasses} persona(s)</strong> ha quedado registrada en la lista oficial.`;
        }
      }
      modal.style.display = 'flex';
      if (window.lucide) lucide.createIcons();
    }

    btnSubmit.innerHTML = '<i data-lucide="check" class="icon-heart"></i><span>¡ASISTENCIA REGISTRADA!</span>';
    btnSubmit.style.opacity = '0.75';
    btnSubmit.style.cursor = 'not-allowed';
    if (window.lucide) lucide.createIcons();
  })
  .catch((err) => {
    console.error(err);
    alert("Hubo un error al registrar. Intenta nuevamente.");
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = originalContent;
  });
}

function cerrarModal() {
  const modal = document.getElementById('confirmationModal');
  if (modal) modal.style.display = 'none';
}

// 6. Temporizador exacto (19 de Septiembre de 2026, 16:00:00 hrs)
const targetDate = new Date(2026, 8, 19, 16, 0, 0).getTime();
function updateTimer() {
  const diff = targetDate - new Date().getTime();
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minEl = document.getElementById('minutes');
  const secEl = document.getElementById('seconds');

  if (diff > 0) {
    if (daysEl) daysEl.textContent = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    if (minEl) minEl.textContent = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    if (secEl) secEl.textContent = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
  } else {
    if (daysEl) daysEl.textContent = '00';
    if (hoursEl) hoursEl.textContent = '00';
    if (minEl) minEl.textContent = '00';
    if (secEl) secEl.textContent = '00';
  }
}
updateTimer();
setInterval(updateTimer, 1000);

// Contador de caracteres
const messageInput = document.getElementById('messageInput');
const charCount = document.getElementById('charCount');
if (messageInput && charCount) {
  messageInput.addEventListener('input', (e) => charCount.textContent = e.target.value.length);
}

// Control de Música
const bgMusic = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');
let isMusicPlaying = false;

function toggleMusic() {
  if (!bgMusic) return;
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      if (musicIcon) musicIcon.classList.remove('music-paused');
    }).catch(() => {});
  } else {
    bgMusic.pause();
    isMusicPlaying = false;
    if (musicIcon) musicIcon.classList.add('music-paused');
  }
}

// Scroll Reveal
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));
})();