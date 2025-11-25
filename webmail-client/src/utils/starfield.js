function createStar(width, height, maxRadius, baseSpeed) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * (maxRadius - 0.2) + 0.2,
    opacity: Math.random(),
    velocity: baseSpeed + Math.random() * baseSpeed
  };
}

export function createStarfield(canvasId, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !canvas.getContext) return () => {};

  const ctx = canvas.getContext('2d');
  const starCount = options.starCount || 150;
  const maxRadius = options.maxRadius || 1.5;
  const baseSpeed = options.speed || 0.1;

  let width = 0;
  let height = 0;
  let animationFrame;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: starCount }, () =>
    createStar(width, height, maxRadius, baseSpeed)
  );

  function draw() {
    animationFrame = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, width, height);

    for (const star of stars) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();

      star.y += star.velocity;
      if (star.y > height) {
        star.y = 0;
        star.x = Math.random() * width;
      }

      star.opacity += (Math.random() - 0.5) * 0.08;
      star.opacity = Math.max(0.1, Math.min(1, star.opacity));
    }
  }

  draw();

  return () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    window.removeEventListener('resize', resize);
  };
}
