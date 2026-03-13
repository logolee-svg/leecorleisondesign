// --- DARK MODE ---
const modeToggle = document.querySelector('.mode-toggle');

function applyMode(dark) {
  document.body.classList.toggle('dark-mode', dark);
}

function getStoredMode() {
  return localStorage.getItem('lcd-dark-mode');
}

// Init: check localStorage first, then fall back to system preference
const stored = getStoredMode();
if (stored !== null) {
  applyMode(stored === 'true');
} else {
  applyMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
}

// Listen for system preference changes (only applies if no manual override)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (getStoredMode() === null) {
    applyMode(e.matches);
  }
});

modeToggle.addEventListener('click', () => {
  const nowDark = !document.body.classList.contains('dark-mode');
  applyMode(nowDark);
  localStorage.setItem('lcd-dark-mode', nowDark);
});

// --- CONTACT TOGGLE ---
const contactBtn = document.querySelector('.contact-btn');
const gridContainer = document.getElementById('gridContainer');
let originalGridHTML = gridContainer.innerHTML;

contactBtn.addEventListener('click', function () {
  contactBtn.blur();
  const isInverted = document.body.classList.toggle('contact-invert');
  contactBtn.textContent = isInverted ? 'Close' : 'Contact me';

  if (isInverted) {
    originalGridHTML = gridContainer.innerHTML;
    gridContainer.innerHTML = '';
    gridContainer.style.display = 'block';
    gridContainer.innerHTML = `
      <div class="contact-container">
        <div class="contact-info">
          <div class="email">leecorleison@gmail.com</div>
          <div class="phone">+64 27 309 2926</div>
        </div>
      </div>
    `;
  } else {
    gridContainer.innerHTML = originalGridHTML;
    gridContainer.style.display = '';
  }
});
