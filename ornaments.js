/**
 * ornaments.js
 * Draws all canvas decorations for Zelkyr:
 *  - Eight-pointed star seal (index page)
 *  - Ornamental bar with kalyna/wheat motifs
 *  - Top/bottom border strips
 *  - Small footer star
 */

(function () {
  const GOLD    = '#c8923a';
  const GOLD2   = '#e8b84a';
  const GOLDDIM = '#7a5a22';
  const DARK    = '#100d09';
  const BG      = '#080705';

  /* ── Utility ─────────────────────────────────────────────────────────── */

  function dpr(canvas, w, h) {
    const r = window.devicePixelRatio || 1;
    canvas.width  = w * r;
    canvas.height = h * r;
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(r, r);
    return ctx;
  }

  function eightPointedStar(ctx, cx, cy, r1, r2) {
    /* r1 = outer radius, r2 = inner radius */
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI) / 8 - Math.PI / 2;
      const r = i % 2 === 0 ? r1 : r2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  /* ── Main star seal ───────────────────────────────────────────────────── */

  function drawMainStar() {
    const canvas = document.getElementById('star-canvas');
    if (!canvas) return;
    const W = 340, H = 340;
    const ctx = dpr(canvas, W, H);
    const cx = W / 2, cy = H / 2;
    const S = W / 180;

    // Outer glow ring
    ctx.beginPath();
    ctx.arc(cx, cy, 82 * S, 0, Math.PI * 2);
    ctx.strokeStyle = GOLDDIM;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.4;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Second ring
    ctx.beginPath();
    ctx.arc(cx, cy, 72 * S, 0, Math.PI * 2);
    ctx.strokeStyle = GOLDDIM;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.25;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Ring tick marks
    for (let i = 0; i < 32; i++) {
      const a = (i * Math.PI * 2) / 32;
      const big = i % 4 === 0;
      const r0 = big ? 70 * S : 73 * S;
      const r1 = 76 * S;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
      ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.strokeStyle = big ? GOLD : GOLDDIM;
      ctx.lineWidth = big ? 1 : 0.5;
      ctx.globalAlpha = big ? 0.7 : 0.4;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Eight-pointed star — outer fill
    const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 64 * S);
    grad.addColorStop(0,   '#c8923a18');
    grad.addColorStop(0.6, '#c8923a08');
    grad.addColorStop(1,   'transparent');

    eightPointedStar(ctx, cx, cy, 64 * S, 26 * S);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.85;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Inner eight-pointed star
    eightPointedStar(ctx, cx, cy, 34 * S, 14 * S);
    ctx.strokeStyle = GOLD2;
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.6;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 4 * S, 0, Math.PI * 2);
    ctx.fillStyle = GOLD2;
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.globalAlpha = 1;

    // Center micro-star
    eightPointedStar(ctx, cx, cy, 10 * S, 5 * S);
    ctx.fillStyle = GOLD;
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  /* ── Ornamental bar ───────────────────────────────────────────────────── */

  function drawOrnBar(canvas, W, H) {
    if (!canvas) return;
    const ctx = dpr(canvas, W, H);
    const cy = H / 2;

    // Main horizontal line
    const lineGrad = ctx.createLinearGradient(0, 0, W, 0);
    lineGrad.addColorStop(0,    'transparent');
    lineGrad.addColorStop(0.08, GOLDDIM);
    lineGrad.addColorStop(0.5,  GOLD);
    lineGrad.addColorStop(0.92, GOLDDIM);
    lineGrad.addColorStop(1,    'transparent');

    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(W, cy);
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.6;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Parallel thin lines
    [-3, 3].forEach(off => {
      ctx.beginPath();
      ctx.moveTo(W * 0.08, cy + off);
      ctx.lineTo(W * 0.92, cy + off);
      ctx.strokeStyle = GOLDDIM;
      ctx.lineWidth = 0.4;
      ctx.globalAlpha = 0.25;
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    // Evenly spaced small diamonds along the bar
    const count = 9;
    const margin = W * 0.1;
    const step = (W - margin * 2) / (count - 1);

    for (let i = 0; i < count; i++) {
      const x = margin + i * step;
      const isCenter = i === Math.floor(count / 2);
      const size = isCenter ? 5 : 3;
      const alpha = isCenter ? 0.95 : 0.55;

      ctx.save();
      ctx.translate(x, cy);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = isCenter ? GOLD2 : GOLD;
      ctx.globalAlpha = alpha;
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.globalAlpha = 1;
      ctx.restore();

      // Small flanking dots on non-center diamonds
      if (!isCenter && i > 0 && i < count - 1) {
        [-7, 7].forEach(dx => {
          ctx.beginPath();
          ctx.arc(x + dx, cy, 0.8, 0, Math.PI * 2);
          ctx.fillStyle = GOLDDIM;
          ctx.globalAlpha = 0.4;
          ctx.fill();
          ctx.globalAlpha = 1;
        });
      }
    }
  }

  /* ── Border strip ─────────────────────────────────────────────────────── */

  function drawBorderStrip(canvas) {
    if (!canvas) return;
    const W = canvas.parentElement
      ? canvas.parentElement.offsetWidth || window.innerWidth
      : window.innerWidth;
    const H = 32;
    const ctx = dpr(canvas, W, H);

    // Background fill
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    // Top edge line
    ctx.beginPath();
    ctx.moveTo(0, 0.5);
    ctx.lineTo(W, 0.5);
    ctx.strokeStyle = GOLDDIM;
    ctx.lineWidth = 0.6;
    ctx.globalAlpha = 0.4;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Bottom edge line
    ctx.beginPath();
    ctx.moveTo(0, H - 0.5);
    ctx.lineTo(W, H - 0.5);
    ctx.strokeStyle = GOLDDIM;
    ctx.lineWidth = 0.6;
    ctx.globalAlpha = 0.4;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Repeating pattern: small rotated squares
    const unit = 32;
    const cy = H / 2;
    const count = Math.ceil(W / unit) + 1;

    for (let i = 0; i < count; i++) {
      const x = i * unit + unit / 2;
      const phase = i % 4;

      ctx.save();
      ctx.translate(x, cy);

      if (phase === 0 || phase === 2) {
        // Diamond
        ctx.rotate(Math.PI / 4);
        const s = phase === 0 ? 5 : 3;
        ctx.strokeStyle = phase === 0 ? GOLD : GOLDDIM;
        ctx.lineWidth = 0.7;
        ctx.globalAlpha = phase === 0 ? 0.6 : 0.35;
        ctx.strokeRect(-s / 2, -s / 2, s, s);
        ctx.globalAlpha = 1;
      } else {
        // Dot
        ctx.beginPath();
        ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = GOLDDIM;
        ctx.globalAlpha = 0.35;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.restore();

      // Connecting line between diamonds
      if (phase === 0 && i < count - 1) {
        ctx.beginPath();
        ctx.moveTo(x + unit / 2, cy);
        ctx.lineTo(x + unit * 1.5, cy);
        ctx.strokeStyle = GOLDDIM;
        ctx.lineWidth = 0.4;
        ctx.globalAlpha = 0.2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }

  /* ── Side border strip ────────────────────────────────────────────────── */

  function drawSideStrip(canvas) {
    if (!canvas) return;
    const W = 28;
    const H = window.innerHeight;
    const ctx = dpr(canvas, W, H);

    // Background fill — matches page bg
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2;

    // Inner edge line (the edge facing the content)
    const isLeft = canvas.id === 'border-left';
    const edgeX = isLeft ? W - 0.5 : 0.5;

    ctx.beginPath();
    ctx.moveTo(edgeX, 0);
    ctx.lineTo(edgeX, H);
    ctx.strokeStyle = GOLDDIM;
    ctx.lineWidth = 0.6;
    ctx.globalAlpha = 0.65;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Second inner line
    const edge2X = isLeft ? W - 4 : 4;
    ctx.beginPath();
    ctx.moveTo(edge2X, 0);
    ctx.lineTo(edge2X, H);
    ctx.strokeStyle = GOLDDIM;
    ctx.lineWidth = 0.3;
    ctx.globalAlpha = 0.3;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Center spine line with gradient fade at top and bottom
    const spineGrad = ctx.createLinearGradient(0, 0, 0, H);
    spineGrad.addColorStop(0,    'transparent');
    spineGrad.addColorStop(0.06, GOLDDIM);
    spineGrad.addColorStop(0.5,  GOLD);
    spineGrad.addColorStop(0.94, GOLDDIM);
    spineGrad.addColorStop(1,    'transparent');

    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, H);
    ctx.strokeStyle = spineGrad;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.55;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Repeating ornament units along the strip
    const unit = 48;
    const count = Math.ceil(H / unit) + 1;

    for (let i = 0; i < count; i++) {
      const y = i * unit + unit / 2;
      const phase = i % 6;

      ctx.save();
      ctx.translate(cx, y);

      if (phase === 0) {
        // Large diamond
        ctx.rotate(Math.PI / 4);
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = 0.75;
        ctx.strokeRect(-4, -4, 8, 8);
        ctx.globalAlpha = 1;
        // Inner dot
        ctx.rotate(-Math.PI / 4);
        ctx.beginPath();
        ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = GOLD;
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.globalAlpha = 1;

      } else if (phase === 3) {
        // Eight-pointed micro-star
        eightPointedStar(ctx, 0, 0, 6, 3);
        ctx.strokeStyle = GOLD2;
        ctx.lineWidth = 0.7;
        ctx.globalAlpha = 0.65;
        ctx.stroke();
        ctx.globalAlpha = 1;

      } else if (phase === 1 || phase === 5) {
        // Small diamond
        ctx.rotate(Math.PI / 4);
        ctx.strokeStyle = GOLDDIM;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.6;
        ctx.strokeRect(-2.5, -2.5, 5, 5);
        ctx.globalAlpha = 1;

      } else if (phase === 2 || phase === 4) {
        // Dot pair flanking the spine
        [-5, 5].forEach(dx => {
          ctx.beginPath();
          ctx.arc(dx, 0, 1, 0, Math.PI * 2);
          ctx.fillStyle = GOLDDIM;
          ctx.globalAlpha = 0.3;
          ctx.fill();
          ctx.globalAlpha = 1;
        });
      }

      ctx.restore();

      // Short tick marks on the inner edge line between units
      if (phase === 0 || phase === 3) {
        const tickX1 = isLeft ? W - 6 : 6;
        const tickX2 = isLeft ? W - 1 : 1;
        ctx.beginPath();
        ctx.moveTo(tickX1, y);
        ctx.lineTo(tickX2, y);
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 0.6;
        ctx.globalAlpha = 0.55;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    // Kalyna berry at every plain interval (phase 2 and 4)
    function sideberry(x, y, r) {
      const positions = [[0, -r * 1.2], [-r * 0.8, r * 0.5], [r * 0.8, r * 0.5]];
      positions.forEach(([dx, dy]) => {
        ctx.beginPath();
        ctx.arc(x + dx, y + dy, r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#8b2010';
        ctx.globalAlpha = 0.45;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(x + dx - r * 0.1, y + dy - r * 0.1, r * 0.16, 0, Math.PI * 2);
        ctx.fillStyle = '#ff8060';
        ctx.globalAlpha = 0.25;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    for (let i = 0; i < count; i++) {
      const y = i * unit + unit / 2;
      const phase = i % 6;
      if (phase === 2 || phase === 4) {
        sideberry(cx, y, 4);
      }
    }
  }


  function drawFooterStar() {
    const canvas = document.getElementById('footer-star');
    if (!canvas) return;
    const W = 40, H = 40;
    const ctx = dpr(canvas, W, H);
    const cx = W / 2, cy = H / 2;

    eightPointedStar(ctx, cx, cy, 16, 7);
    ctx.strokeStyle = GOLDDIM;
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.7;
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = GOLDDIM;
    ctx.globalAlpha = 0.6;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  /* ── Init ─────────────────────────────────────────────────────────────── */

  function init() {
    drawMainStar();

    const bar1 = document.getElementById('orn-bar');
    const bar2 = document.getElementById('orn-bar2');
    if (bar1) drawOrnBar(bar1, 640, 28);
    if (bar2) drawOrnBar(bar2, 640, 16);

    const bt = document.getElementById('border-top');
    const bb = document.getElementById('border-bottom');
    const bl = document.getElementById('border-left');
    const br = document.getElementById('border-right');
    if (bt) drawBorderStrip(bt);
    if (bb) drawBorderStrip(bb);
    if (bl) drawSideStrip(bl);
    if (br) drawSideStrip(br);

    drawFooterStar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      const bt = document.getElementById('border-top');
      const bb = document.getElementById('border-bottom');
      const bl = document.getElementById('border-left');
      const br = document.getElementById('border-right');
      if (bt) drawBorderStrip(bt);
      if (bb) drawBorderStrip(bb);
      if (bl) drawSideStrip(bl);
      if (br) drawSideStrip(br);
    }, 120);
  });

})();
