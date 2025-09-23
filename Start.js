document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const charJessica = document.getElementById('char-jessica');
    const bubble = document.getElementById('bubble-jessica');
  
    // Mostrar/ocultar balão ao passar o mouse ou focar
    charJessica.addEventListener('pointerenter', () => {
      bubble.classList.remove('hidden');
    
      const rect = bubble.getBoundingClientRect();
      if (rect.left < 0) {
        bubble.style.left = "0";
        bubble.style.transform = "translateX(0)";
      } else if (rect.right > window.innerWidth) {
        bubble.style.left = "auto";
        bubble.style.right = "0";
        bubble.style.transform = "translateX(0)";
      }
    });
    
    charJessica.addEventListener('pointerleave', () => bubble.classList.add('hidden'));
    charJessica.addEventListener('focus', () => bubble.classList.remove('hidden'));
    charJessica.addEventListener('blur', () => bubble.classList.add('hidden'));
  
    // Ao clicar em START → animação e troca de página
    startBtn.addEventListener('click', () => {
      startBtn.classList.add('animate');
      document.body.classList.add('fade-out');
  
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1200); // tempo da animação antes de redirecionar
    });
  });
  