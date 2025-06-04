// JS will go here if needed later 

window.addEventListener('scroll', function() {
  const gondolaImg = document.querySelector('.gondola-svg');
  console.log('Scroll event fired');
  if (!gondolaImg) {
    console.log('No .gondola-svg image found');
    return;
  }
  if (window.scrollY > 10) {
    console.log('Switching to spinaway.svg');
    gondolaImg.src = './images/spinaway.svg';
  } else {
    console.log('Switching to gondola.svg');
    gondolaImg.src = './images/gondola.svg';
  }
}); 

const svgList = [
  './images/1.svg', './images/2.svg', './images/3.svg', './images/4.svg', './images/5.svg',
  './images/6.svg', './images/7.svg', './images/8.svg', './images/9.svg', './images/10.svg',
  './images/11.svg', './images/12.svg', './images/13.svg', './images/14.svg', './images/15.svg',
  './images/16.svg', './images/17.svg', './images/18.svg', './images/19.svg', './images/20.svg',
  './images/21.svg', './images/22.svg', './images/23.svg', './images/24.svg', './images/25.svg',
  './images/26.svg', './images/27.svg', './images/28.svg', './images/29.svg', './images/30.svg',
  './images/31.svg', './images/32.svg', './images/33.svg', './images/34.svg'
];

const counterLabels = [
  '1', '2', '3', '4', '5',
  '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15',
  '16', '17', '18', '19', '20',
  '21', '22', '23', '24', '25',
  '26', '27', '28', '29', '30',
  '31', '32', '33', '34'
];

let currentIndex = 0;
let lastCounterY = null;

const pastelColors = [
  '#f3e7ff', '#d4fcf9', '#fffab3', '#ffe0f7', '#e0fff7', '#e7f3ff', '#f7ffe0', '#e0e7ff',
  '#fff0e7', '#e0fff3', '#f3ffe7', '#e7fff3', '#f3e7e7', '#e7f3e7', '#f3f7e7', '#e7e7ff',
  '#f7e7ff', '#e7fff7', '#f9e6e6', '#e6f9e6', '#e6e6f9', '#f9f6e6', '#e6f9f6', '#f6e6f9',
  '#e6f6f9', '#f9e6f6', '#f6f9e6', '#e6f6e9', '#f9e9e6', '#e9e6f9', '#e6e9f9', '#f9e6e9',
  '#e9f9e6', '#e6e9f6', '#f6e9e6', '#e9f6e6'
];

let isDragging = false;
let dragStartX = 0;
let dragStartIndex = 0;

function updateSVG() {
  const img = document.querySelector('.slideshow-svg');
  const counter = document.querySelector('.slideshow-counter');
  const container = document.querySelector('.main-black-container');
  const frame = document.querySelector('.frame');
  const track = document.querySelector('.counter-track');
  if (!img) return;
  img.classList.add('fading');
  setTimeout(() => {
    img.classList.add('fade-in');
    img.src = svgList[currentIndex];
    img.onload = () => {
      img.classList.remove('fading');
      requestAnimationFrame(() => {
        img.classList.remove('fade-in');
      });
      img.onload = null;
    };
  }, 300); // Half the transition duration for fade out (0.6s total)
  if (counter && track) {
    // Move the badge horizontally based on currentIndex
    const total = svgList.length - 1;
    const percent = total > 0 ? currentIndex / total : 0;
    const badgeWidth = counter.clientWidth;
    const trackWidth = track.offsetWidth;
    const minX = -badgeWidth / 2;
    const maxX = trackWidth - badgeWidth / 2;
    const x = minX + percent * (maxX - minX);
    counter.style.left = `${x}px`;
    counter.style.top = '50%';
    counter.style.transform = 'translateY(-50%)';
    // Ghosting trail effect (horizontal)
    if (lastCounterY !== null && lastCounterY !== x) {
      const ghost = counter.cloneNode(true);
      ghost.classList.add('slideshow-counter-ghost');
      ghost.style.left = `${lastCounterY}px`;
      ghost.style.opacity = '0.5';
      track.appendChild(ghost);
      setTimeout(() => {
        ghost.style.opacity = '0';
      }, 10);
      setTimeout(() => {
        if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
      }, 600);
      counter.classList.add('moving');
      const removeBlur = () => {
        counter.classList.remove('moving');
        counter.removeEventListener('transitionend', removeBlur);
      };
      counter.addEventListener('transitionend', removeBlur);
      // Fallback: remove 'moving' after 500ms if transitionend doesn't fire
      setTimeout(() => {
        counter.classList.remove('moving');
      }, 500);
    }
    lastCounterY = x;
    // counter.style.background = pastelColors[currentIndex % pastelColors.length];
    // Ensure the badge is a child of the track
    if (counter.parentNode !== track) {
      track.appendChild(counter);
    }
  }
  // Set frame background to a subtle pastel color
  if (frame) {
    frame.style.background = pastelColors[currentIndex % pastelColors.length];
  }
}

