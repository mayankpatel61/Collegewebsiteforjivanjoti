/**
 * Jivan Joti Nursing College — Main JavaScript
 * Features: Page loader, navbar scroll effects, dark mode, animated counters,
 *           testimonials slider, gallery filter, form validation, back-to-top,
 *           search overlay, scroll progress fallback, hero particles.
 */

'use strict';

/* =====================================================
   UTILITIES
   ===================================================== */

/**
 * Safely query a single DOM element.
 * @param {string} selector
 * @param {Element} [context=document]
 * @returns {Element|null}
 */
const $ = (selector, context = document) => context.querySelector(selector);

/**
 * Safely query multiple DOM elements.
 * @param {string} selector
 * @param {Element} [context=document]
 * @returns {NodeList}
 */
const $$ = (selector, context = document) => context.querySelectorAll(selector);

/**
 * Debounce a function call.
 * @param {Function} fn
 * @param {number} delay
 */
const debounce = (fn, delay = 150) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/* =====================================================
   PAGE LOADER
   ===================================================== */
const loader = $('#page-loader');

window.addEventListener('load', () => {
  // Hide loader after page fully loads
  setTimeout(() => {
    if (loader) {
      loader.classList.add('hidden');
    }
  }, 800);
});

/* =====================================================
   SCROLL PROGRESS BAR (JS Fallback for non-supported browsers)
   ===================================================== */
if (!CSS.supports('animation-timeline', 'scroll()')) {
  const progressBar = $('#scroll-progress');

  if (progressBar) {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progressPercentage = scrollable > 0 ? scrolled / scrollable : 0;
      progressBar.style.transform = `scaleX(${progressPercentage})`;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
  }
}

/* =====================================================
   NAVBAR — SCROLL EFFECTS & ACTIVE STATE
   ===================================================== */
const navbar = $('#mainNavbar');
const navLinks = $$('.nav-link[href^="#"]', navbar);

// Scroll class toggling (fallback for non-CSS-animation browsers)
if (!CSS.supports('animation-timeline', 'scroll()') && navbar) {
  const handleNavbarScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();
}

// Highlight active nav link based on scroll position
const updateActiveNavLink = () => {
  const sections = $$('section[id]');
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) + 20);
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
};

window.addEventListener('scroll', debounce(updateActiveNavLink, 50), { passive: true });

/* =====================================================
   DARK MODE TOGGLE
   ===================================================== */
const darkModeToggle = $('#darkModeToggle');
const darkModeIcon = $('#darkModeIcon');
const DARK_MODE_KEY = 'jivanjoti-nursing-dark-mode';

// Apply saved preference on load
const savedTheme = localStorage.getItem(DARK_MODE_KEY);
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  if (darkModeIcon) {
    darkModeIcon.classList.replace('fa-moon', 'fa-sun');
  }
}

if (darkModeToggle) {
  darkModeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem(DARK_MODE_KEY, 'light');
      darkModeIcon.classList.replace('fa-sun', 'fa-moon');
      darkModeToggle.setAttribute('aria-label', 'Switch to dark mode');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem(DARK_MODE_KEY, 'dark');
      darkModeIcon.classList.replace('fa-moon', 'fa-sun');
      darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
    }
  });
}

/* =====================================================
   SEARCH OVERLAY
   ===================================================== */
const searchToggleBtn = $('#searchToggleBtn');
const searchCloseBtn = $('#searchCloseBtn');
const searchOverlay = $('#searchOverlay');
const searchInput = $('#searchInput');
const searchResults = $('#searchResults');

