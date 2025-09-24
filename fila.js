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
  document.addEventListener('DOMContentLoaded', () => {
    const fila = [];
    const onibus = [];
    const MAX_CAPACIDADE = 4;

    const mochilasDisponiveisContainer = document.getElementById('mochilas-disponiveis');
    const filaSlots = document.querySelectorAll('.fila-slot');
    const onibusSlots = document.querySelectorAll('.onibus-slot');
    const btnEntrarOnibus = document.getElementById('btn-entrar-onibus');
    const onibusContainer = document.getElementById('onibus-container');

    function renderizar() {
      
        filaSlots.forEach(slot => slot.innerHTML = `<p>${parseInt(slot.dataset.posicao) + 1}º</p>`);
        fila.forEach((cor, index) => {
            if (index < filaSlots.length) {
                const slot = filaSlots[index];
                slot.innerHTML = `<img src="assets/mochila_${cor}.png" alt="Mochila ${cor}" class="mochila-na-fila">`;
            }
        });

        // mochilas SEMPRE clicáveis
        document.querySelectorAll('#mochilas-disponiveis .mochila').forEach(mochilaEl => {
            mochilaEl.classList.remove('adicionada');
        });

        onibusSlots.forEach(slot => slot.innerHTML = '');
        onibus.forEach((cor, index) => {
            if (index < onibusSlots.length) {
                const slot = onibusSlots[index];
                slot.innerHTML = `<img src="assets/mochila_${cor}.png" alt="Mochila ${cor}" class="mochila-no-onibus">`;
            }
        });

       // mostrar ônibus só quando a fila está cheia
if (fila.length === MAX_CAPACIDADE) {
  onibusContainer.classList.remove('hidden');
  onibusContainer.classList.add('bus-enter');

  onibusContainer.addEventListener('animationend', () => {
      onibusContainer.classList.remove('bus-enter');
  }, { once: true });
}

    }

    function handleMochilaClick(event) {
        const mochilaClicada = event.target;
        if (!mochilaClicada.classList.contains('mochila')) return;
        const cor = mochilaClicada.dataset.cor;

        if (fila.length < MAX_CAPACIDADE) {
            fila.push(cor);
            renderizar();
        }
    }

    function handleEntrarNoOnibus() {
        if (fila.length > 0) {
            const mochilaQueEntrou = fila.shift();
            onibus.push(mochilaQueEntrou);
            renderizar();

            if (onibus.length === MAX_CAPACIDADE) {
                // Esperar um pouco para ver mochilas entrarem
                setTimeout(() => {
                    onibusContainer.classList.add('bus-exit');

                    onibusContainer.addEventListener('animationend', () => {
                        // resetar estado
                        onibus.length = 0;
                        fila.length = 0;
                        onibusContainer.classList.remove('bus-exit');
                        onibusContainer.classList.add('hidden');
                        renderizar();
                    }, { once: true });
                }, 500);
            }
        }
    }

    mochilasDisponiveisContainer.addEventListener('click', handleMochilaClick);
    btnEntrarOnibus.addEventListener('click', handleEntrarNoOnibus);

    renderizar();
});