let scrollAccumulator = 0;
const scrollThreshold = 80;
let lastScrollTime = 0;
const debounceDelay = 100; // Lower debounce for more responsive feel

window.addEventListener('wheel', function(e) {
  const now = Date.now();
  if (now - lastScrollTime < debounceDelay) return;
  scrollAccumulator += e.deltaY;

  let changed = false;
  while (Math.abs(scrollAccumulator) >= scrollThreshold) {
    if (scrollAccumulator > 0 && currentIndex < svgList.length - 1) {
      currentIndex++;
      scrollAccumulator -= scrollThreshold;
      changed = true;
    } else if (scrollAccumulator < 0 && currentIndex > 0) {
      currentIndex--;
      scrollAccumulator += scrollThreshold;
      changed = true;
    } else {
      // Clamp at ends
      scrollAccumulator = 0;
      break;
    }
  }
  if (changed) {
    updateSVG();
    e.preventDefault();
    lastScrollTime = now;
  }
}, { passive: false });

// Ensure the first image is set
updateSVG(); 

// Drag functionality for the counter
function onDragStart(e) {
  const counter = document.querySelector('.slideshow-counter');
  if (!counter) return;
  isDragging = true;
  dragStartX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
  dragStartIndex = currentIndex;
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'grabbing';
  counter.classList.add('selected');
}

function onDragMove(e) {
  if (!isDragging) return;
  const track = document.querySelector('.counter-track');
  const counter = document.querySelector('.slideshow-counter');
  if (!track || !counter) return;
  
  const total = svgList.length - 1;
  const trackRect = track.getBoundingClientRect();
  const badgeWidth = counter.clientWidth;
  const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
  
  // Calculate position relative to track, centering the badge under cursor
  const relativeX = clientX - trackRect.left - (badgeWidth / 2);
  const trackWidth = track.offsetWidth - badgeWidth;
  const percent = Math.max(0, Math.min(1, relativeX / trackWidth));
  const newIndex = Math.round(percent * total);
  
  // Position counter relative to track
  const minTrackX = -badgeWidth / 2;
  const maxTrackX = track.offsetWidth - badgeWidth / 2;
  const counterX = minTrackX + percent * (maxTrackX - minTrackX);
  counter.style.left = `${counterX}px`;
  
  if (newIndex !== currentIndex) {
    currentIndex = newIndex;
    // Update image and background without counter animation
    const img = document.querySelector('.slideshow-svg');
    const frame = document.querySelector('.frame');
    
    if (img) {
      img.classList.add('fading');
      setTimeout(() => {
        img.classList.add('fade-in');
        img.src = svgList[currentIndex];
        img.onload = () => {
          img.classList.remove('fading');
          requestAnimationFrame(() => {
            img.classList.remove('fade-in');
          });
          img.onload = null;
        };
      }, 300);
    }
    
    if (frame) {
      frame.style.background = pastelColors[currentIndex % pastelColors.length];
    }
  }
}

function onDragEnd() {
  isDragging = false;
  document.body.style.userSelect = '';
  document.body.style.cursor = '';
  const counter = document.querySelector('.slideshow-counter');
  const track = document.querySelector('.counter-track');
  
  if (counter) {
    counter.classList.remove('selected');
    
    // Update lastCounterY for proper ghosting trail on next scroll
    if (track) {
      const total = svgList.length - 1;
      const percent = total > 0 ? currentIndex / total : 0;
      const badgeWidth = counter.clientWidth;
      const trackWidth = track.offsetWidth;
      const minX = -badgeWidth / 2;
      const maxX = trackWidth - badgeWidth / 2;
      lastCounterY = minX + percent * (maxX - minX);
    }
  }
}

