(function () {
  // Carrusel de fotos de la portada: cambia sola cada 5s y con los puntos.
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('.hero-carousel-dots button');
  if (slides.length > 1) {
    var current = 0;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var timer;

    function showSlide(index) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('active');
      dots[current].setAttribute('aria-selected', 'false');
      current = index;
      slides[current].classList.add('is-active');
      dots[current].classList.add('active');
      dots[current].setAttribute('aria-selected', 'true');
    }

    function resetTimer() {
      clearInterval(timer);
      if (!reduceMotion) {
        timer = setInterval(function () { showSlide((current + 1) % slides.length); }, 5000);
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        if (index === current) return;
        showSlide(index);
        resetTimer();
      });
    });

    resetTimer();
  }

  var nav = document.getElementById('menu-principal');
  var toggle = document.querySelector('.nav-toggle');
  var subItems = document.querySelectorAll('.has-sub');

  function closeSubs(except) {
    subItems.forEach(function (li) {
      if (li === except) return;
      li.classList.remove('open');
      li.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
    });
  }

  // Submenús: se despliegan al hacer click
  subItems.forEach(function (li) {
    var btn = li.querySelector('.nav-link');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !li.classList.contains('open');
      closeSubs(li);
      li.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  function closeAll() {
    closeSubs(null);
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  // Menú móvil
  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Cerrar al elegir un destino, al hacer click afuera o con Escape
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeAll();
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.site-header')) closeAll();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });

  // Formulario de contacto: por ahora no envía a ningún lado.
  // TODO: conectarlo a un backend (o servicio de formularios) que envíe un mail a la casilla del Centro,
  // y reemplazar acá el mensaje de status por la confirmación real del envío.
  var form = document.getElementById('form-contacto');
  var status = form.querySelector('.form-status');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var nombre = (data.get('nombre') || '').toString().trim();
    var mail = (data.get('mail') || '').toString().trim();
    if (!nombre || !EMAIL_RE.test(mail)) {
      status.textContent = 'Completá tu nombre y un mail válido para que podamos responderte.';
      status.className = 'form-status error';
      return;
    }
    status.textContent = 'Todavía estamos conectando este formulario con nuestro mail. Mientras tanto, escribinos por WhatsApp o llamanos: ¡vamos a responderte enseguida!';
    status.className = 'form-status';
  });

  // Eventos: al hacer click (o Enter/Espacio) en una tarjeta se abre una ventana
  // con el detalle y la galería de fotos armada a partir de esa misma tarjeta.
  // Si el evento todavía no tiene fotos reales (los <span> vacíos de .gallery),
  // la ventana muestra un recuadro placeholder en lugar de una imagen.
  var eventCards = document.querySelectorAll('.event-card');
  var eventModal = document.getElementById('event-modal');

  if (eventCards.length && eventModal) {
    var modalMain = document.getElementById('event-modal-main');
    var modalThumbs = document.getElementById('event-modal-thumbs');
    var modalDate = document.getElementById('event-modal-date');
    var modalTitle = document.getElementById('event-modal-title');
    var modalText = document.getElementById('event-modal-text');
    var modalCloseBtn = document.getElementById('event-modal-close');
    var lastFocused = null;
    var images = [];
    var activeIndex = 0;

    function renderMain() {
      var item = images[activeIndex];
      modalMain.innerHTML = '';
      if (item) {
        var img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt;
        modalMain.appendChild(img);
      }
    }

    function renderThumbs() {
      modalThumbs.innerHTML = '';
      if (images.length < 2) return;
      images.forEach(function (item, index) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = index === activeIndex ? 'active' : '';
        btn.setAttribute('aria-label', 'Ver foto ' + (index + 1) + ' de ' + images.length);
        if (item) {
          var img = document.createElement('img');
          img.src = item.src;
          img.alt = '';
          btn.appendChild(img);
        }
        btn.addEventListener('click', function () {
          activeIndex = index;
          renderMain();
          modalThumbs.querySelectorAll('button').forEach(function (b, i) {
            b.classList.toggle('active', i === index);
          });
        });
        modalThumbs.appendChild(btn);
      });
    }

    function openEventModal(card) {
      var galleryItems = card.querySelectorAll('.gallery > *');
      images = Array.prototype.map.call(galleryItems, function (el) {
        return el.tagName === 'IMG' ? { src: el.src, alt: el.alt } : null;
      });
      activeIndex = 0;
      modalDate.textContent = card.querySelector('.event-date').textContent;
      modalTitle.textContent = card.querySelector('h3').textContent;
      modalText.textContent = card.querySelector('.event-text').textContent;
      renderMain();
      renderThumbs();

      lastFocused = document.activeElement;
      eventModal.hidden = false;
      document.body.style.overflow = 'hidden';
      modalCloseBtn.focus();
    }

    function closeEventModal() {
      eventModal.hidden = true;
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    eventCards.forEach(function (card) {
      card.addEventListener('click', function () { openEventModal(card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openEventModal(card);
        }
      });
    });

    modalCloseBtn.addEventListener('click', closeEventModal);
    eventModal.addEventListener('click', function (e) {
      if (e.target === eventModal) closeEventModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !eventModal.hidden) closeEventModal();
    });
  }

  // Proyectos: al hacer click (o Enter/Espacio) en un área se abre una ventana con el
  // detalle y una foto más grande. La foto sale del atributo data-modal-image de la
  // tarjeta; las áreas que todavía no tienen foto real muestran un recuadro placeholder.
  var projectCards = document.querySelectorAll('.project');
  var projectModal = document.getElementById('project-modal');

  if (projectCards.length && projectModal) {
    var pModalMedia = document.getElementById('project-modal-media');
    var pModalTitle = document.getElementById('project-modal-title');
    var pModalText = document.getElementById('project-modal-text');
    var pModalClose = document.getElementById('project-modal-close');
    var pModalBack = document.getElementById('project-modal-back');
    var pLastFocused = null;

    function openProjectModal(card) {
      var src = card.getAttribute('data-modal-image');
      var alt = card.getAttribute('data-modal-image-alt') || '';
      pModalMedia.innerHTML = '';
      if (src) {
        var img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        pModalMedia.appendChild(img);
      }
      pModalTitle.textContent = card.querySelector('h3').textContent;
      pModalText.textContent = card.querySelector('p').textContent;

      pLastFocused = document.activeElement;
      projectModal.hidden = false;
      document.body.style.overflow = 'hidden';
      pModalClose.focus();
    }

    function closeProjectModal() {
      projectModal.hidden = true;
      document.body.style.overflow = '';
      if (pLastFocused) pLastFocused.focus();
    }

    projectCards.forEach(function (card) {
      card.addEventListener('click', function () { openProjectModal(card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openProjectModal(card);
        }
      });
    });

    pModalClose.addEventListener('click', closeProjectModal);
    pModalBack.addEventListener('click', closeProjectModal);
    document.getElementById('project-modal-cta').addEventListener('click', closeProjectModal);
    projectModal.addEventListener('click', function (e) {
      if (e.target === projectModal) closeProjectModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !projectModal.hidden) closeProjectModal();
    });
  }

  // Carrusel de Eventos: los botones desplazan la fila una tarjeta por vez.
  // El click para abrir la ventana de detalle de cada evento sigue andando igual.
  var eventsTrack = document.getElementById('events-track');
  var eventsPrev = document.getElementById('events-prev');
  var eventsNext = document.getElementById('events-next');

  if (eventsTrack && eventsPrev && eventsNext) {
    function scrollEvents(direction) {
      var card = eventsTrack.querySelector('.event-card');
      if (!card) return;
      var gap = parseFloat(getComputedStyle(eventsTrack).columnGap) || 0;
      var amount = card.getBoundingClientRect().width + gap;
      eventsTrack.scrollBy({ left: direction * amount, behavior: 'smooth' });
    }
    eventsPrev.addEventListener('click', function () { scrollEvents(-1); });
    eventsNext.addEventListener('click', function () { scrollEvents(1); });
  }

  document.getElementById('anio').textContent = new Date().getFullYear();
})();
