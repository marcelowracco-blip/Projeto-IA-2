// ====================== BANCO DE DADOS DE PRODUTOS ======================
const produtos = [
  { id: 1, nome: "Sofá Retrô Laranja", preco: 899.90, categoria: "moveis", imagem: "https://picsum.photos/id/20/400/300", destaque: true },
  { id: 2, nome: "Estante Flutuante Verde Musgo", preco: 239.90, categoria: "moveis", imagem: "https://picsum.photos/id/116/400/300", destaque: true },
  { id: 3, nome: "Jogo de Louças Bege", preco: 149.90, categoria: "cozinha", imagem: "https://picsum.photos/id/30/400/300", destaque: false },
  { id: 4, nome: "Luminária Suspensa", preco: 189.90, categoria: "iluminacao", imagem: "https://picsum.photos/id/26/400/300", destaque: true },
  { id: 5, nome: "Almofada Laranja Estampada", preco: 59.90, categoria: "decoracao", imagem: "https://picsum.photos/id/96/400/300", destaque: false },
  { id: 6, nome: "Painel Ripado Verde", preco: 429.90, categoria: "decoracao", imagem: "https://picsum.photos/id/103/400/300", destaque: false },
  { id: 7, nome: "Kit Panelas Antiaderente", preco: 329.90, categoria: "cozinha", imagem: "https://picsum.photos/id/21/400/300", destaque: true },
  { id: 8, nome: "Abajur de Piso", preco: 279.90, categoria: "iluminacao", imagem: "https://picsum.photos/id/22/400/300", destaque: false },
  { id: 9, nome: "Cadeira Escandinava", preco: 379.90, categoria: "moveis", imagem: "https://picsum.photos/id/99/400/300", destaque: false }
];

// ====================== GERENCIAMENTO DO CARRINHO (localStorage) ======================
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function atualizarCarrinhoUI() {
  const cartCountSpan = document.getElementById('cartCount');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartTotalSpan = document.getElementById('cartTotal');
  
  if(cartCountSpan) {
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    cartCountSpan.innerText = totalItens;
  }
  
  if(cartItemsList) {
    if(carrinho.length === 0) {
      cartItemsList.innerHTML = '<li style="justify-content:center">Seu carrinho está vazio.</li>';
    } else {
      cartItemsList.innerHTML = carrinho.map(item => `
        <li><span>${item.nome} (x${item.quantidade})</span><span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span></li>
      `).join('');
    }
    const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    if(cartTotalSpan) cartTotalSpan.innerText = `R$ ${total.toFixed(2)}`;
  }
}

function adicionarAoCarrinho(produto) {
  const existe = carrinho.find(item => item.id === produto.id);
  if(existe) {
    existe.quantidade += 1;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }
  salvarCarrinho();
  atualizarCarrinhoUI();
  alert(`${produto.nome} adicionado ao carrinho!`);
}

function limparCarrinho() {
  carrinho = [];
  salvarCarrinho();
  atualizarCarrinhoUI();
}

// ====================== RENDERIZAÇÃO DE PRODUTOS ======================
function renderizarProdutos(produtosArray, containerId) {
  const container = document.getElementById(containerId);
  if(!container) return;
  
  if(produtosArray.length === 0) {
    container.innerHTML = '<p style="text-align:center">Nenhum produto encontrado.</p>';
    return;
  }
  
  container.innerHTML = produtosArray.map(prod => `
    <div class="product-card">
      <img class="product-img" src="${prod.imagem}" alt="${prod.nome}">
      <div class="product-info">
        <h3 class="product-title">${prod.nome}</h3>
        <div class="product-price">R$ ${prod.preco.toFixed(2)}</div>
        <button class="buy-btn" data-id="${prod.id}" data-nome="${prod.nome}" data-preco="${prod.preco}">Comprar</button>
      </div>
    </div>
  `).join('');
  
  document.querySelectorAll(`#${containerId} .buy-btn`).forEach(btn => {
    btn.addEventListener('click', () => {
      adicionarAoCarrinho({
        id: parseInt(btn.dataset.id),
        nome: btn.dataset.nome,
        preco: parseFloat(btn.dataset.preco)
      });
    });
  });
}

