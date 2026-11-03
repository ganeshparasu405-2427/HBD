// Personalize these values before sharing the surprise.
const BROTHER_NAME = 'P RANJITH KUMAR';
const BIRTHDAY_DATE = ''; // Optional: 'YYYY-MM-DD'. Leave blank to hide the countdown.
const LETTER_TEXT = `Dear Brother,

Life has given me many beautiful gifts, but having you as my brother is one of the most special blessings.

We may fight, tease each other, argue over silly things, and sometimes disagree, but nothing can change the bond we share.

Thank you for being part of my journey, my memories, and my life.

No matter where life takes us, I will always be there for you.

You are not just my brother. You are my lifetime bond, my strength, and someone I will always be proud of.

Happy Birthday, Bro! ❤️`;

const welcomeScreen = document.querySelector('#welcome-screen');
const header = document.querySelector('#site-header');
const letterCopy = document.querySelector('#letter-copy');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let letterTimer;
let toastTimer;
let previouslyFocused;

document.body.classList.add('welcome-active');

// Add a small, fixed set of CSS-animated particles instead of a continuous JS loop.
const particleField = document.querySelector('.particle-field');
for (let index = 0; index < 34; index += 1) {
  const particle = document.createElement('span');
  particle.className = 'particle';
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.animationDuration = `${7 + Math.random() * 10}s`;
  particle.style.animationDelay = `${Math.random() * -15}s`;
  particle.style.opacity = `${0.2 + Math.random() * 0.7}`;
  particleField.append(particle);
}

document.querySelector('#brother-name').textContent = BROTHER_NAME;
document.querySelector('#welcome-recipient-name').textContent = BROTHER_NAME;

function updateLiveGreeting() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const date = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(now);
  document.querySelector('#live-greeting').textContent = `${greeting} · ${date} · Today is all about you`;
}

function startCountdown() {
  if (!BIRTHDAY_DATE) return;
  const birthday = new Date(`${BIRTHDAY_DATE}T00:00:00`);
  if (Number.isNaN(birthday.getTime())) return;
  const wrap = document.querySelector('#countdown-wrap');
  const display = document.querySelector('#countdown');
  wrap.hidden = false;

  const render = () => {
    const now = new Date();
    const nextBirthday = new Date(now.getFullYear(), birthday.getMonth(), birthday.getDate());
    if (nextBirthday <= now) nextBirthday.setFullYear(now.getFullYear() + 1);
    const remaining = Math.max(0, nextBirthday.getTime() - now.getTime());
    const values = [
      [Math.floor(remaining / 86400000), 'DAYS'],
      [Math.floor((remaining / 3600000) % 24), 'HOURS'],
      [Math.floor((remaining / 60000) % 60), 'MIN'],
      [Math.floor((remaining / 1000) % 60), 'SEC']
    ];
    display.innerHTML = values.map(([value, label]) => `<span>${value}<small>${label}</small></span>`).join('');
  };
  render();
  window.setInterval(render, 1000);
}

updateLiveGreeting();
startCountdown();
window.setInterval(updateLiveGreeting, 60000);

function startLetter() {
  window.clearInterval(letterTimer);
  letterCopy.textContent = '';
  letterCopy.classList.remove('is-complete');
  if (reducedMotion) {
    letterCopy.textContent = LETTER_TEXT;
    letterCopy.classList.add('is-complete');
    return;
  }
  let index = 0;
  letterTimer = window.setInterval(() => {
    letterCopy.textContent += LETTER_TEXT.charAt(index);
    index += 1;
    if (index >= LETTER_TEXT.length) {
      window.clearInterval(letterTimer);
      letterCopy.classList.add('is-complete');
    }
  }, 24);
}

function openCelebration() {
  playBirthdayMusic();
  welcomeScreen.classList.add('is-leaving');
  document.body.classList.remove('welcome-active');
  header.classList.add('is-visible');
  celebrate();
  launchFireworks();
  window.setTimeout(() => {
    welcomeScreen.hidden = true;
    document.querySelector('#birthday').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }, reducedMotion ? 0 : 850);
}

document.querySelector('#open-surprise').addEventListener('click', openCelebration);

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
        if (entry.target.id === 'letter-copy') startLetter();
      }
    });
  }, { threshold: 0.14 });
  revealElements.forEach((element) => observer.observe(element));
  observer.observe(letterCopy);
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
  startLetter();
}

