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

function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

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

function nextT() { showTestimonio((currentT + 1) % testimonios.length); }
function prevT() { showTestimonio((currentT - 1 + testimonios.length) % testimonios.length); }
function startAuto() { autoT = setInterval(nextT, 5500); }
function resetAuto() { clearInterval(autoT); startAuto(); }

if (tNext) tNext.addEventListener('click', () => { nextT(); resetAuto(); });
if (tPrev) tPrev.addEventListener('click', () => { prevT(); resetAuto(); });

tDots.forEach(dot => {
  dot.addEventListener('click', () => {
    showTestimonio(parseInt(dot.dataset.i, 10));
    resetAuto();
  });
});

const sliderEl = document.querySelector('.testimonios__slider');
if (sliderEl) {
  let tTouchStart = 0;
  sliderEl.addEventListener('touchstart', e => { tTouchStart = e.changedTouches[0].screenX; }, { passive: true });
  sliderEl.addEventListener('touchend', e => {
    const diff = tTouchStart - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) { diff > 0 ? nextT() : prevT(); resetAuto(); }
  });
}

if (testimonios.length > 0) { showTestimonio(0); startAuto(); }


// ===========================
// 5. FORMULARIO DE CONTACTO
// ===========================
const formBtn = document.getElementById('formBtn');
const formOk = document.getElementById('formOk');

if (formBtn) {
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
    setTimeout(() => { formBtn.textContent = 'Enviar solicitud'; formBtn.style.background = ''; }, 2800);
  }

  formBtn.addEventListener('click', () => {
    const err = validateForm();
    if (err) { setError(err); return; }
    formBtn.textContent = 'Enviando...';
    formBtn.disabled = true;
    setTimeout(() => {
      formBtn.style.display = 'none';
      formOk.classList.add('visible');
      const v = getFormValues();
      const msg = encodeURIComponent(`Hola, soy ${v.nombre}.\n\nQuiero agendar una cita para: *${v.tipo}*\n\nMi idea: ${v.desc}\n\nMi número: ${v.tel}`);
      setTimeout(() => window.open(`https://wa.me/57573227392938?text=${msg}`, '_blank'), 1200);
      setTimeout(() => {
        ['f-nombre', 'f-tipo', 'f-desc', 'f-tel'].forEach(id => document.getElementById(id).value = '');
        formBtn.disabled = false;
        formBtn.textContent = 'Enviar solicitud';
        formBtn.style.display = '';
        formOk.classList.remove('visible');
      }, 6000);
    }, 1400);
  });
}


// ===========================
// 6. SMOOTH SCROLL
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - (navbar.offsetHeight + 16), behavior: 'smooth' });
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
  marqueeTrack.parentElement.addEventListener('mouseenter', () => { marqueeTrack.style.animationPlayState = 'paused'; });
  marqueeTrack.parentElement.addEventListener('mouseleave', () => { marqueeTrack.style.animationPlayState = 'running'; });
}


// ===========================
// 9. HIGHLIGHT sección activa en nav
// ===========================
const sections = document.querySelectorAll('section[id], footer[id]');
const navAnchors = document.querySelectorAll('.nav__links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => { a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--bone)' : ''; });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));


// ==========================================================================
// 10. VIDEOS — SOLUCIÓN DEFINITIVA
//
// CAUSA RAÍZ DEL PROBLEMA:
// La clase .reveal pone opacity:0 + translateY en el .arte__item padre.
// Con preload="none", el video nunca carga por sí solo. Necesita que el
// JS llame explícitamente a .load() y .play(). El IntersectionObserver
// anterior dependía de que el elemento fuera "visto", pero como el item
// tiene opacity:0 por .reveal (y puede estar por debajo del fold),
// la combinación causaba que el video nunca se iniciara.
//
// SOLUCIÓN: Cargar los videos directamente en DOMContentLoaded, sin
// esperar ningún IntersectionObserver. El video tiene preload="none"
// así que no hay impacto en rendimiento hasta que se llame .load().
// ==========================================================================

function cargarVideo(video) {
  // Evitar doble inicialización
  if (video.dataset.loaded === 'true') return;
  video.dataset.loaded = 'true';

  const mp4 = video.getAttribute('data-src-mp4');
  const webm = video.getAttribute('data-src-webm');

  if (!mp4 && !webm) {
    console.warn('[Video] Sin fuentes definidas en data-src-mp4 / data-src-webm', video);
    return;
  }

  console.log(`[Video] Cargando: mp4="${mp4}" webm="${webm}"`);

  // Asignar src a los <source> con su tipo correcto
  const sources = video.querySelectorAll('source');
  if (sources[0] && webm) { sources[0].setAttribute('src', webm); sources[0].setAttribute('type', 'video/webm'); }
  if (sources[1] && mp4) { sources[1].setAttribute('src', mp4); sources[1].setAttribute('type', 'video/mp4'); }

  // Asignar también al <video> directamente (indispensable en iOS/Safari)
  if (mp4) video.setAttribute('src', mp4);

  // Forzar carga
  video.load();

  // Reproducir
  video.play()
    .then(() => console.log('[Video] ✅ Reproduciendo:', mp4 || webm))
    .catch(err => {
      console.warn('[Video] ⚠️ Autoplay no permitido aún, esperando interacción del usuario:', err.message);
      // Segundo intento al hacer scroll o click en la página
      const retry = () => {
        video.play().catch(() => { });
        document.removeEventListener('scroll', retry);
        document.removeEventListener('click', retry);
      };
      document.addEventListener('scroll', retry, { once: true });
      document.addEventListener('click', retry, { once: true });
    });
}

// Arrancar en DOMContentLoaded (DOM listo, recursos aún pueden estar cargando)
document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('.arte__video-lazy');
  console.log(`[Video] DOM listo. Videos encontrados: ${videos.length}`);
  videos.forEach((v, i) => {
    console.log(`[Video ${i + 1}] Procesando...`);
    cargarVideo(v);
  });
});

// Seguro extra: si el script corre después de DOMContentLoaded (script diferido o en body)
if (document.readyState !== 'loading') {
  const videos = document.querySelectorAll('.arte__video-lazy');
  videos.forEach(v => cargarVideo(v));
}