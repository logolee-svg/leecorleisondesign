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