// Mobile navigation closes after choosing a destination or pressing Escape.
const menuToggle = document.querySelector('#menu-toggle');
const primaryNav = document.querySelector('#primary-nav');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  primaryNav.classList.remove('is-open');
}
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  primaryNav.classList.toggle('is-open', !isOpen);
});
primaryNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
    if (!document.querySelector('#lightbox').hidden) closeLightbox();
  }
});

// Missing local image files leave their decorative card visible; valid files fade in.
document.querySelectorAll('.memory-image img').forEach((image) => {
  const showImage = () => image.classList.add('is-loaded');
  if (image.complete && image.naturalWidth > 0) showImage();
  image.addEventListener('load', showImage);
});

const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  if (previouslyFocused) previouslyFocused.focus();
}
document.querySelectorAll('.memory-card').forEach((card) => {
  card.addEventListener('click', () => {
    const image = card.querySelector('img');
    if (!image.complete || image.naturalWidth === 0) {
      showToast('Add your photo to the images folder to see this memory.');
      return;
    }
    previouslyFocused = card;
    lightboxImage.src = image.currentSrc;
    lightboxImage.alt = image.alt;
    document.querySelector('#lightbox-caption').textContent = card.dataset.caption;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    document.querySelector('#lightbox-close').focus();
  });
});
document.querySelector('#lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

const audio = document.querySelector('#birthday-audio');
const musicToggle = document.querySelector('#music-toggle');
const musicLabel = document.querySelector('.music-label');
const volumeControl = document.querySelector('#volume-control');
audio.volume = Number(volumeControl.value);
function showToast(message) {
  const toast = document.querySelector('#music-status');
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3800);
}
function setMusicPlaying(isPlaying) {
  musicToggle.classList.toggle('is-playing', isPlaying);
  musicToggle.setAttribute('aria-pressed', String(isPlaying));
  musicToggle.setAttribute('aria-label', isPlaying ? 'Pause birthday music' : 'Play birthday music');
  musicLabel.textContent = isPlaying ? 'Music on' : 'Music off';
}
async function playBirthdayMusic() {
  try {
    await audio.play();
    setMusicPlaying(true);
  } catch {
    setMusicPlaying(false);
    showToast('Music could not load. Open this site with Live Server and check music/birthday-song.mp3.');
  }
}
musicToggle.addEventListener('click', () => {
  if (audio.paused) {
    playBirthdayMusic();
  } else {
    audio.pause();
    setMusicPlaying(false);
  }
});
volumeControl.addEventListener('input', () => {
  audio.volume = Number(volumeControl.value);
});
audio.addEventListener('error', () => {
  setMusicPlaying(false);
  showToast('Music could not load. Open this site with Live Server and check music/birthday-song.mp3.');
});

function celebrate() {
  if (reducedMotion) return;
  const colors = ['#d4af37', '#fff0ad', '#f7d96c', '#ffffff', '#a88124'];
  for (let index = 0; index < 90; index += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty('--drift', `${Math.random() * 200 - 100}px`);
    piece.style.setProperty('--spin', `${Math.random() * 900 - 450}deg`);
    piece.style.animationDelay = `${Math.random() * 1.3}s`;
    document.body.append(piece);
    window.setTimeout(() => piece.remove(), 4800);
  }
}

function launchFireworks() {
  if (reducedMotion) return;
  for (let index = 0; index < 5; index += 1) {
    const burst = document.createElement('span');
    burst.className = 'firework-burst';
    burst.setAttribute('aria-hidden', 'true');
    burst.style.left = `${15 + Math.random() * 70}vw`;
    burst.style.top = `${15 + Math.random() * 48}vh`;
    burst.style.animationDelay = `${index * 180}ms`;
    document.body.append(burst);
    window.setTimeout(() => burst.remove(), 1500 + index * 180);
  }
}

document.querySelector('#reveal-message').addEventListener('click', (event) => {
  const button = event.currentTarget;
  const message = document.querySelector('#final-message');
  message.hidden = false;
  button.setAttribute('aria-expanded', 'true');
  button.textContent = 'YOUR SURPRISE, WITH LOVE ♥';
  button.disabled = true;
  celebrate();
  launchFireworks();
});

// A subtle pointer glow is intentionally disabled on touch devices.
const cursorGlow = document.querySelector('#cursor-glow');
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }, { passive: true });
}
