let fotos = {}; // carregado do JSON
let previewInterval = null;

// Carregar fotos.json e iniciar slideshow de preview a cada 5s
fetch("fotos.json")
  .then(r => r.json())
  .then(data => {
    fotos = data;
    gerarPreviewAleatorio(); // mostra imagem inicialmente
    previewInterval = setInterval(gerarPreviewAleatorio, 5000); // 5 segundos (mantém slideshow no background)
    renderCategoryTiles();
  });

function gerarPreviewAleatorio() {
  const categorias = Object.keys(fotos);
  if (!categorias.length) return;

  const categoriaAleatoria = categorias[Math.floor(Math.random() * categorias.length)];
  const lista = fotos[categoriaAleatoria] || [];
  if (!lista.length) return;
  const fotoAleatoria = lista[Math.floor(Math.random() * lista.length)];

  // Usar classe CSS para transição de opacidade
  // Atualiza o background do site para corresponder ao preview
  const bg = document.getElementById('intro-bg');
  if (bg) {
    bg.style.opacity = 0;
    setTimeout(() => {
      bg.style.backgroundImage = `linear-gradient(rgba(255,255,255,0.25), rgba(255,255,255,0.25)), url('imagens/${categoriaAleatoria}/${fotoAleatoria}')`;
      bg.style.opacity = 1;
    }, 300);
  }

  // Se existir o elemento preview frontal, atualiza-o também (opcional)
  const preview = document.getElementById("preview-img");
  if (preview) {
    preview.classList.remove('mostrar');
    setTimeout(() => {
      preview.src = `imagens/${categoriaAleatoria}/${fotoAleatoria}`;
      void preview.offsetWidth;
      preview.classList.add('mostrar');
    }, 250);
  }
}

function abrirGaleria() {
  // Esconde a secção de tiles e abre a galeria com o primeiro álbum
  const select = document.querySelector('.gallery-select');
  if (select) select.style.display = 'none';
  const primeiras = Object.keys(fotos);
  if (primeiras.length) carregarCategoria(primeiras[0]);
}

function carregarCategoria(cat) {
  // Tenta resolver categorias por correspondência simples (caso os nomes passem abreviações)
  const categorias = Object.keys(fotos);
  let chave = cat;
  if (!fotos[cat]) {
    const found = categorias.find(k => k.toLowerCase().includes(String(cat).toLowerCase()));
    if (found) chave = found;
  }

  const galeria = document.getElementById("galeria-completa");
  galeria.style.display = "grid";
  galeria.innerHTML = "";

  // Construir HTML como string para evitar perda de event listeners ao usar innerHTML +=
  let html = `<button class="btn" onclick="voltarGaleria()">Voltar</button>`;
  const lista = fotos[chave] || [];
  lista.forEach(f => {
    html += `
      <div class="foto">
        <img src="imagens/${chave}/${f}" onclick="abrirModal('imagens/${chave}/${f}')">
      </div>
    `;
  });
  galeria.innerHTML = html;
}

function voltarGaleria() {
  const galeria = document.getElementById("galeria-completa");
  if (galeria) galeria.style.display = 'none';
  const select = document.querySelector('.gallery-select');
  if (select) select.style.display = '';
}

function renderCategoryTiles() {
  const container = document.getElementById('category-tiles');
  if (!container) return;
  container.innerHTML = '';
  const categorias = Object.keys(fotos);
  categorias.forEach(cat => {
    const lista = fotos[cat] || [];
    const thumb = lista.length ? lista[0] : '';
    const div = document.createElement('div');
    div.className = 'tile';
    div.style.backgroundImage = `url('imagens/${cat}/${thumb}')`;
    const name = document.createElement('span');
    name.textContent = cat.replace(/-/g, ' ');
    div.appendChild(name);
    div.onclick = () => {
      // abrir galeria dessa categoria
      const select = document.querySelector('.gallery-select');
      if (select) select.style.display = 'none';
      carregarCategoria(cat);
    };
    container.appendChild(div);
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
