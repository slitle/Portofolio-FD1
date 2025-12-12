let fotos = {}; // carregado do JSON
let previewInterval = null;

// Carregar fotos.json e iniciar slideshow de preview a cada 5s
fetch("fotos.json")
  .then(r => r.json())
  .then(data => {
    fotos = data;
    gerarPreviewAleatorio(); // mostra imagem inicialmente
    previewInterval = setInterval(gerarPreviewAleatorio, 5000); // 5 segundos
  });

function gerarPreviewAleatorio() {
  const preview = document.getElementById("preview-img");
  if (!preview) return;

  const categorias = Object.keys(fotos);
  if (!categorias.length) return;

  const categoriaAleatoria = categorias[Math.floor(Math.random() * categorias.length)];
  const lista = fotos[categoriaAleatoria] || [];
  if (!lista.length) return;
  const fotoAleatoria = lista[Math.floor(Math.random() * lista.length)];

  // Usar classe CSS para transição de opacidade
  preview.classList.remove('mostrar');

  // Aguarda um curto período para a opacidade ir para 0 e depois troca a imagem
  setTimeout(() => {
    preview.src = `imagens/${categoriaAleatoria}/${fotoAleatoria}`;
    // força reflow breve (opcional) e adiciona classe para desvanecer para 1
    void preview.offsetWidth;
    preview.classList.add('mostrar');
  }, 250);
}

function abrirGaleria() {
  // Parar slideshow quando a galeria é aberta
  if (previewInterval) {
    clearInterval(previewInterval);
    previewInterval = null;
  }

  document.querySelector(".galeria-preview").style.display = "none";
  document.getElementById("buttons").style.display = "block";
  carregarCategoria("vasco"); // categoria padrão
}

function carregarCategoria(cat) {
  const galeria = document.getElementById("galeria-completa");
  galeria.style.display = "grid";
  galeria.innerHTML = "";

  fotos[cat].forEach(f => {
    galeria.innerHTML += `
      <div class="foto">
        <img src="imagens/${cat}/${f}" onclick="abrirModal('imagens/${cat}/${f}')">
      </div>
    `;
  });
}

function abrirModal(src) {
  document.getElementById("modal-img").src = src;
  document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

// Fechar modal ao clicar fora
document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target.id === "modal") fecharModal();
});
