/**
 * Main JavaScript for Saudi Used Furniture & AC Buying Service Website
 * High-performance, lightweight, accessible RTL interactive behaviors
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initFaqAccordions();
  initScrollAnimations();
  initGalleryFilterAndLightbox();
  initContactForm();
  initScrollToTop();
});


/* ==========================================================================
   Sticky Header on Scroll
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('header.sticky-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   Mobile Menu Drawer
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-menu-drawer');
  const backdrop = document.getElementById('mobile-menu-backdrop');

  if (!toggleBtn || !drawer) return;

  const openDrawer = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    drawer.classList.remove('invisible', 'translate-x-full');
    drawer.classList.add('is-open');
    if (backdrop) {
      backdrop.classList.remove('opacity-0', 'pointer-events-none', 'hidden');
      backdrop.classList.add('is-active');
    }
    document.body.classList.add('overflow-hidden');
    toggleBtn.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    drawer.classList.remove('is-open');
    drawer.classList.add('translate-x-full');
    setTimeout(() => {
      if (!drawer.classList.contains('is-open')) {
        drawer.classList.add('invisible');
      }
    }, 350);
    if (backdrop) {
      backdrop.classList.remove('is-active');
      backdrop.classList.add('opacity-0', 'pointer-events-none');
    }
    document.body.classList.remove('overflow-hidden');
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (drawer.classList.contains('is-open') || !drawer.classList.contains('invisible'))) {
      closeDrawer();
    }
  });

  // Close drawer when clicking a navigation link inside it (not CTA action buttons)
  const drawerNavLinks = drawer.querySelectorAll('nav a');
  drawerNavLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   FAQ Accordions
   ========================================================================== */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQs in same container for clean accordion effect
      const parent = item.closest('.faq-container') || document;
      parent.querySelectorAll('.faq-item').forEach((sibling) => {
        if (sibling !== item) {
          sibling.classList.remove('active');
          const siblingContent = sibling.querySelector('.faq-content');
          if (siblingContent) siblingContent.style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 30 + 'px';
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   Intersection Observer for Scroll Animations
   ========================================================================== */
function initScrollAnimations() {
  // Check prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      el.classList.add('is-visible');
    });
    return;
  }

  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1,
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   Gallery Filtering & Modal Lightbox
   ========================================================================== */
function initGalleryFilterAndLightbox() {
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-card');

  // Filter functionality
  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        filterButtons.forEach((b) => {
          b.classList.remove('bg-[#126B4F]', 'text-white');
          b.classList.add('bg-white', 'text-[#17211D]', 'border-[#E3E9E5]');
        });
        btn.classList.add('bg-[#126B4F]', 'text-white');
        btn.classList.remove('bg-white', 'text-[#17211D]', 'border-[#E3E9E5]');

        galleryItems.forEach((item) => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 20);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.96)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // Lightbox functionality
  const lightbox = document.getElementById('gallery-lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxCounter = lightbox.querySelector('.lightbox-counter');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;
  let visibleItems = [];

  const updateVisibleItems = () => {
    visibleItems = Array.from(galleryItems).filter((item) => item.style.display !== 'none');
  };

  const showLightboxImage = (index) => {
    updateVisibleItems();
    if (!visibleItems.length) return;

    if (index < 0) index = visibleItems.length - 1;
    if (index >= visibleItems.length) index = 0;
    currentIndex = index;

    const currentItem = visibleItems[currentIndex];
    const imgEl = currentItem.querySelector('img');
    const titleEl = currentItem.querySelector('.gallery-item-title');

    if (imgEl && lightboxImg) {
      lightboxImg.src = imgEl.src;
      lightboxImg.alt = imgEl.alt || '';
    }

    if (titleEl && lightboxCaption) {
      lightboxCaption.textContent = titleEl.textContent;
    }

    if (lightboxCounter) {
      const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      const toArabicDigits = (num) => num.toString().replace(/\d/g, (d) => arabicNumerals[d]);
      lightboxCounter.textContent = `${toArabicDigits(currentIndex + 1)} من ${toArabicDigits(visibleItems.length)}`;
    }
  };

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      updateVisibleItems();
      const idx = visibleItems.indexOf(item);
      if (idx !== -1) {
        showLightboxImage(idx);
        lightbox.classList.add('active');
        document.body.classList.add('overflow-hidden');
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => showLightboxImage(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showLightboxImage(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    // RTL: ArrowRight usually moves to previous, ArrowLeft moves to next in Arabic
    if (e.key === 'ArrowRight') showLightboxImage(currentIndex - 1);
    if (e.key === 'ArrowLeft') showLightboxImage(currentIndex + 1);
  });
}

/* ==========================================================================
   Contact Form Validation & WhatsApp Pre-fill Helper
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('buying-inquiry-form');
  if (!form) return;

  const resultContainer = document.getElementById('form-result-message');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value.trim() || '';
    const phone = form.querySelector('[name="phone"]')?.value.trim() || '';
    const city = form.querySelector('[name="city"]')?.value.trim() || '';
    const itemType = form.querySelector('[name="item_type"]')?.value.trim() || '';
    const details = form.querySelector('[name="details"]')?.value.trim() || '';

    // Validation
    if (!name || !phone || !city || !itemType) {
      if (resultContainer) {
        resultContainer.className = 'mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm';
        resultContainer.innerHTML = 'يرجى تعبئة الحقول المطلوبة (الاسم، رقم الجوال، المدينة، ونوع الأغراض).';
        resultContainer.classList.remove('hidden');
      }
      return;
    }

    // Format pre-filled WhatsApp message
    const waText = encodeURIComponent(
      `السلام عليكم، أود بيع أغراض مستعملة:\n` +
      `• الاسم: ${name}\n` +
      `• المدينة: ${city}\n` +
      `• نوع الأغراض: ${itemType}\n` +
      `• رقم التواصل: ${phone}\n` +
      (details ? `• تفاصيل إضافية: ${details}\n` : '') +
      `سأقوم بإرسال صور الأغراض الآن.`
    );

    const waUrl = `https://wa.me/966569904573?text=${waText}`;

    // Display professional feedback with direct WhatsApp option
    if (resultContainer) {
      resultContainer.className = 'mt-4 p-5 rounded-2xl bg-[#E8F5EF] border border-[#126B4F]/20 text-[#17211D]';
      resultContainer.innerHTML = `
        <div class="flex items-start gap-3">
          <span class="text-2xl">✓</span>
          <div>
            <h4 class="font-bold text-[#126B4F] mb-1">تم تجهيز بيانات طلبك بنجاح!</h4>
            <p class="text-sm text-[#66736D] mb-3">لتسريع مراجعة الأغراض والحصول على تقييم مناسب، يمكنك الانتقال مباشرة لإرسال هذه التفاصيل والصور عبر واتساب:</p>
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp py-2 px-5 text-sm inline-flex items-center gap-2">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              متابعة الإرسال عبر واتساب الآن
            </a>
          </div>
        </div>
      `;
      resultContainer.classList.remove('hidden');
    }
  });
}

// Update current year dynamically if element exists
const yearEl = document.getElementById('current-year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ==========================================================================
   Scroll to Top (Left Side Bottom)
   ========================================================================== */
function initScrollToTop() {
  const btn = document.getElementById('scroll-to-top-btn');
  if (!btn) return;

  const handleScroll = () => {
    if (window.scrollY > 300) {
      btn.classList.add('is-active');
    } else {
      btn.classList.remove('is-active');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}


