// --- CONTACT TOGGLE ---
const contactBtn = document.querySelector('.contact-btn');
const mainContent = document.getElementById('gridContainer') || document.getElementById('heroContainer') || document.querySelector('.product-container') || document.querySelector('.consult-container');
let originalHTML = mainContent ? mainContent.innerHTML : '';
let originalDisplay = mainContent ? mainContent.style.display : '';

contactBtn.addEventListener('click', function () {
  contactBtn.blur();
  const isInverted = document.body.classList.toggle('contact-invert');
  contactBtn.textContent = isInverted ? 'Close' : 'Contact me';

  if (isInverted) {
    originalHTML = mainContent.innerHTML;
    originalDisplay = mainContent.style.display;
    mainContent.style.display = 'block';
    mainContent.innerHTML = `
      <div class="contact-container">
        <div class="contact-info">
          <div class="email">lee@tracksynk.com</div>
          <div class="phone">027 309 2926</div>
        </div>
      </div>
    `;
  } else {
    mainContent.innerHTML = originalHTML;
    mainContent.style.display = originalDisplay;
  }
});
