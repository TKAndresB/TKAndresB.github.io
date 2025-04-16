document.addEventListener('DOMContentLoaded', function() {
  // Elementos DOM
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const themeToggle = document.getElementById('theme-toggle');
  const backToTopBtn = document.getElementById('back-to-top');
  const filterToggle = document.getElementById('filter-toggle');
  const filterOptions = document.querySelector('.filter-options');
  const regionFilter = document.getElementById('region-filter');
  const sortFilter = document.getElementById('sort-filter');
  const searchInput = document.querySelector('input[type="text"][id^="search"]');
  const searchBtn = document.getElementById('search-btn');
  const carouselBtns = document.querySelectorAll('.carousel-btn');
  const carouselTrack = document.querySelector('.carousel-track');
  const downloadBtns = document.querySelectorAll('.btn-download');
  const podcastBtns = document.querySelectorAll('.btn-podcast');
  const shareBtns = document.querySelectorAll('.btn-share');
  const modalContainer = document.getElementById('modal-container');
  const modalClose = document.querySelector('.modal-close');
  const shareModal = document.getElementById('share-modal');
  const copyLinkBtn = document.getElementById('copy-link');
  const contactForm = document.getElementById('contact-form');
  const newsletterForm = document.getElementById('newsletter-form');
  const commentForm = document.querySelector('.comment-form');
  const playBtn = document.querySelector('.play-btn');

  // Inicialización del tema
  initTheme();

  // Menú móvil
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      this.classList.toggle('active');
      mainNav.classList.toggle('active');
    });
  }

  // Cambio de tema (claro/oscuro)
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
  }

  // Botón volver arriba
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Filtros en móvil
  if (filterToggle && filterOptions) {
    filterToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      filterOptions.classList.toggle('active');
    });
  }

  // Filtrado por región
  if (regionFilter) {
    const items = document.querySelectorAll('[data-region]');
    const resultsCount = document.querySelector('#results-count span');

    regionFilter.addEventListener('change', function() {
      const selectedRegion = this.value.toLowerCase();
      let visibleCount = 0;

      items.forEach(item => {
        const itemRegion = item.getAttribute('data-region').toLowerCase();
        
        if (selectedRegion === 'todas' || selectedRegion === 'all' || selectedRegion === itemRegion) {
          item.style.display = 'block';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });

      if (resultsCount) {
        resultsCount.textContent = visibleCount;
      }
    });
  }

  // Ordenar elementos
  if (sortFilter) {
    const itemsContainer = document.querySelector('.mitos-grid') || document.querySelector('.leyendas-grid');
    
    if (itemsContainer) {
      sortFilter.addEventListener('change', function() {
        const items = Array.from(itemsContainer.children);
        const sortValue = this.value;
        
        items.sort((a, b) => {
          if (sortValue === 'alfabetico') {
            return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
          } else if (sortValue === 'alfabetico-desc') {
            return b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent);
          } else if (sortValue === 'popularidad') {
            return parseInt(b.getAttribute('data-popularity') || 0) - parseInt(a.getAttribute('data-popularity') || 0);
          } else {
            return 0;
          }
        });
        
        // Vaciar y volver a llenar el contenedor con los elementos ordenados
        itemsContainer.innerHTML = '';
        items.forEach(item => itemsContainer.appendChild(item));
      });
    }
  }

  // Búsqueda
  if (searchInput && searchBtn) {
    const items = document.querySelectorAll('.mito-card h3, .leyenda-card h3');
    const resultsCount = document.querySelector('#results-count span');
    
    const performSearch = () => {
      const searchTerm = searchInput.value.toLowerCase();
      let visibleCount = 0;
      
      items.forEach(item => {
        const card = item.closest('.mito-card') || item.closest('.leyenda-card');
        const title = item.textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });
      
      if (resultsCount) {
        resultsCount.textContent = visibleCount;
      }
    };
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }

  // Carrusel
  if (carouselTrack && carouselBtns.length) {
    let position = 0;
    const itemWidth = carouselTrack.querySelector('.featured-card').offsetWidth + 24; // Ancho + gap
    const itemsCount = carouselTrack.querySelectorAll('.featured-card').length;
    const visibleItems = Math.floor(carouselTrack.parentElement.offsetWidth / itemWidth);
    const maxPosition = Math.max(0, itemsCount - visibleItems);
    
    // Crear indicadores
    const indicators = document.querySelector('.carousel-indicators');
    if (indicators) {
      for (let i = 0; i <= maxPosition; i++) {
        const indicator = document.createElement('button');
        indicator.classList.add('carousel-indicator');
        if (i === 0) indicator.classList.add('active');
        indicator.setAttribute('aria-label', `Ir a slide ${i + 1}`);
        indicator.addEventListener('click', () => {
          position = i;
          updateCarousel();
        });
        indicators.appendChild(indicator);
      }
    }
    
    const updateCarousel = () => {
      carouselTrack.style.transform = `translateX(-${position * itemWidth}px)`;
      
      // Actualizar indicadores
      if (indicators) {
        const allIndicators = indicators.querySelectorAll('.carousel-indicator');
        allIndicators.forEach((ind, i) => {
          ind.classList.toggle('active', i === position);
        });
      }
      
      // Habilitar/deshabilitar botones
      carouselBtns[0].disabled = position === 0;
      carouselBtns[1].disabled = position === maxPosition;
    };
    
    carouselBtns[0].addEventListener('click', () => {
      if (position > 0) {
        position--;
        updateCarousel();
      }
    });
    
    carouselBtns[1].addEventListener('click', () => {
      if (position < maxPosition) {
        position++;
        updateCarousel();
      }
    });
    
    // Inicializar
    updateCarousel();
    
    // Responsive
    window.addEventListener('resize', () => {
      const newVisibleItems = Math.floor(carouselTrack.parentElement.offsetWidth / itemWidth);
      const newMaxPosition = Math.max(0, itemsCount - newVisibleItems);
      
      if (position > newMaxPosition) {
        position = newMaxPosition;
      }
      
      updateCarousel();
    });
  }

  // Botones de descarga
  if (downloadBtns.length) {
    downloadBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const fileUrl = this.getAttribute('data-file');
        if (fileUrl) {
          window.open(fileUrl, '_blank');
        } else {
          alert('El archivo no está disponible en este momento.');
        }
      });
    });
  }

  // Botones de podcast
  if (podcastBtns.length) {
    podcastBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const podcastId = this.getAttribute('data-podcast');
        if (podcastId) {
          window.open(`https://raicesyletras.co/podcast/${podcastId}`, '_blank');
        } else {
          alert('El podcast no está disponible en este momento.');
        }
      });
    });
  }

  // Botones de compartir
  if (shareBtns.length && shareModal) {
    shareBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const storyId = this.getAttribute('data-share');
        const shareUrl = document.getElementById('share-url');
        
        if (shareUrl) {
          shareUrl.value = `https://raicesyletras.co/historia/${storyId || ''}`;
        }
        
        shareModal.classList.add('active');
        shareModal.setAttribute('aria-hidden', 'false');
      });
    });
  }

  // Cerrar modal
  if (modalClose && modalContainer) {
    modalClose.addEventListener('click', function() {
      const modal = this.closest('.modal-container');
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    });
    
    // Cerrar al hacer clic fuera
    modalContainer.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
        this.setAttribute('aria-hidden', 'true');
      }
    });
    
    // Cerrar con Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modalContainer.classList.contains('active')) {
        modalContainer.classList.remove('active');
        modalContainer.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Copiar enlace
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', function() {
      const shareUrl = document.getElementById('share-url');
      
      if (shareUrl) {
        shareUrl.select();
        document.execCommand('copy');
        
        const originalText = this.textContent;
        this.textContent = 'Copiado!';
        
        setTimeout(() => {
          this.textContent = originalText;
        }, 2000);
      }
    });
  }

  // Formulario de contacto
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simulación de envío
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
      
      setTimeout(() => {
        alert('¡Gracias por compartir tu historia! Pronto nos pondremos en contacto contigo.');
        this.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 1500);
    });
  }

  // Formulario de newsletter
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simulación de suscripción
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Suscribiendo...';
      
      setTimeout(() => {
        alert('¡Gracias por suscribirte a nuestro boletín!');
        this.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 1500);
    });
  }

  // Formulario de comentarios
  if (commentForm) {
    commentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simulación de publicación de comentario
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Publicando...';
      
      setTimeout(() => {
        alert('¡Gracias por tu comentario! Será revisado y publicado pronto.');
        this.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 1500);
    });
  }

  // Reproductor de audio
  if (playBtn) {
    playBtn.addEventListener('click', function() {
      const isPlaying = this.classList.contains('playing');
      
      if (isPlaying) {
        this.textContent = '▶';
        this.classList.remove('playing');
      } else {
        this.textContent = '⏸';
        this.classList.add('playing');
      }
    });
  }

  // Paginación
  const pageNumbers = document.querySelectorAll('.page-number');
  const paginationBtns = document.querySelectorAll('.pagination-btn');
  
  if (pageNumbers.length) {
    let currentPage = 0;
    
    pageNumbers.forEach((btn, index) => {
      btn.addEventListener('click', function() {
        pageNumbers.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        this.setAttribute('aria-current', 'page');
        currentPage = index;
        
        // Actualizar botones de navegación
        if (paginationBtns.length === 2) {
          paginationBtns[0].disabled = currentPage === 0;
          paginationBtns[1].disabled = currentPage === pageNumbers.length - 1;
        }
        
        // Aquí iría la lógica para cargar la página correspondiente
        // Por ahora solo simulamos
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    });
    
    // Botones anterior/siguiente
    if (paginationBtns.length === 2) {
      paginationBtns[0].addEventListener('click', function() {
        if (currentPage > 0) {
          pageNumbers[currentPage - 1].click();
        }
      });
      
      paginationBtns[1].addEventListener('click', function() {
        if (currentPage < pageNumbers.length - 1) {
          pageNumbers[currentPage + 1].click();
        }
      });
    }
  }

  // Animaciones al hacer scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.featured-card, .region-card, .mito-card, .leyenda-card, .about-content, .podcast-container, .contact-container');
    
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - 100;
      
      if (isVisible) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  };
  
  // Inicializar animaciones
  elements = document.querySelectorAll('.featured-card, .region-card, .mito-card, .leyenda-card, .about-content, .podcast-container, .contact-container');
  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Ejecutar una vez al cargar
});

// Función para inicializar el tema
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
}