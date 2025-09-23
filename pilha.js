// Versão ajustada de pilha/controle — inclui correção do som, empilhamento visual e aviso de limite
document.addEventListener('DOMContentLoaded', () => {
  // -----------------------
  // Áudio / botão de som
  // -----------------------
  const audio =
    document.getElementById('online-music') ||
    document.getElementById('bg-music') ||
    document.getElementById('background-music') ||
    null;

  if (audio) {
    audio.play().catch(() => {});
    const resumePlay = () => {
      audio.play().catch(() => {});
      document.body.removeEventListener('pointerdown', resumePlay);
    };
    document.body.addEventListener('pointerdown', resumePlay, { once: true });
  }

  const soundBtn = document.createElement('button');
  soundBtn.className = 'sound-toggle';
  soundBtn.setAttribute('aria-label', 'Ativar ou desativar música');
  soundBtn.textContent = audio && !audio.paused ? '🔊' : '🔈';
  Object.assign(soundBtn.style, {
    position: 'fixed',
    left: '18px',
    bottom: '18px',
    zIndex: '1100',
    fontFamily: "'Press Start 2P', monospace",
    fontSize: '12px',
    padding: '10px 12px',
    border: '6px solid ' + getComputedStyle(document.documentElement).getPropertyValue('--button-border').trim(),
    background: getComputedStyle(document.documentElement).getPropertyValue('--button-green').trim(),
    boxShadow: '8px 8px 0 rgba(0,0,0,0.32)',
    cursor: 'pointer',
    display: 'block'
  });
  document.body.appendChild(soundBtn);

  if (!audio) {
    soundBtn.disabled = true;
    soundBtn.style.opacity = '0.5';
    soundBtn.title = 'Áudio não disponível';
  }

  soundBtn.addEventListener('click', () => {
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      soundBtn.textContent = '🔊';
    } else {
      audio.pause();
      soundBtn.textContent = '🔈';
    }
  });

  // -----------------------
  // Empilhamento de livros (stack)
  // -----------------------
  const shelf = document.getElementById('shelf');
  const stack = document.getElementById('stack');
  const notice = document.getElementById('notice');
  const maxBooks = 5;

  // função que atualiza a visibilidade do aviso
  function atualizarAviso() {
    if (!notice) return;
    if (stack.children.length >= maxBooks) {
      notice.style.display = 'block';
    } else {
      notice.style.display = 'none';
    }
  }

  function pushBookToStack(src) {
    if (stack.children.length >= maxBooks) {
      stack.classList.add('full');
      setTimeout(() => stack.classList.remove('full'), 300);
      atualizarAviso();
      return;
    }

    const idx = stack.children.length;
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Livro empilhado';
    img.className = 'stack-book';
    img.style.position = 'absolute';
    img.style.left = '0';
    img.style.bottom = `${idx * 29}px`;
    img.style.zIndex = 200 + idx;
    img.style.userSelect = 'none';
    img.style.transformOrigin = 'center top';
    img.style.opacity = '0';

    if (img.dataset.animating === '1') return;
    img.dataset.animating = '1';

    const rotation = (Math.random() - 0.5) * 8;
    const startY = -(window.innerHeight + 120);

    const prevTransition = img.style.transition || '';
    img.style.transition = 'none';
    img.style.transform = `translateY(${startY}px) rotate(${rotation}deg)`;

    stack.appendChild(img);

    requestAnimationFrame(() => {
      const duration = 900;
      const keyframes = [
        { transform: `translateY(${startY}px) rotate(${rotation}deg)`, opacity: 0 },
        { transform: `translateY(18px) rotate(${rotation}deg)`, opacity: 1, offset: 0.78 },
        { transform: `translateY(0px) rotate(${rotation}deg)`, opacity: 1 }
      ];

      const anim = img.animate(keyframes, {
        duration,
        easing: 'cubic-bezier(.22,1.1,.32,1)',
        fill: 'forwards'
      });

      anim.onfinish = () => {
        img.style.transform = `translateY(0px) rotate(${rotation}deg)`;
        img.style.opacity = '1';
        img.style.transition = 'none';
        delete img.dataset.animating;
        atualizarAviso(); // verifica sempre ao final
      };

      anim.oncancel = () => { delete img.dataset.animating; };
    });
  }

  // clique nos livros da estante
  shelf.querySelectorAll('.book-thumb').forEach(thumb => {
    thumb.addEventListener('click', (ev) => {
      ev.preventDefault();
      pushBookToStack(thumb.src);
    });
    thumb.tabIndex = 0;
    thumb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pushBookToStack(thumb.src);
      }
    });
  });

  // controles
  const readTopBtn = document.getElementById('read-top');
  const readAllBtn = document.getElementById('read-all');

  readTopBtn && readTopBtn.addEventListener('click', () => {
    if (!stack.lastElementChild) {
      alert('Nenhum livro na pilha.');
      return;
    }
    const top = stack.lastElementChild;
    top.style.transition = 'transform 260ms ease, opacity 200ms';
    top.style.transform = 'translateY(-24px) rotate(-10deg)';
    top.style.opacity = '0';
    setTimeout(() => {
      top.remove();
      atualizarAviso(); // verifica ao remover
    }, 260);
  });

  readAllBtn && readAllBtn.addEventListener('click', () => {
    if (!stack.children.length) { alert('Nenhum livro na pilha.'); return; }
    const toRemove = Array.from(stack.children).reverse();
    toRemove.forEach((el, i) => {
      setTimeout(() => {
        el.style.transform = 'translateY(-42px) rotate(-12deg)';
        el.style.opacity = '0';
        setTimeout(() => {
          el.remove();
          if (i === toRemove.length - 1) atualizarAviso(); // atualiza no fim
        }, 280);
      }, i * 120);
    });
  });

  // --- Posiciona os controles ---
  (function () {
    const controls = document.getElementById('controls');
    if (!controls || !stack) return;

    function cmToPx(cm) {
      return (cm * 96) / 2.54;
    }
    const gapPx = cmToPx(3);

    function positionControls() {
      const stackRect = stack.getBoundingClientRect();
      const controlsRect = controls.getBoundingClientRect();

      if (stackRect.width === 0 && stackRect.height === 0) {
        const gameArea = document.getElementById('game-area') || document.querySelector('.game-area');
        const gaRect = gameArea ? gameArea.getBoundingClientRect() : { left: window.innerWidth/2, bottom: window.innerHeight/2, width: 0 };
        const fallbackLeft = (gaRect.left + (gaRect.width/2)) - (controlsRect.width / 2) + window.scrollX;
        const fallbackTop = (gaRect.bottom + gapPx) + window.scrollY;
        controls.style.left = `${Math.max(8, fallbackLeft)}px`;
        controls.style.top = `${Math.max(8, fallbackTop)}px`;
        return;
      }

      const centerX = stackRect.left + (stackRect.width / 2);
      const left = centerX - (controlsRect.width / 2) + window.scrollX;
      const top = stackRect.bottom + gapPx + window.scrollY;

      const minLeft = 8 + window.scrollX;
      const maxLeft = document.documentElement.clientWidth - controlsRect.width - 8 + window.scrollX;
      const finalLeft = Math.min(Math.max(left, minLeft), maxLeft);

      controls.style.position = 'absolute';
      controls.style.left = `${finalLeft}px`;
      controls.style.top = `${top}px`;
      controls.style.transform = 'translateX(0)';
    }

    let rafId = null;
    function schedulePosition() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        positionControls();
        rafId = null;
      });
    }

    schedulePosition();
    window.addEventListener('resize', schedulePosition);
    window.addEventListener('scroll', schedulePosition, { passive: true });

    const observer = new MutationObserver(() => {
      schedulePosition();
      atualizarAviso(); // também atualiza aviso quando a pilha mudar
    });
    observer.observe(stack, { childList: true, subtree: false });

    window.addEventListener('load', schedulePosition);
  })();

  // inicializa aviso escondido
  atualizarAviso();
});
