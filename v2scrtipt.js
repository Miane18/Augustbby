const canvas = document.getElementById('scratch-canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const revealContent = document.getElementById('reveal-content');
const audio = document.getElementById('scratch-audio');

let isDrawing = false;
let lastPos = null;
let revealed = false;

// Set up overlay
ctx.fillStyle = '#bbb';
ctx.fillRect(0, 0, width, height);

ctx.fillStyle = '#444';
ctx.font = '15px Agradir';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('Scratch to reveal your surprise', width / 2, height / 2);

//
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 45; 

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
  const y = (e.clientY || e.touches?.[0].clientY) - rect.top;
  return { x, y };
}

function scratch(x, y) {
  ctx.globalCompositeOperation = 'destination-out';

  if (!lastPos) {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2); // smaller arc
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  lastPos = { x, y };

  if (audio && audio.paused) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
}

function checkScratchPercent() {
  const imageData = ctx.getImageData(0, 0, width, height);
  let cleared = 0;

  for (let i = 0; i < imageData.data.length; i += 4) {
    if (imageData.data[i+3] < 128) cleared++;
  }

  const scratchedPercent = (cleared / (width * height)) * 100;

  if (percent > 50 && !revealed) {
    revealed = true;

    canvas.style.display = 'none';
    revealContent.classList.remove('hidden');

    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 }
    });
    document.getElementById('cake').style.display = 'block';
    document.getElementById('cake').style.opacity = '1';
    canvas.style.transition = 'opacity 0.6s ease';
    canvas.style.opacity = '0';
    setTimeout(() => (canvas.style.display = 'none'), 600);
  }
}

//
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  lastPos = getPos(e);
  scratch(lastPos.x, lastPos.y);
});
canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;
  requestAnimationFrame(() => {
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  });
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

canvas.addEventListener('touchstart', (e) => {
  isDrawing = true;
  lastPos = getPos(e);
  scratch(lastPos.x, lastPos.y);
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
  if (!isDrawing) return;
  e.preventDefault();
  requestAnimationFrame(() => {
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  });
}, { passive: false });

canvas.addEventListener('touchend', () => {
  isDrawing = false;
  lastPos = null;
  checkScratchPercent();
});
