/* ============================================
   FepPhoto 遠東照相館 - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initRevealAnimations();
  initCounters();
  initGalleryLightbox();
  initProductTabs();
  highlightActiveNav();
});

/* === Navbar === */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (!navbar) return;

  // Scroll effect
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('mobile-open');
    });
    // Close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('mobile-open');
      });
    });
  }
}

/* === Scroll Reveal === */
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* === Number Counter Animation === */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 16);
}

/* === Gallery Lightbox === */
function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  // Create lightbox
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-content">
      <button class="lb-close" aria-label="關閉">✕</button>
      <button class="lb-prev" aria-label="上一張">&#8249;</button>
      <img class="lb-img" src="" alt="">
      <button class="lb-next" aria-label="下一張">&#8250;</button>
      <p class="lb-caption"></p>
    </div>
  `;
  document.body.appendChild(lb);

  // Lightbox styles
  const style = document.createElement('style');
  style.textContent = `
    #lightbox { display:none; position:fixed; inset:0; z-index:9999; align-items:center; justify-content:center; }
    #lightbox.open { display:flex; }
    .lb-backdrop { position:absolute; inset:0; background:rgba(0,0,0,0.92); backdrop-filter:blur(8px); cursor:pointer; }
    .lb-content { position:relative; z-index:1; max-width:90vw; max-height:90vh; text-align:center; }
    .lb-img { max-width:90vw; max-height:80vh; object-fit:contain; border-radius:8px; box-shadow:0 20px 60px rgba(0,0,0,0.5); }
    .lb-close { position:fixed; top:1.5rem; right:1.5rem; background:rgba(255,255,255,0.15); border:none; color:white; width:44px; height:44px; border-radius:50%; font-size:1.2rem; cursor:pointer; transition:background 0.2s; }
    .lb-close:hover { background:rgba(255,255,255,0.3); }
    .lb-prev, .lb-next { position:fixed; top:50%; transform:translateY(-50%); background:rgba(255,255,255,0.12); border:none; color:white; width:52px; height:52px; border-radius:50%; font-size:2rem; cursor:pointer; transition:background 0.2s; display:flex; align-items:center; justify-content:center; line-height:1; }
    .lb-prev:hover, .lb-next:hover { background:rgba(255,255,255,0.25); }
    .lb-prev { left:1.5rem; }
    .lb-next { right:1.5rem; }
    .lb-caption { color:rgba(255,255,255,0.65); margin-top:1rem; font-size:0.9rem; }
  `;
  document.head.appendChild(style);

  let currentIndex = 0;
  const images = [];

  items.forEach((item, i) => {
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-info-text');
    if (img) images.push({ src: img.src, caption: caption?.textContent || '' });
    item.addEventListener('click', () => openLightbox(i));
  });

  function openLightbox(i) {
    currentIndex = i;
    lb.classList.add('open');
    updateLightbox();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    lb.querySelector('.lb-img').src = images[currentIndex]?.src;
    lb.querySelector('.lb-caption').textContent = images[currentIndex]?.caption || '';
  }

  lb.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
  lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lb.querySelector('.lb-prev').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  });
  lb.querySelector('.lb-next').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + images.length) % images.length; updateLightbox(); }
    if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % images.length; updateLightbox(); }
  });
}

/* === Product Tabs === */
function initProductTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.product-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
        card.style.animation = show ? 'fadeInUp 0.4s ease forwards' : '';
      });
    });
  });
}

/* === Highlight Active Nav Link === */
function highlightActiveNav() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}
