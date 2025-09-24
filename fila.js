console.log("fila.js carregado com sucesso!");

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
  });
  document.addEventListener('DOMContentLoaded', () => {
    const bubbles = document.querySelectorAll('.thought-bubble');
  
    // Mostra todos ao iniciar
    bubbles.forEach(bubble => bubble.classList.remove('hidden'));
  
    // Opcional: esconder depois de 10s
    setTimeout(() => {
      bubbles.forEach(bubble => bubble.classList.add('hidden'));
    }, 10000);
  });
    