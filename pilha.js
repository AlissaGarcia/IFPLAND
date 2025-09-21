// Versão ajustada de pilha/controle — inclui correção do som e empilhamento visual
document.addEventListener('DOMContentLoaded', () => {
    // -----------------------
    // Áudio / botão de som (preservado do seu script)
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
  
    // cria botão de som (se desejar mantê-lo visualmente)
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
    const maxBooks = 5;
  

    function pushBookToStack(src) {
        if (stack.children.length >= maxBooks) {
          stack.classList.add('full');
          setTimeout(() => stack.classList.remove('full'), 300);
          return;
        }
      
        const idx = stack.children.length;
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Livro empilhado';
        img.className = 'stack-book';
        img.style.position = 'absolute';
        img.style.left = '0';
        img.style.bottom = `${idx * 29}px`; // controle do espaçamento vertical entre capas
        img.style.zIndex = 200 + idx;
        img.style.userSelect = 'none';
        img.style.transformOrigin = 'center top';
        img.style.opacity = '0';
      
        // evita re-entrância se por algum motivo empilharem o mesmo elemento rapidinho
        if (img.dataset.animating === '1') return;
        img.dataset.animating = '1';
      
        // rotação leve para visual natural
        const rotation = (Math.random() - 0.5) * 8; // -4deg a +4deg
      
        // início "lá em cima"
        const startY = -(window.innerHeight + 120);
      
        // garantir que não haja transições CSS conflitantes
        const prevTransition = img.style.transition || '';
        img.style.transition = 'none';
        img.style.transform = `translateY(${startY}px) rotate(${rotation}deg)`;
      
        stack.appendChild(img);
      
        // forçar repaint antes de iniciar a animação
        requestAnimationFrame(() => {
          const duration = 900; // ms - ajuste se quiser mais rápido/lento
          const keyframes = [
            { transform: `translateY(${startY}px) rotate(${rotation}deg)`, opacity: 0 },
            { transform: `translateY(18px) rotate(${rotation}deg)`, opacity: 1, offset: 0.78 },
            { transform: `translateY(0px) rotate(${rotation}deg)`, opacity: 1 }
          ];
      
          // anima com Web Animations API e preserva o estado final (fill: 'forwards')
          const anim = img.animate(keyframes, {
            duration,
            easing: 'cubic-bezier(.22,1.1,.32,1)',
            fill: 'forwards'
          });
      
          // quando termina, limpamos o flag e removemos transições conflitantes
          anim.onfinish = () => {
            // setamos o estado final explicitamente (idempotente) e removemos transition
            img.style.transform = `translateY(0px) rotate(${rotation}deg)`;
            img.style.opacity = '1';
            img.style.transition = 'none'; // garante que não haja "segunda queda" via CSS
            delete img.dataset.animating;
      
            // opcional: se quiser reativar transições CSS depois de um curto período:
            // setTimeout(() => { img.style.transition = prevTransition; }, 300);
          };
      
          // em caso de cancelamento (por segurança)
          anim.oncancel = () => { delete img.dataset.animating; };
        });
      }
      
  
    // ao clicar num thumbnail, clona a imagem para a pilha
    shelf.querySelectorAll('.book-thumb').forEach(thumb => {
      thumb.addEventListener('click', (ev) => {
        ev.preventDefault();
        // recomendo usar thumb.dataset.* se quiser carregar metadados
        pushBookToStack(thumb.src);
      });
      // tecla Enter / espaço para acessibilidade
      thumb.tabIndex = 0;
      thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pushBookToStack(thumb.src);
        }
      });
    });
  
    // controles de leitura (apenas exemplos simples)
    const readTopBtn = document.getElementById('read-top');
    const readAllBtn = document.getElementById('read-all');
  
    readTopBtn && readTopBtn.addEventListener('click', () => {
      if (!stack.lastElementChild) {
        alert('Nenhum livro na pilha.');
        return;
      }
      // remover o último (LIFO)
      const top = stack.lastElementChild;
      top.style.transition = 'transform 260ms ease, opacity 200ms';
      top.style.transform = 'translateY(-24px) rotate(-10deg)';
      top.style.opacity = '0';
      setTimeout(() => top.remove(), 260);
    });
  
    readAllBtn && readAllBtn.addEventListener('click', () => {
      if (!stack.children.length) { alert('Nenhum livro na pilha.'); return; }
      // esvazia a pilha um por um (animação)
      const toRemove = Array.from(stack.children).reverse();
      toRemove.forEach((el, i) => {
        setTimeout(() => {
          el.style.transform = 'translateY(-42px) rotate(-12deg)';
          el.style.opacity = '0';
          setTimeout(() => el.remove(), 280);
        }, i * 120);
      });
    });

    // --- Posiciona os controles logo abaixo da pilha com 5cm de espaçamento ---