function attachCounterEventListeners() {
  const counter = document.querySelector('.slideshow-counter');
  if (counter) {
    counter.addEventListener('mousedown', onDragStart);
    counter.addEventListener('touchstart', onDragStart, { passive: false });
  }
}

const counter = document.querySelector('.slideshow-counter');
if (counter) {
  counter.addEventListener('mousedown', onDragStart);
  counter.addEventListener('touchstart', onDragStart, { passive: false });
}
document.addEventListener('mousemove', onDragMove);
document.addEventListener('touchmove', onDragMove, { passive: false });
document.addEventListener('mouseup', onDragEnd);
document.addEventListener('touchend', onDragEnd); 

window.addEventListener('resize', updateSVG); 

const contactBtn = document.querySelector('.contact-btn');
const mainContainer = document.querySelector('.main-black-container');
let originalMainContainerHTML = mainContainer.innerHTML;
contactBtn.addEventListener('click', function() {
  const isInverted = document.body.classList.toggle('contact-invert');
  contactBtn.textContent = isInverted ? 'Close' : 'Contact me';
  if (isInverted) {
    // Store current slideshow state before showing contact
    originalMainContainerHTML = mainContainer.innerHTML;
    mainContainer.innerHTML = `
      <div class="contact-info">
        <div class="email">lee@palomagroup.com</div>
        <div class="phone">+64 27 309 2926</div>
      </div>
    `;
  } else {
    // Restore original slideshow content
    mainContainer.innerHTML = originalMainContainerHTML;
    // Re-run updateSVG to restore the current slide position and counter
    setTimeout(() => {
      updateSVG();
      // Re-attach event listeners to the restored counter element
      attachCounterEventListeners();
    }, 50); // Small delay to ensure DOM is ready
  }
}); 

// Swipe functionality for mobile devices
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let isSwiping = false;

const minSwipeDistance = 50; // Minimum distance for a swipe
const maxVerticalDistance = 100; // Maximum vertical movement to still count as horizontal swipe

function handleTouchStart(e) {
  // Only handle swipes on the main container (slideshow area)
  const mainContainer = document.querySelector('.main-black-container');
  if (!mainContainer || !mainContainer.contains(e.target)) return;
  
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  isSwiping = false;
}

function handleTouchMove(e) {
  // Prevent default scrolling behavior during potential swipe
  const mainContainer = document.querySelector('.main-black-container');
  if (!mainContainer || !mainContainer.contains(e.target)) return;
  
  const currentX = e.touches[0].clientX;
  const currentY = e.touches[0].clientY;
  const deltaX = Math.abs(currentX - touchStartX);
  const deltaY = Math.abs(currentY - touchStartY);
  
  // If horizontal movement is greater than vertical, prevent default scrolling
  if (deltaX > deltaY && deltaX > 10) {
    e.preventDefault();
    isSwiping = true;
  }
}

function handleTouchEnd(e) {
  const mainContainer = document.querySelector('.main-black-container');
  if (!mainContainer || !mainContainer.contains(e.changedTouches[0].target)) return;
  
  touchEndX = e.changedTouches[0].clientX;
  touchEndY = e.changedTouches[0].clientY;
  
  handleSwipe();
}

function handleSwipe() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = Math.abs(touchEndY - touchStartY);
  
  // Check if it's a valid horizontal swipe
  if (Math.abs(deltaX) > minSwipeDistance && deltaY < maxVerticalDistance) {
    if (deltaX > 0) {
      // Swipe right - go to previous image
      if (currentIndex > 0) {
        currentIndex--;
        updateSVG();
      }
    } else {
      // Swipe left - go to next image
      if (currentIndex < svgList.length - 1) {
        currentIndex++;
        updateSVG();
      }
    }
  }
}

// Add touch event listeners
document.addEventListener('touchstart', handleTouchStart, { passive: false });
document.addEventListener('touchmove', handleTouchMove, { passive: false });
document.addEventListener('touchend', handleTouchEnd, { passive: false }); 