// Searchable content index
const searchIndex = [
  { title: 'B.Sc Nursing Program', section: '#courses', desc: '4-year undergraduate nursing degree' },
  { title: 'GNM – General Nursing and Midwifery', section: '#courses', desc: '3.5-year diploma nursing program' },
  { title: 'ANM – Auxiliary Nursing Midwifery', section: '#courses', desc: '2-year community nursing diploma' },
  { title: 'Post Basic B.Sc Nursing', section: '#courses', desc: '2-year degree upgrade for GNM nurses' },
  { title: 'Admissions 2025-26', section: '#admissions', desc: 'Apply for nursing courses' },
  { title: 'Eligibility Criteria', section: '#admissions', desc: 'Requirements for nursing admissions' },
  { title: 'Fee Structure', section: '#admissions', desc: 'Annual tuition and hostel fees' },
  { title: 'Faculty', section: '#faculty', desc: 'Meet our experienced nursing professors' },
  { title: 'Dr. Anita Sharma – Principal', section: '#faculty', desc: "Principal's message and profile" },
  { title: 'Nursing Labs', section: '#facilities', desc: 'State-of-the-art simulation labs' },
  { title: 'Library', section: '#facilities', desc: 'Health Sciences Library with 10,000+ books' },
  { title: 'Hostel Facilities', section: '#facilities', desc: 'Separate hostels for boys and girls' },
  { title: 'Placement Rate 95%', section: '#placements', desc: 'Career support and hospital placements' },
  { title: 'Apollo Hospitals Partnership', section: '#placements', desc: 'Placement partner hospitals' },
  { title: 'Annual Health Camp', section: '#news', desc: 'Community health events and camps' },
  { title: 'Contact Us', section: '#contact', desc: 'Phone, email and address' },
  { title: 'About Jivan Joti Nursing College', section: '#about', desc: 'History, vision and mission' },
  { title: 'Scholarships', section: '#faq', desc: 'Merit and EWS scholarships available' },
  { title: 'Gallery', section: '#gallery', desc: 'Campus and event photos' },
];

const openSearch = () => {
  searchOverlay.classList.add('active');
  searchOverlay.setAttribute('aria-hidden', 'false');
  searchToggleBtn.setAttribute('aria-expanded', 'true');
  setTimeout(() => searchInput.focus(), 100);
};

const closeSearch = () => {
  searchOverlay.classList.remove('active');
  searchOverlay.setAttribute('aria-hidden', 'true');
  searchToggleBtn.setAttribute('aria-expanded', 'false');
  searchInput.value = '';
  searchResults.innerHTML = '';
};

if (searchToggleBtn) {
  searchToggleBtn.addEventListener('click', openSearch);
}
if (searchCloseBtn) {
  searchCloseBtn.addEventListener('click', closeSearch);
}

// Close on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
    closeSearch();
  }
});

// Close on overlay background click
searchOverlay?.addEventListener('click', (e) => {
  if (e.target === searchOverlay) closeSearch();
});

// Live search
searchInput?.addEventListener('input', debounce((e) => {
  const query = e.target.value.toLowerCase().trim();
  searchResults.innerHTML = '';

  if (!query) return;

  const matches = searchIndex.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.desc.toLowerCase().includes(query)
  );

  if (matches.length === 0) {
    searchResults.innerHTML = '<p style="color:rgba(255,255,255,0.5); padding: 1rem;">No results found for your search.</p>';
    return;
  }

  matches.slice(0, 6).forEach(match => {
    const item = document.createElement('div');
    item.className = 'search-result-item';
    item.innerHTML = `
      <strong style="color:white; font-size:0.95rem;">${match.title}</strong>
      <p style="color:rgba(255,255,255,0.5); font-size:0.8rem; margin:0.25rem 0 0;">${match.desc}</p>
    `;
    item.addEventListener('click', () => {
      closeSearch();
      const targetEl = document.querySelector(match.section);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') item.click();
    });
    item.setAttribute('tabindex', '0');
    searchResults.appendChild(item);
  });
}, 200));

/* =====================================================
   ANIMATED COUNTERS
   ===================================================== */
const animateCounter = (el) => {
  const target = parseInt(el.dataset.target, 10);
  if (isNaN(target)) return;

  const duration = 2000; // 2 seconds
  const start = performance.now();

  const update = (timestamp) => {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString();
    }
  };

  requestAnimationFrame(update);
};

