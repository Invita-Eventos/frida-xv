// 1. Inicializar iconos
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }
});

// 2. Temporizador regresivo exacto (19 de Septiembre de 2026, 19:30:00 hrs)
// Mes en JS es base 0: (8 = Septiembre)
const targetDate = new Date(2026, 8, 19, 19, 30, 0).getTime();

function updateTimer() {
  const now = new Date().getTime();
  const diff = targetDate - now;

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minEl = document.getElementById('minutes');
  const secEl = document.getElementById('seconds');

  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minEl) minEl.textContent = String(minutes).padStart(2, '0');
    if (secEl) secEl.textContent = String(seconds).padStart(2, '0');
  } else {
    if (daysEl) daysEl.textContent = '00';
    if (hoursEl) hoursEl.textContent = '00';
    if (minEl) minEl.textContent = '00';
    if (secEl) secEl.textContent = '00';
  }
}

// Ejecutar inmediatamente y luego por intervalo cada segundo
updateTimer();
setInterval(updateTimer, 1000);

// 3. Parámetros dinámicos desde URL (?invitado=Familia+Perez&pases=3)
const params = new URLSearchParams(window.location.search);
const guest = params.get('invitado') || '';
const passes = params.get('pases') || '2';

const guestNameEl = document.getElementById('guestName');
const passBadgeEl = document.getElementById('passBadge');
const guestInput = document.getElementById('guestInput');

if (guestNameEl) {
  guestNameEl.textContent = guest || 'Apreciable Invitado';
}

if (passBadgeEl) {
  const label = parseInt(passes, 10) === 1 ? 'Pase Asignado' : 'Pases Asignados';
  passBadgeEl.textContent = `${passes} ${label}`;
}

if (guestInput && guest) {
  guestInput.value = guest;
}

// 4. Contador de caracteres en tiempo real
const messageInput = document.getElementById('messageInput');
const charCount = document.getElementById('charCount');

if (messageInput && charCount) {
  messageInput.addEventListener('input', (e) => {
    charCount.textContent = e.target.value.length;
  });
}

// 5. Envío a WhatsApp y Visualización del Modal
const organizerPhone = "524491235696"; 

function enviarWhatsApp() {
  const guestName = document.getElementById('guestInput') ? document.getElementById('guestInput').value.trim() : '';
  const guestMsg = document.getElementById('messageInput') ? document.getElementById('messageInput').value.trim() : '';

  if (!guestName) {
    alert("Por favor escribe tu nombre completo.");
    return;
  }

  let textPayload = 
    `¡Hola! Confirmo con mucho gusto mi asistencia a los XV años de Frida Sophía ✨\n\n` +
    `👤 *Invitado(s):* ${guestName}\n` +
    `🎟️ *Pases:* ${passes} boleto(s)`;

  if (guestMsg) {
    textPayload += `\n💬 *Mensaje:* "${guestMsg}"`;
  }

  // 1. Mostrar mensaje de confirmación en la página
  const modal = document.getElementById('confirmationModal');
  const modalMsg = document.getElementById('modalMessage');
  if (modal) {
    if (modalMsg) {
      modalMsg.innerHTML = `¡Muchas gracias, <strong>${guestName}</strong>! Se ha generado tu confirmación para <strong>${passes} pase(s)</strong>.<br><br>En unos instantes se abrirá WhatsApp, recuerda presionar <strong>Enviar</strong> para completar el registro.`;
    }
    modal.style.display = 'flex';
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // 2. Abrir WhatsApp en pestaña nueva
  const whatsappUrl = `https://wa.me/${organizerPhone}?text=${encodeURIComponent(textPayload)}`;
  window.open(whatsappUrl, '_blank');
}

function cerrarModal() {
  const modal = document.getElementById('confirmationModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// 6. Control de Música de Fondo
const bgMusic = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');
let isMusicPlaying = false;

function toggleMusic() {
  if (!bgMusic) return;

  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      if (musicIcon) {
        musicIcon.classList.remove('music-paused');
      }
    }).catch(err => {
      console.log("Autoplay bloqueado por el navegador:", err);
    });
  } else {
    bgMusic.pause();
    isMusicPlaying = false;
    if (musicIcon) {
      musicIcon.classList.add('music-paused');
    }
  }
}

document.addEventListener('click', function initAudioOnFirstTouch() {
  if (bgMusic && !isMusicPlaying) {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      if (musicIcon) {
        musicIcon.classList.remove('music-paused');
      }
    }).catch(() => {});
  }
  document.removeEventListener('click', initAudioOnFirstTouch);
}, { once: true });
// 7. Animaciones de entrada suaves al hacer scroll (aditivo, no afecta lo demás)
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();