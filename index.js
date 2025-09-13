// index.js — versão organizada e corrigida
document.addEventListener('DOMContentLoaded', () => {
    /* -------------------------
       Encontrar elemento de áudio (suporta vários ids)
       ------------------------- */
    const audio =
      document.getElementById('online-music') ||
      document.getElementById('bg-music') ||
      document.getElementById('background-music') ||
      null;
  
    /* ===== tentar autoplay (pode ser bloqueado) ===== */
    if (audio) {
      audio.play().catch(() => { /* autoplay pode falhar, sem problema */ });
  
      // Quando o usuário interagir pela primeira vez, tentar retomar reprodução
      const resumePlay = () => {
        audio.play().catch(() => {});
        document.body.removeEventListener('pointerdown', resumePlay);
      };
      document.body.addEventListener('pointerdown', resumePlay, { once: true });
    }
  
    /* -------------------------
       Botão de som — criado dinamicamente (visível por padrão)
       ------------------------- */
    const soundBtn = document.createElement('button');
    soundBtn.className = 'sound-toggle';
    soundBtn.setAttribute('aria-label', 'Ativar ou desativar música');
    soundBtn.textContent = '🔊';
  
    // estilo inline mínimo para garantir visibilidade (você pode mover para CSS se preferir)
    Object.assign(soundBtn.style, {
      position: 'fixed',
      left: '18px',
      bottom: '18px',
      zIndex: '999',
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '12px',
      padding: '10px 12px',
      border: '6px solid ' + getComputedStyle(document.documentElement).getPropertyValue('--button-border').trim(),
      background: getComputedStyle(document.documentElement).getPropertyValue('--button-green').trim(),
      boxShadow: '8px 8px 0 rgba(0,0,0,0.32)',
      cursor: 'pointer',
      display: 'block' // visível por padrão
    });
  
    document.body.appendChild(soundBtn);
  
    // Se não houver áudio, desativa visualmente o botão
    if (!audio) {
      soundBtn.disabled = true;
      soundBtn.style.opacity = '0.5';
      soundBtn.title = 'Áudio não disponível';
    }
  
    // Ligar / desligar audio via botão
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
  
    /* -------------------------
       Botões grandes — comportamento hover/active + acessibilidade teclado
       ------------------------- */
    const bigButtons = Array.from(document.querySelectorAll('.big-btn'));
    bigButtons.forEach(btnEl => {
      btnEl.addEventListener('pointerenter', () => btnEl.classList.add('is-hover'));
      btnEl.addEventListener('pointerleave', () => {
        btnEl.classList.remove('is-hover');
        btnEl.classList.remove('is-active');
      });
      btnEl.addEventListener('pointerdown', () => btnEl.classList.add('is-active'));
      btnEl.addEventListener('pointerup', () => btnEl.classList.remove('is-active'));
  
      // teclado
      btnEl.setAttribute('tabindex', '0');
      btnEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btnEl.classList.add('is-active');
        }
      });
      btnEl.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          btnEl.classList.remove('is-active');
          const href = btnEl.getAttribute('href');
          if (href) window.location.href = href;
        }
      });
    });
  
    /* -------------------------
       Fim do DOMContentLoaded
       ------------------------- */
  });
  