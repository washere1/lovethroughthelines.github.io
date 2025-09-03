/* ======================================================
   Interactivity & Animations (Vanilla JS)
   - Mobile menu toggle
   - Smooth scroll for in-page links
   - On-scroll fade-in with IntersectionObserver
   - Animated counters in Impact section
   - Testimonial slider/carousel
   - Hero headline reveal on load
====================================================== */

// ------- Mobile Menu -------
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    // hamburger icon animation
    const [b1, b2, b3] = hamburger.querySelectorAll('span');
    if (isOpen) {
      b1.style.transform = 'rotate(35deg) translate(4px, 4px)';
      b2.style.opacity = '0';
      b3.style.transform = 'rotate(-35deg) translate(4px, -4px)';
    } else {
      b1.style.transform = '';
      b2.style.opacity = '1';
      b3.style.transform = '';
    }
  });

  // Close drawer after clicking a link
  document.querySelectorAll('.mobile-link').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      const [b1, b2, b3] = hamburger.querySelectorAll('span');
      b1.style.transform = b3.style.transform = '';
      b2.style.opacity = '1';
    });
  });
}

// ------- Smooth Scroll for anchor links -------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ------- Reveal on Scroll (sections) -------
const revealEls = document.querySelectorAll('.fade-in');
const heroHeadline = document.querySelector('.reveal-on-load');

// IntersectionObserver triggers visibility and counters
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // If the impact section becomes visible, fire counters
      if (entry.target.id === 'impact') {
        animateCounters();
      }

      // Unobserve once shown to avoid re-triggering
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => io.observe(el));

// Reveal hero headline after load
window.addEventListener('load', () => {
  if (heroHeadline) heroHeadline.classList.add('visible');
});

// ------- Animated Counters -------
function animateCounters() {
  const nums = document.querySelectorAll('.num');
  nums.forEach(numEl => {
    const target = parseInt(numEl.getAttribute('data-target'), 10);
    const duration = 1800; // ms
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      numEl.textContent = value.toLocaleString() + (target >= 100 ? '+' : '');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

// ------- Testimonials Slider -------
const slides = Array.from(document.querySelectorAll('.slide'));
const dots = Array.from(document.querySelectorAll('.dot'));
let current = 0;
let timerId = null;

function showSlide(i) {
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  slides[i].classList.add('active');
  dots[i].classList.add('active');
  current = i;
}

function nextSlide() {
  const i = (current + 1) % slides.length;
  showSlide(i);
}

function startAuto() {
  stopAuto();
  timerId = setInterval(nextSlide, 5000);
}
function stopAuto() {
  if (timerId) clearInterval(timerId);
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    showSlide(i);
    startAuto();
  });
});

// Initialize slider
if (slides.length) {
  showSlide(0);
  startAuto();

  // Pause on hover for accessibility
  const slider = document.querySelector('.slider');
  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);
}
