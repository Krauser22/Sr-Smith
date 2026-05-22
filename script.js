// ===========================
// 1. CURSOR PERSONALIZADO
// ===========================
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

// Trail con lag suave
function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Expand on hover
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    cursor.style.opacity = '0.6';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursor.style.opacity = '1';
  });
});

// Ocultar cursor al salir de la ventana
document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  cursorTrail.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  cursorTrail.style.opacity = '1';
});


// ===========================
// 2. NAVBAR — scroll + hamburger
// ===========================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});


// ===========================
// 3. REVEAL ON SCROLL
// ===========================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -48px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));


// ===========================
// 4. TESTIMONIOS — slider
// ===========================
const testimonios = document.querySelectorAll('.testimonio');
const tDots = document.querySelectorAll('.t-dot');
const tPrev = document.getElementById('tPrev');
const tNext = document.getElementById('tNext');
let currentT = 0;
let autoT;

function showTestimonio(index) {
  testimonios.forEach(t => t.classList.remove('active'));
  tDots.forEach(d => d.classList.remove('active'));
  testimonios[index].classList.add('active');
  tDots[index].classList.add('active');
  currentT = index;
}

function nextT() {
  showTestimonio((currentT + 1) % testimonios.length);
}
function prevT() {
  showTestimonio((currentT - 1 + testimonios.length) % testimonios.length);
}

function startAuto() {
  autoT = setInterval(nextT, 5500);
}
function resetAuto() {
  clearInterval(autoT);
  startAuto();
}

tNext.addEventListener('click', () => { nextT(); resetAuto(); });
tPrev.addEventListener('click', () => { prevT(); resetAuto(); });
tDots.forEach(dot => {
  dot.addEventListener('click', () => {
    showTestimonio(parseInt(dot.dataset.i, 10));
    resetAuto();
  });
});

// Swipe táctil
let tTouchStart = 0;
document.querySelector('.testimonios__slider').addEventListener('touchstart', e => {
  tTouchStart = e.changedTouches[0].screenX;
}, { passive: true });
document.querySelector('.testimonios__slider').addEventListener('touchend', e => {
  const diff = tTouchStart - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) {
    diff > 0 ? nextT() : prevT();
    resetAuto();
  }
});

showTestimonio(0);
startAuto();


// ===========================
// 5. FORMULARIO DE CONTACTO
// ===========================
const formBtn = document.getElementById('formBtn');
const formOk = document.getElementById('formOk');

const dateMin = new Date().toISOString().split('T')[0];

function getFormValues() {
  return {
    nombre: document.getElementById('f-nombre').value.trim(),
    tipo: document.getElementById('f-tipo').value,
    desc: document.getElementById('f-desc').value.trim(),
    tel: document.getElementById('f-tel').value.trim(),
  };
}

function validateForm() {
  const v = getFormValues();
  if (!v.nombre) return 'Ingresa tu nombre.';
  if (!v.tipo) return 'Selecciona un servicio.';
  if (!v.desc) return 'Cuéntame tu idea.';
  if (!v.tel) return 'Ingresa tu WhatsApp.';
  return null;
}

function setError(msg) {
  formBtn.textContent = msg;
  formBtn.style.background = '#8B1A10';
  setTimeout(() => {
    formBtn.textContent = 'Enviar solicitud';
    formBtn.style.background = '';
  }, 2800);
}

formBtn.addEventListener('click', () => {
  const err = validateForm();
  if (err) { setError(err); return; }

  formBtn.textContent = 'Enviando...';
  formBtn.disabled = true;

  // Simulación — aquí iría el fetch real a un backend o servicio como Formspree
  setTimeout(() => {
    formBtn.style.display = 'none';
    formOk.classList.add('visible');

    // Construir enlace de WhatsApp con los datos del form
    const v = getFormValues();
    const msg = encodeURIComponent(
      `Hola, soy ${v.nombre}.\n\nQuiero agendar una cita para: *${v.tipo}*\n\nMi idea: ${v.desc}\n\nMi número: ${v.tel}`
    );
    const waLink = `https://wa.me/573227392938?text=${msg}`;

    // Después de mostrar el ok, abrir WhatsApp automáticamente
    setTimeout(() => {
      window.open(waLink, '_blank');
    }, 1200);

    // Reset después de 6s
    setTimeout(() => {
      document.getElementById('f-nombre').value = '';
      document.getElementById('f-tipo').value = '';
      document.getElementById('f-desc').value = '';
      document.getElementById('f-tel').value = '';
      formBtn.disabled = false;
      formBtn.textContent = 'Enviar solicitud';
      formBtn.style.display = '';
      formOk.classList.remove('visible');
    }, 6000);
  }, 1400);
});


// ===========================
// 6. SMOOTH SCROLL — links internos
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});


// ===========================
// 7. PARALLAX — hero title
// ===========================
const heroTitle = document.querySelector('.hero__title');
const heroBg = document.querySelector('.hero__lines');

if (heroTitle) {
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (sy < window.innerHeight) {
      heroTitle.style.transform = `translateY(${sy * 0.18}px)`;
      if (heroBg) heroBg.style.transform = `translateY(${sy * 0.06}px)`;
    }
  }, { passive: true });
}


// ===========================
// 8. MARQUEE — pausa on hover
// ===========================
const marqueeTrack = document.querySelector('.marquee__track');
if (marqueeTrack) {
  marqueeTrack.parentElement.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeTrack.parentElement.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}


// ===========================
// 9. HIGHLIGHT de sección activa en el nav
// ===========================
const sections = document.querySelectorAll('section[id], footer[id]');
const navAnchors = document.querySelectorAll('.nav__links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--bone)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));