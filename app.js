/**
 * Bright Smile Dental Clinic - Website Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStickyHeader();
  initScrollReveal();
  initActiveNavLinkOnScroll();
  initFAQAccordion();
  initGalleryLightbox();
  initBookingForm();
  initBackToTop();
});

/**
 * 1. Mobile Menu Toggle
 */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Toggle body scroll lock when mobile menu is open
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/**
 * 2. Sticky Header on Scroll
 */
function initStickyHeader() {
  const header = document.querySelector('header');
  
  if (header) {
    const checkScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('sticky-scrolled');
      } else {
        header.classList.remove('sticky-scrolled');
      }
    };
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Initial check
  }
}

/**
 * 3. Scroll Reveal Animations (Intersection Observer)
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window && reveals.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, no need to observe again
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(reveal => {
      revealObserver.observe(reveal);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    reveals.forEach(reveal => {
      reveal.classList.add('active');
    });
  }
}

/**
 * 4. Active Navigation Link Sync on Scroll
 */
function initActiveNavLinkOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      root: null,
      threshold: 0.5,
      rootMargin: '-80px 0px -20% 0px' // adjust for header height
    });
    
    sections.forEach(section => {
      navObserver.observe(section);
    });
  }
}

/**
 * 5. FAQ Accordion Functionality
 */
function initFAQAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.faq-body');
      const isActive = item.classList.contains('active');
      
      // Close all other FAQ items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBody = otherItem.querySelector('.faq-body');
          otherBody.style.maxHeight = null;
        }
      });
      
      // Toggle current FAQ item
      if (isActive) {
        item.classList.remove('active');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        // Set dynamic max-height to trigger smooth transition
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/**
 * 6. Smile Gallery Lightbox Preview
 */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  
  if (galleryItems.length > 0 && lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.getAttribute('data-caption') || '';
        
        if (img && lightboxImg) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt || 'Gallery image';
          if (lightboxCaption) {
            lightboxCaption.textContent = caption;
          }
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden'; // Lock background scroll
        }
      });
    });
    
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };
    
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
}

/**
 * 7. Appointment Booking Form Handler
 */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  const successMsg = document.querySelector('.booking-success-message');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Perform client side validation
      const name = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phoneNumber').value.trim();
      const email = document.getElementById('emailAddress').value.trim();
      const treatment = document.getElementById('treatment').value;
      const date = document.getElementById('preferredDate').value;
      
      let isValid = true;
      
      // Simple validation visual feedback
      const inputs = [
        { elem: document.getElementById('fullName'), valid: name !== '' },
        { elem: document.getElementById('phoneNumber'), valid: /^[+]?[0-9\s-]{8,15}$/.test(phone) },
        { elem: document.getElementById('emailAddress'), valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) },
        { elem: document.getElementById('treatment'), valid: treatment !== '' },
        { elem: document.getElementById('preferredDate'), valid: date !== '' }
      ];
      
      inputs.forEach(input => {
        if (!input.valid) {
          input.elem.style.borderColor = '#ef4444'; // Red highlight
          isValid = false;
        } else {
          input.elem.style.borderColor = ''; // Reset
        }
      });
      
      if (!isValid) {
        alert('Please fill out all required fields with valid information.');
        return;
      }
      
      // Simulate booking request submission
      const submitBtn = form.querySelector('.booking-submit-btn');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Scheduling appointment...';
      
      setTimeout(() => {
        // Success response
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        if (successMsg) {
          successMsg.style.display = 'block';
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          
          // Success message remains visible to allow users to click the WhatsApp confirmation link
        } else {
          alert('Thank you! Your appointment request has been submitted successfully. Our clinic will contact you shortly.');
        }
      }, 1500);
    });
  }
}

/**
 * 8. Back to Top Button
 */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  
  if (btn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}