(function () {
    const controls = document.getElementById('controls'); // seu container de botões
    const stack = document.getElementById('stack');
  
    if (!controls || !stack) return;
  
    // converte centímetros para pixels (1in = 96px; 1in = 2.54cm)
    function cmToPx(cm) {
      return (cm * 96) / 2.54;
    }
    const gapPx = cmToPx(3);
  
    // posiciona os controles com base na posição atual do elemento stack
    function positionControls() {
      // boundingClientRect dá coordenadas relativas à viewport
      const stackRect = stack.getBoundingClientRect();
      const controlsRect = controls.getBoundingClientRect();
  
      // Se o stack estiver invisível (display:none) ou com 0x0, posiciona por segurança sobre a mesa
      if (stackRect.width === 0 && stackRect.height === 0) {
        // fallback: posiciona os controles logo abaixo do centro da game-area
        const gameArea = document.getElementById('game-area') || document.querySelector('.game-area');
        const gaRect = gameArea ? gameArea.getBoundingClientRect() : { left: window.innerWidth/2, bottom: window.innerHeight/2, width: 0 };
        const fallbackLeft = (gaRect.left + (gaRect.width/2)) - (controlsRect.width / 2) + window.scrollX;
        const fallbackTop = (gaRect.bottom + gapPx) + window.scrollY;
        controls.style.left = `${Math.max(8, fallbackLeft)}px`;
        controls.style.top = `${Math.max(8, fallbackTop)}px`;
        return;
      }

      /* -------------------------
       Personagens: balões aparecem só no hover/focus
       ------------------------- */
    const wrappers = Array.from(document.querySelectorAll('.character-wrapper, .character-wrapper.right'));
  
    if (wrappers.length > 0) {
      // Inicializa: esconde todos os balões
      wrappers.forEach(wrapper => {
        const bubble = wrapper.querySelector('.thought-bubble');
        if (bubble) bubble.classList.add('hidden');
      });
  
      // Debounce simples para evitar flicker ao mover rapidamente
      let hideTimeout = null;
      const showBubble = (bubble) => {
        if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null; }
        if (bubble) bubble.classList.remove('hidden');
      };
      const hideBubble = (bubble) => {
        if (hideTimeout) clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
          if (bubble) bubble.classList.add('hidden');
          hideTimeout = null;
        }, 150);
      };
  
      wrappers.forEach(wrapper => {
        const bubble = wrapper.querySelector('.thought-bubble');
        const img = wrapper.querySelector('.character-gif');
  
        // pointer events (funciona em mouse e touch-capable pointers)
        wrapper.addEventListener('pointerenter', () => showBubble(bubble));
        wrapper.addEventListener('pointerleave', () => hideBubble(bubble));
  
        // acessibilidade por teclado: foco mostra, blur esconde
        if (img) {
          img.addEventListener('focus', () => showBubble(bubble));
          img.addEventListener('blur', () => hideBubble(bubble));
  
          // Enter / Space alterna visibilidade (útil para dispositivos sem pointer)
          img.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (bubble) bubble.classList.toggle('hidden');
            }
          });
        }
      });
    }
  
      // centra horizontalmente em relação à pilha
      const centerX = stackRect.left + (stackRect.width / 2);
      const left = centerX - (controlsRect.width / 2) + window.scrollX;
      // top = pilha.bottom + gap
      const top = stackRect.bottom + gapPx + window.scrollY;
  
      // ajusta se ficar fora da viewport/das margens
      const minLeft = 8 + window.scrollX;
      const maxLeft = document.documentElement.clientWidth - controlsRect.width - 8 + window.scrollX;
      const finalLeft = Math.min(Math.max(left, minLeft), maxLeft);
  
      // aplica
      controls.style.position = 'absolute';
      controls.style.left = `${finalLeft}px`;
      controls.style.top = `${top}px`;
      // remove qualquer transform que possa deslocar o elemento
      controls.style.transform = 'translateX(0)';
    }
  
    // Debounce/raf helper para evitar chamar em excesso durante resize/scroll
    let rafId = null;
    function schedulePosition() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        positionControls();
        rafId = null;
      });
    }
  
    // inicializa
    schedulePosition();
  
    // reposiciona quando:
    window.addEventListener('resize', schedulePosition);
    window.addEventListener('scroll', schedulePosition, { passive: true });
  
    // Se a pilha muda de tamanho (livros adicionados/removidos), reposiciona
    const observer = new MutationObserver(schedulePosition);
    observer.observe(stack, { childList: true, subtree: false });
  
    // também garante reposicionar após fontes/ imagens carregarem (caso o tamanho mude)
    window.addEventListener('load', schedulePosition);
  })();
  
  
  });
  