// Observe counter elements
const counterEls = $$('[data-target]');
if (counterEls.length > 0 && 'IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObserver.observe(el));
} else {
  // Fallback: animate immediately
  counterEls.forEach(el => animateCounter(el));
}

/* =====================================================
   HERO PARTICLES
   ===================================================== */
const heroParticles = $('#heroParticles');

if (heroParticles && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const PARTICLE_COUNT = 25;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';

    const size = Math.random() * 40 + 10; // 10–50px
    const left = Math.random() * 100;      // 0–100%
    const delay = Math.random() * 20;      // 0–20s
    const duration = Math.random() * 20 + 15; // 15–35s

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -${size}px;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
    `;

    heroParticles.appendChild(particle);
  }
}

/* =====================================================
   GALLERY FILTER
   ===================================================== */
const filterBtns = $$('.filter-btn');
const galleryItems = $$('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Filter gallery items
    galleryItems.forEach(item => {
      const category = item.dataset.category;
      const show = filter === 'all' || category === filter;

      if (show) {
        item.style.display = 'block';
        item.style.animation = 'none';
        requestAnimationFrame(() => {
          item.style.animation = '';
        });
      } else {
        item.style.display = 'none';
      }
    });
  });
});

/* =====================================================
   GLIGHTBOX — IMAGE LIGHTBOX
   ===================================================== */
if (typeof GLightbox !== 'undefined') {
  GLightbox({
    selector: '.gallery-item',
    touchNavigation: true,
    loop: true,
    autoplayVideos: false,
  });
}

/* =====================================================
   TESTIMONIALS SLIDER
   ===================================================== */
const testimonialTrack = $('#testimonialTrack');
const prevBtn = $('#prevTestimonial');
const nextBtn = $('#nextTestimonial');
const dots = $$('.dot');

let currentSlide = 0;
let testimonialAutoPlay;
const totalSlides = $$('.testimonial-slide').length;

const goToSlide = (index) => {
  if (!testimonialTrack) return;

  // Wrap around
  currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
  testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

  // Update dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
};

const startAutoPlay = () => {
  clearInterval(testimonialAutoPlay);
  testimonialAutoPlay = setInterval(() => goToSlide(currentSlide + 1), 5000);
};

if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); startAutoPlay(); });
if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); startAutoPlay(); });

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.index, 10));
    startAutoPlay();
  });
});

// Pause autoplay on hover
const slider = $('#testimonialsSlider');
slider?.addEventListener('mouseenter', () => clearInterval(testimonialAutoPlay));
slider?.addEventListener('mouseleave', startAutoPlay);

// Start auto-play
if (totalSlides > 0) {
  startAutoPlay();
}

// Touch/swipe support for testimonials
let touchStartX = 0;
slider?.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
slider?.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
    startAutoPlay();
  }
}, { passive: true });

/* =====================================================
   BACK TO TOP BUTTON
   ===================================================== */
const backToTop = $('#backToTop');

const updateBackToTop = () => {
  if (!backToTop) return;
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
};

window.addEventListener('scroll', debounce(updateBackToTop, 100), { passive: true });

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =====================================================
   FORM VALIDATION & SUBMISSION
   ===================================================== */

// Generic form validator using Bootstrap validation classes
const validateAndSubmitForm = (formEl, successMessage) => {
  if (!formEl) return;

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    formEl.classList.add('was-validated');

    if (!formEl.checkValidity()) {
      // Focus first invalid field
      const firstInvalid = formEl.querySelector(':invalid');
      firstInvalid?.focus();
      return;
    }

    // Simulate form submission
    const submitBtn = formEl.querySelector('button[type="submit"]');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');

    if (submitBtn) {
      submitBtn.disabled = true;
      btnText?.classList.add('d-none');
      btnLoading?.classList.remove('d-none');
    }

    // Simulate async API call
    setTimeout(() => {
      // Reset submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        btnText?.classList.remove('d-none');
        btnLoading?.classList.add('d-none');
      }

      // Reset form
      formEl.reset();
      formEl.classList.remove('was-validated');

      // Show success toast
      showToast(successMessage);
    }, 1800);
  });
};

// Show Bootstrap toast
const showToast = (message) => {
  const toastEl = $('#successToast');
  const toastMsg = $('#toastMessage');

  if (!toastEl) return;

  if (toastMsg) {
    toastMsg.innerHTML = `<i class="fa-solid fa-circle-check me-2"></i> ${message}`;
  }

  const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
  toast.show();
};

// Application Form
validateAndSubmitForm(
  $('#applicationForm'),
  'Application submitted successfully! Our admissions team will contact you within 24 hours.'
);

// Contact Form
validateAndSubmitForm(
  $('#contactForm'),
  'Message sent! We will get back to you within 1 business day.'
);

/* =====================================================
   DOWNLOAD PROSPECTUS BUTTON (Demo)
   ===================================================== */
const downloadBtn = $('#downloadProspectusBtn');
downloadBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  showToast('Prospectus download will begin shortly. Thank you for your interest in Jivan Joti Nursing College!');
});

/* =====================================================
   APPLY NOW BUTTON (Smooth scroll to admissions)
   ===================================================== */
const applyNowBtn = $('#applyNowBtn');
applyNowBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  const admissionsSection = $('#admissions');
  admissionsSection?.scrollIntoView({ behavior: 'smooth' });
});

/* =====================================================
   SMOOTH SCROLL FOR ALL ANCHOR LINKS
   ===================================================== */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const href = link.getAttribute('href');
  if (!href || href === '#') return;

  const targetEl = document.querySelector(href);
  if (!targetEl) return;

  e.preventDefault();

  // Close mobile menu if open
  const navbarCollapse = document.querySelector('.navbar-collapse.show');
  if (navbarCollapse) {
    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
    bsCollapse?.hide();
  }

  const navbarH = navbar ? navbar.offsetHeight : 72;
  const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navbarH;

  window.scrollTo({ top: targetTop, behavior: 'smooth' });
});

/* =====================================================
   AOS INITIALIZE
   ===================================================== */
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 700,
    once: true,
    offset: 80,
    easing: 'ease-out-cubic',
  });
}

/* =====================================================
   FOOTER YEAR UPDATE
   ===================================================== */
const footerYear = $('#footerYear');
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

/* =====================================================
   LAZY-LOAD IMAGES (Native + IntersectionObserver fallback)
   ===================================================== */
if ('loading' in HTMLImageElement.prototype) {
  // Native lazy loading is already applied via loading="lazy" attribute
} else {
  // Polyfill via IntersectionObserver
  const lazyImages = $$('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));
}

/* =====================================================
   KEYBOARD NAVIGATION ENHANCEMENT
   ===================================================== */
// Allow Enter key on course cards
$$('.course-card[tabindex="0"]').forEach(card => {
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const link = card.querySelector('.btn-course');
      link?.click();
    }
  });
});

/* =====================================================
   PRINT DETECTION — Disable animations for print
   ===================================================== */
window.matchMedia('print').addEventListener('change', (e) => {
  if (e.matches) {
    document.body.classList.add('print-mode');
  } else {
    document.body.classList.remove('print-mode');
  }
});

/* =====================================================
   INITIALIZE
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Set initial active nav link
  updateActiveNavLink();
  updateBackToTop();

  // Add scroll listener for navbar active link
  window.addEventListener('scroll', debounce(updateActiveNavLink, 100), { passive: true });

  // Log version
  console.log('%c Jivan Joti Nursing College Website v1.0 ', 'background:#1e6fb5;color:#fff;padding:4px 8px;border-radius:4px;font-weight:700;');
});
