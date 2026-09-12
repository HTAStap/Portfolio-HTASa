'use strict';

// --- Бургер-меню ---
const menu = document.querySelector('.menu');
const menuToggle = document.querySelector('.menu-toggle');

if (menu && menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });
}

// --- Виггл-анимация заголовков при наведении ---
document.querySelectorAll('.wiggle-title').forEach((title) => {
  title.addEventListener('mouseenter', () => {
    title.classList.remove('wiggle');
    void title.offsetWidth; // форсируем reflow, чтобы анимация перезапустилась
    title.classList.add('wiggle');
  });

  title.addEventListener('animationend', () => {
    title.classList.remove('wiggle');
  });
});

// --- Горизонтальный селектор проектов ---
const projectSelector = document.querySelector('.project-selector');
const selectorArrow = document.querySelector('.selector-arrow');

if (projectSelector) {
  projectSelector.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      projectSelector.scrollLeft += e.deltaY * 3;
    }
  }, { passive: false });

  if (selectorArrow) {
    let scrolling = false;

    const scrollStep = () => {
      if (!scrolling) return;
      projectSelector.scrollLeft += 15;
      requestAnimationFrame(scrollStep);
    };

    selectorArrow.addEventListener('mouseenter', () => {
      selectorArrow.classList.add('scrolling');
      scrolling = true;
      requestAnimationFrame(scrollStep);
    });

    selectorArrow.addEventListener('mouseleave', () => {
      selectorArrow.classList.remove('scrolling');
      scrolling = false;
    });
  }
}

// --- Модалка галереи ---
const galleryParams = new URLSearchParams(window.location.search);
const galleryModal = document.getElementById('galleryModal');
const galleryCards = document.querySelectorAll('.gallery-card');

if (galleryModal) {
  const modalImg = galleryModal.querySelector('.gallery-modal-img');
  const modalClose = galleryModal.querySelector('.gallery-modal-close');
  const modalOverlay = galleryModal.querySelector('.gallery-modal-overlay');
  const modalPrev = galleryModal.querySelector('.gallery-modal-prev');
  const modalNext = galleryModal.querySelector('.gallery-modal-next');

  let visibleCards = [];
  let currentIndex = -1;

  function getVisibleCards() {
    return Array.from(galleryCards).filter((c) => !c.classList.contains('hidden'));
  }

  function showCardAtIndex(index) {
    const card = visibleCards[index];
    if (!card) return;
    const img = card.querySelector('.gallery-img');
    if (!img) return;
    currentIndex = index;
    modalImg.src = img.src;
    modalImg.alt = img.alt;
  }

  function openModal(card) {
    visibleCards = getVisibleCards();
    const index = visibleCards.indexOf(card);
    showCardAtIndex(index === -1 ? 0 : index);
    galleryModal.classList.add('open');
    galleryModal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    galleryModal.classList.remove('open');
    galleryModal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
  }

  function showPrev() {
    if (!visibleCards.length) return;
    showCardAtIndex((currentIndex - 1 + visibleCards.length) % visibleCards.length);
  }

  function showNext() {
    if (!visibleCards.length) return;
    showCardAtIndex((currentIndex + 1) % visibleCards.length);
  }

  galleryCards.forEach((card) => {
    card.addEventListener('click', () => openModal(card));
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);
  modalPrev.addEventListener('click', showPrev);
  modalNext.addEventListener('click', showNext);

  document.addEventListener('keydown', (e) => {
    if (!galleryModal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  const openId = galleryParams.get('open');
  if (openId) {
    const targetCard = document.querySelector(`.gallery-card[data-id="${openId}"]`);
    if (targetCard) {
      openModal(targetCard);
    }
  }
}

// --- Фильтры галереи ---
const filterButtons = document.querySelectorAll('.filter-btn');

function applyFilter(filter) {
  galleryCards.forEach((card) => {
    const show = filter === 'all' || card.dataset.category === filter;
    card.classList.toggle('hidden', !show);
  });

  filterButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
}

if (filterButtons.length && galleryCards.length) {
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  applyFilter(galleryParams.get('filter') || 'all');
}

// --- Кнопка "Назад" на странице проекта ---
const backLink = document.getElementById('backLink');

if (backLink) {
  backLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = backLink.href;
    }
  });
}

// --- Просмотр кадров проекта: миниатюры меняют большую картинку ---
const viewerImg = document.getElementById('projectViewerImg');
const viewerThumbsWrap = document.querySelector('.project-viewer-thumbs');
const viewerArrow = document.querySelector('.project-thumbs-arrow');

if (viewerImg && viewerThumbsWrap) {
  const thumbs = viewerThumbsWrap.querySelectorAll('.project-thumb');

  const showThumb = (thumb) => {
    const img = thumb.querySelector('img');
    if (!img) return;
    viewerImg.src = img.src;
    viewerImg.alt = img.alt;
    viewerImg.style.display = '';
    thumbs.forEach((t) => t.classList.remove('active'));
    thumb.classList.add('active');
  };

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => showThumb(thumb));
  });

  const initialThumb = viewerThumbsWrap.querySelector('.project-thumb.active') || thumbs[0];
  if (initialThumb) showThumb(initialThumb);

  viewerThumbsWrap.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      viewerThumbsWrap.scrollLeft += e.deltaY * 3;
    }
  }, { passive: false });

  if (viewerArrow) {
    let scrolling = false;

    const scrollStep = () => {
      if (!scrolling) return;
      viewerThumbsWrap.scrollLeft += 12;
      requestAnimationFrame(scrollStep);
    };

    viewerArrow.addEventListener('mouseenter', () => {
      viewerArrow.classList.add('scrolling');
      scrolling = true;
      requestAnimationFrame(scrollStep);
    });

    viewerArrow.addEventListener('mouseleave', () => {
      viewerArrow.classList.remove('scrolling');
      scrolling = false;
    });
  }
}