// ====================== FUNÇÕES ESPECÍFICAS POR PÁGINA ======================
function carregarDestaquesHome() {
  const destaques = produtos.filter(p => p.destaque === true);
  renderizarProdutos(destaques, 'destaquesGrid');
}

let filtroAtual = 'todos';
function carregarTodosProdutos() {
  renderizarProdutos(produtos, 'produtosGrid');
}

function filtrarErenderizarProdutos() {
  let produtosFiltrados = produtos;
  if(filtroAtual !== 'todos') {
    produtosFiltrados = produtos.filter(p => p.categoria === filtroAtual);
  }
  renderizarProdutos(produtosFiltrados, 'produtosGrid');
}

function inicializarFiltros() {
  const btns = document.querySelectorAll('.filter-btn');
  if(btns.length === 0) return;
  
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filtroAtual = btn.dataset.cat;
      filtrarErenderizarProdutos();
    });
  });
}

// ====================== CONTATO E VALIDAÇÃO ======================
function inicializarContato() {
  const form = document.getElementById('contactForm');
  if(!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const msgError = document.getElementById('msgError');
    const feedback = document.getElementById('formFeedback');
    
    nameError.innerText = '';
    emailError.innerText = '';
    msgError.innerText = '';
    
    if(name.value.trim() === '') {
      nameError.innerText = 'Nome é obrigatório.';
      valid = false;
    }
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if(email.value.trim() === '') {
      emailError.innerText = 'E-mail obrigatório.';
      valid = false;
    } else if(!emailRegex.test(email.value.trim())) {
      emailError.innerText = 'E-mail inválido.';
      valid = false;
    }
    if(message.value.trim() === '') {
      msgError.innerText = 'Mensagem não pode estar vazia.';
      valid = false;
    }
    
    if(valid) {
      feedback.innerHTML = '<span style="color:#7d9e6e">✓ Mensagem enviada com sucesso! Em breve retornamos.</span>';
      form.reset();
      setTimeout(() => feedback.innerHTML = '', 3000);
    } else {
      feedback.innerHTML = '<span style="color:#e67e22">⚠️ Preencha corretamente os campos.</span>';
    }
  });
  
  const whatsLink = document.getElementById('whatsappLink');
  const instaLink = document.getElementById('instagramLink');
  if(whatsLink) whatsLink.addEventListener('click', (e) => { e.preventDefault(); alert("WhatsApp: (11) 91234-5678"); });
  if(instaLink) instaLink.addEventListener('click', (e) => { e.preventDefault(); alert("Instagram: @liriodosvales"); });
}

// ====================== MENU RESPONSIVO E MODAL ======================
function initMenuEModal() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  if(hamburger) {
    hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));
  }
  
  const modal = document.getElementById('cartModal');
  const cartBtn = document.getElementById('cartIconBtn');
  const closeModal = document.querySelector('.close-cart');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const clearBtn = document.getElementById('clearCartBtn');
  
  if(cartBtn) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if(modal) modal.style.display = 'flex';
      atualizarCarrinhoUI();
    });
  }
  if(closeModal) closeModal.addEventListener('click', () => modal.style.display = 'none');
  if(closeCartBtn) closeCartBtn.addEventListener('click', () => modal.style.display = 'none');
  if(clearBtn) clearBtn.addEventListener('click', () => { limparCarrinho(); atualizarCarrinhoUI(); });
  window.addEventListener('click', (e) => { if(e.target === modal) modal.style.display = 'none'; });
}

// ====================== INICIALIZAÇÃO GLOBAL ======================
document.addEventListener('DOMContentLoaded', () => {
  initMenuEModal();
  atualizarCarrinhoUI();
});