(function () {
  "use strict";

  // Ano no rodapé
  var anoEl = document.getElementById("ano");
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  // Logo do header: rola suavemente até o topo, como qualquer outro link
  // âncora da página (antes forçava um reload completo).
  var brandLink = document.getElementById("brandLink");
  if (brandLink) {
    brandLink.addEventListener("click", function (e) {
      e.preventDefault();
      // #topo é o próprio header (position: sticky) — scrollIntoView nele
      // não faz nada, pois ele já fica "visível" colado no topo. Rolar a
      // janela até o início do documento é o que de fato volta ao topo.
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
      });
    });
  }

  // Menu mobile
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menu");
      });
    });
  }

  // Medição de CTAs do WhatsApp — cada botão/link com data-cta dispara
  // um evento (pronto para GA4/Google Ads assim que o cliente passar o ID).
  document.querySelectorAll("[data-cta]").forEach(function (el) {
    el.addEventListener("click", function () {
      var nomeCta = el.getAttribute("data-cta");

      // TROCAR: descomente e informe o ID de conversão do GA4/Google Ads
      // quando o cliente enviar. Não dispara nada enquanto estiver comentado.
      // if (window.gtag) {
      //   gtag("event", "whatsapp_click", { cta_section: nomeCta });
      // }

      if (window.console && console.info) {
        console.info("[DentalMed] CTA clicado:", nomeCta);
      }
    });
  });

  // Banner de cookies (LGPD) — simples aceitar/recusar, sem rastreamento
  // ativo (não há Analytics configurado ainda). Guarda a escolha do
  // visitante para não perguntar de novo.
  var cookieBanner = document.getElementById("cookieBanner");
  var cookieAceitar = document.getElementById("cookieAceitar");
  var cookieRecusar = document.getElementById("cookieRecusar");
  var COOKIE_KEY = "dentalmed-cookie-consent";

  function getConsent() {
    try {
      return window.localStorage.getItem(COOKIE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(valor) {
    try {
      window.localStorage.setItem(COOKIE_KEY, valor);
    } catch (e) {
      /* localStorage indisponível — banner simplesmente não reaparece nesta sessão */
    }
  }

  if (cookieBanner && !getConsent()) {
    cookieBanner.hidden = false;
  }

  if (cookieAceitar) {
    cookieAceitar.addEventListener("click", function () {
      setConsent("aceito");
      cookieBanner.hidden = true;
      // TROCAR: quando o GA4 estiver configurado, inicializar o gtag aqui,
      // só depois do aceite.
    });
  }

  if (cookieRecusar) {
    cookieRecusar.addEventListener("click", function () {
      setConsent("recusado");
      cookieBanner.hidden = true;
    });
  }

  // Carrossel de avaliações — loop infinito (clona a 1ª e a última slide),
  // navegável por botões, bolinhas, teclado e arraste (mouse/toque).
  function initCarousel(root) {
    var viewport = root.querySelector(".carousel-viewport");
    var track = root.querySelector(".carousel-track");
    var prevBtn = root.querySelector(".carousel-btn--prev");
    var nextBtn = root.querySelector(".carousel-btn--next");
    var dotsWrap = root.querySelector(".carousel-dots");
    if (!viewport || !track) return;

    var realSlides = Array.prototype.slice.call(track.children);
    var count = realSlides.length;
    if (count < 2) return;

    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Clona a última slide para o início e a primeira para o fim,
    // criando a ilusão de loop infinito sem "voltar" visualmente.
    var firstClone = realSlides[0].cloneNode(true);
    var lastClone = realSlides[count - 1].cloneNode(true);
    firstClone.setAttribute("aria-hidden", "true");
    lastClone.setAttribute("aria-hidden", "true");
    track.appendChild(firstClone);
    track.insertBefore(lastClone, track.firstChild);

    var index = 1; // posição 1 = primeira slide real (0 é o clone da última)
    var dots = [];
    // Trava novos avanços enquanto uma transição está em andamento — sem
    // isso, cliques rápidos empilham índices além dos clones e o carrossel
    // rola para um espaço vazio, sem imagem.
    var isAnimating = false;

    if (dotsWrap) {
      realSlides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", "Ir para avaliação " + (i + 1));
        dot.addEventListener("click", function () {
          goTo(i + 1);
        });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    function updateDots() {
      var realIndex = (index - 1 + count) % count;
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === realIndex);
      });
    }

    function setPosition(withTransition) {
      track.style.transition = withTransition && !reducedMotion ? "" : "none";
      track.style.transform = "translateX(" + (-index * 100) + "%)";
    }

    // Se a slide atual for um clone, pula sem animação para a slide real
    // correspondente (é isso que cria o efeito de loop contínuo).
    function normalizeIndex() {
      if (index === 0) {
        index = count;
        setPosition(false);
      } else if (index === count + 1) {
        index = 1;
        setPosition(false);
      }
    }

    function goTo(newIndex) {
      if (isAnimating) return;
      index = newIndex;
      updateDots();

      if (reducedMotion) {
        // sem transição real, o evento "transitionend" nunca dispara —
        // então já resolve o loop e libera o próximo clique na hora
        setPosition(false);
        normalizeIndex();
        return;
      }

      isAnimating = true;
      viewport.classList.remove("is-swapping");
      // força o navegador a "esquecer" a animação anterior antes de
      // reaplicar a classe, senão a segunda troca em seguida não anima
      void viewport.offsetWidth;
      viewport.classList.add("is-swapping");
      setPosition(true);
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    track.addEventListener("transitionend", function (e) {
      if (e.propertyName !== "transform") return;
      normalizeIndex();
      isAnimating = false;
    });

    viewport.addEventListener("animationend", function (e) {
      if (e.animationName !== "carouselFade") return;
      viewport.classList.remove("is-swapping");
    });

    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    root.setAttribute("tabindex", "0");
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });

    // Arraste por mouse/toque
    var dragging = false;
    var startX = 0;
    var startTranslate = 0;
    var viewportWidth = 1;

    function pointerDown(e) {
      if (isAnimating) return;
      dragging = true;
      startX = e.clientX;
      viewportWidth = viewport.getBoundingClientRect().width;
      startTranslate = -index * 100;
      track.classList.add("is-dragging");
      track.setPointerCapture && e.pointerId != null && track.setPointerCapture(e.pointerId);
    }

    function pointerMove(e) {
      if (!dragging) return;
      var deltaX = e.clientX - startX;
      var deltaPercent = (deltaX / viewportWidth) * 100;
      track.style.transform = "translateX(" + (startTranslate + deltaPercent) + "%)";
    }

    function pointerUp(e) {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("is-dragging");
      var deltaX = e.clientX - startX;
      var threshold = viewportWidth * 0.15;
      if (deltaX < -threshold) {
        next();
      } else if (deltaX > threshold) {
        prev();
      } else {
        setPosition(true);
      }
    }

    track.addEventListener("pointerdown", pointerDown);
    track.addEventListener("pointermove", pointerMove);
    track.addEventListener("pointerup", pointerUp);
    track.addEventListener("pointercancel", pointerUp);
    track.addEventListener("pointerleave", function (e) {
      if (dragging) pointerUp(e);
    });

    setPosition(false);
    updateDots();
  }

  document.querySelectorAll(".carousel").forEach(initCarousel);

  // Modais em tela cheia com os profissionais/funcionários da clínica
  document.querySelectorAll("[data-modal-open]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var dialog = document.getElementById(btn.getAttribute("data-modal-open"));
      if (dialog && typeof dialog.showModal === "function") dialog.showModal();
    });
  });

  document.querySelectorAll(".clinica-modal").forEach(function (dialog) {
    dialog.querySelectorAll("[data-modal-close]").forEach(function (btn) {
      btn.addEventListener("click", function () { dialog.close(); });
    });
    // Clique fora do conteúdo (no próprio <dialog>, área do backdrop) fecha
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });
  });

  // Fade/slide sutil ao rolar, respeitando prefers-reduced-motion
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var revealTargets = document.querySelectorAll(
    ".identifica, .procedimentos .proc-group, .educativo-grid, .processo .passos li, " +
    ".clinica-grid, .carousel, .localizacao-grid, .faq-item"
  );

  revealTargets.forEach(function (el) {
    el.classList.add("reveal");
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }
})();
