class Node {
  constructor(nome) {
    this.nome = nome;
    this.next = null;
  }
}

class ListaEncadeada {
  constructor() {
    this.head = null;
    this.length = 0;
  }

  adicionar(nome) {
    if (this.length >= 5) return;
    const novo = new Node(nome);
    if (!this.head) {
      this.head = novo;
    } else {
      let atual = this.head;
      while (atual.next) atual = atual.next;
      atual.next = novo;
    }
    this.length++;
  }

  removerPorNome(nomeRemover) {
    let atual = this.head;
    let anterior = null;
    while (atual) {
      if (atual.nome === nomeRemover) {
        if (anterior) {
          anterior.next = atual.next;
        } else {
          this.head = atual.next;
        }
        this.length--;
        break;
      }
      anterior = atual;
      atual = atual.next;
    }
  }

  toArray() {
    let arr = [];
    let atual = this.head;
    while (atual) {
      arr.push(atual.nome);
      atual = atual.next;
    }
    return arr;
  }
}

const posicoes = ['linha1', 'linha2', 'linha3', 'linha4', 'linha5'];
const lista = new ListaEncadeada();

function renderLista() {
  const ul = document.getElementById('nomes-lista');
  ul.innerHTML = '';
  let nomes = lista.toArray();
  for (let i = 0; i < posicoes.length; i++) {
    const li = document.createElement('li');
    li.className = posicoes[i] + ' linha-nome';
    li.textContent = nomes[i] || '';
    ul.appendChild(li);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderLista();

  // Adicionar nomes predefinidos
  document.querySelectorAll('.add-nome').forEach(btn => {
    btn.addEventListener('click', () => {
      if (lista.length < 5) {
        lista.adicionar(btn.dataset.nome);
        renderLista();
      }
    });
  });

  // Remover nome específico (botões à direita)
  document.querySelectorAll('.remove-nome').forEach(btn => {
    btn.addEventListener('click', () => {
      lista.removerPorNome(btn.dataset.nome);
      renderLista();
    });
  });

  // --- BOTÃO DE SOM (igual ao index.js) ---
  const audio =
    document.getElementById('online-music') ||
    document.getElementById('bg-music') ||
    document.getElementById('background-music') ||
    null;

  if (audio) {
    audio.play().catch(() => { /* autoplay pode falhar */ });

    const resumePlay = () => {
      audio.play().catch(() => {});
      document.body.removeEventListener('pointerdown', resumePlay);
    };
    document.body.addEventListener('pointerdown', resumePlay, { once: true });
  }

  const soundBtn = document.createElement('button');
  soundBtn.className = 'sound-toggle';
  soundBtn.setAttribute('aria-label', 'Ativar ou desativar música');
  soundBtn.textContent = '🔊';

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

  // Balão do personagem Ailton (hover/focus)
  const wrapper = document.getElementById('wrapper-ailton');
  if (wrapper) {
    const bubble = wrapper.querySelector('.thought-bubble');
    const img = wrapper.querySelector('.character-gif');
    if (bubble) bubble.classList.add('hidden');
    let hideTimeout = null;
    const showBubble = () => {
      if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null; }
      if (bubble) bubble.classList.remove('hidden');
    };
    const hideBubble = () => {
      if (hideTimeout) clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        if (bubble) bubble.classList.add('hidden');
        hideTimeout = null;
      }, 150);
    };
    wrapper.addEventListener('pointerenter', showBubble);
    wrapper.addEventListener('pointerleave', hideBubble);
    if (img) {
      img.addEventListener('focus', showBubble);
      img.addEventListener('blur', hideBubble);
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (bubble) bubble.classList.toggle('hidden');
        }
      });
    }
  }
});