const canvas = document.getElementById('scratch-canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
let isDrawing = false;
let lastPos = null;
let revealed = false;

// Fill canvas with grey cover
ctx.fillStyle = '#bbb';
ctx.fillRect(0, 0, width, height);

ctx.fillStyle = '#444';
ctx.font = '16px Agrandir';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('Scratch to reveal your surprise', width / 2, height / 2);

// Brush settings
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.lineWidth = 50;

function getPointerPos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX || e.touches?.[0]?.clientX) - rect.left,
    y: (e.clientY || e.touches?.[0]?.clientY) - rect.top
  };
}

function scratch(x, y) {
  ctx.globalCompositeOperation = 'destination-out';

  if (!lastPos) {
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  const audio = document.getElementById('scratch-audio');
  if (audio && audio.paused) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  lastPos = { x, y };
}

function checkScratchPercent() {
  const imageData = ctx.getImageData(0, 0, width, height);
  let cleared = 0;

  for (let i = 3; i < imageData.data.length; i += 4) {
    if (imageData.data[i] < 128) cleared++;
  }

  const scratchedPercent = (cleared / (width * height)) * 100;

  if (scratchedPercent > 50 && !revealed) {
    revealed = true;

    // Hide canvas
    canvas.style.transition = 'opacity 0.8s ease';
    canvas.style.opacity = '0';
    setTimeout(() => (canvas.style.display = 'none'), 800);

    // Show hidden content
  const cake = document.getElementById('Cake');
const birthdayText = document.getElementById('birthday-text');
const wick = document.querySelector('.wick');
const flame = document.querySelector('.flame');

// Make sure they're initially transparent
cake.style.transition = 'opacity 1s ease';
birthdayText.style.transition = 'opacity 1s ease';
cake.style.opacity = 1;
birthdayText.style.opacity = 1;

// Wick & flame fade in after a delay
setTimeout(() => {
  wick.classList.add('show');
  flame.classList.add('show');
}, 800);
    // Confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// Event listeners
canvas.addEventListener('mousedown', e => {
  isDrawing = true;
  lastPos = getPointerPos(e);
  scratch(lastPos.x, lastPos.y);
});
canvas.addEventListener('mousemove', e => {
  if (!isDrawing) return;
  const pos = getPointerPos(e);
  scratch(pos.x, pos.y);
});
canvas.addEventListener('mouseup', () => {
  isDrawing = false;
  lastPos = null;
  checkScratchPercent();
});
canvas.addEventListener('mouseleave', () => {
  isDrawing = false;
  lastPos = null;
});

canvas.addEventListener('touchstart', e => {
  isDrawing = true;
  lastPos = getPointerPos(e);
  scratch(lastPos.x, lastPos.y);
});
canvas.addEventListener('touchmove', e => {
  if (!isDrawing) return;
  e.preventDefault();
  const pos = getPointerPos(e);
  scratch(pos.x, pos.y);
}, { passive: false });
canvas.addEventListener('touchend', () => {
  isDrawing = false;
  lastPos = null;
  checkScratchPercent();
});
