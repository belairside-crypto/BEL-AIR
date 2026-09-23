const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

let cart = [];
let currentProduct = null;

window.addEventListener('load', () => {
  setTimeout(() => {
    $('#loader').classList.add('done');
    document.body.classList.add('loaded');
  }, 850);
});

// Smooth navigation with a little tactile feedback
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href');
  const target = $(id);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({behavior:'smooth', block:'start'});
    $('#mobileMenu').classList.remove('open');
  }
}));

// Mobile menu
$('#menuToggle').addEventListener('click', () => $('#mobileMenu').classList.toggle('open'));

// Cart
const drawer = $('#cartDrawer');
const backdrop = $('#drawerBackdrop');
function openCart(){
  drawer.classList.add('open'); backdrop.classList.add('show');
  drawer.setAttribute('aria-hidden','false'); document.body.classList.add('lock');
}
function closeCart(){
  drawer.classList.remove('open'); backdrop.classList.remove('show');
  drawer.setAttribute('aria-hidden','true'); document.body.classList.remove('lock');
}
$('#openCart').addEventListener('click', openCart);
$('#mobileCart').addEventListener('click', () => { $('#mobileMenu').classList.remove('open'); openCart(); });
$('#closeCart').addEventListener('click', closeCart);
backdrop.addEventListener('click', closeCart);

function money(n){ return '$' + n.toLocaleString('es-CO'); }
function priceNumber(price){ return Number(price.replace(/[^\d]/g,'')); }

function renderCart(){
  const body = $('#cartBody');
  const count = $('#cartCount');
  const total = $('#cartTotal');
  count.textContent = `(${cart.length})`;
  $('#mobileCart span').textContent = `(${cart.length})`;
  if (!cart.length){
    body.innerHTML = '<p class="empty">Tu selección está vacía.</p>';
    total.textContent = '$0';
    return;
  }
  body.innerHTML = cart.map((item,i) => `
    <div class="cart-item">
      <div><strong>${item.name}</strong><br><small>Edición limitada · ${item.price}</small></div>
      <button data-remove="${i}" style="background:none;border:0;color:#777">×</button>
    </div>`).join('');
  const sum = cart.reduce((a,b)=>a+priceNumber(b.price),0);
  total.textContent = money(sum);
  $$('[data-remove]', body).forEach(btn => btn.addEventListener('click', () => {
    cart.splice(Number(btn.dataset.remove),1); renderCart();
  }));
}

$$('.add-cart').forEach(btn => btn.addEventListener('click', () => {
  const card = btn.closest('.product-card');
  cart.push({name:card.dataset.product, price:card.dataset.price});
  renderCart(); openCart();
}));

// Quick view modal
const modal = $('#productModal');
function openModal(card){
  currentProduct = {name:card.dataset.product, price:card.dataset.price};
  $('#modalTitle').textContent = currentProduct.name;
  $('#modalPrice').textContent = currentProduct.price;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
}
function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
$$('.quick-view').forEach(btn => btn.addEventListener('click', () => openModal(btn.closest('.product-card'))));
$('#modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
$('#modalAdd').addEventListener('click', () => {
  cart.push(currentProduct); renderCart(); closeModal(); openCart();
});

// Newsletter
$('#newsletterForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = $('#email').value.trim();
  $('#formMessage').textContent = `ACCESO SOLICITADO · ${email}`;
  e.target.reset();
});

// Lookbook button — functional demo
$('#lookbookBtn').addEventListener('click', () => {
  const el = $('#collection');
  el.scrollIntoView({behavior:'smooth'});
});

// Escape key
window.addEventListener('keydown', e => {
  if(e.key === 'Escape'){ closeCart(); closeModal(); }
});

// Subtle parallax on hero
window.addEventListener('scroll', () => {
  const hero = $('.hero-image');
  if(!hero) return;
  const y = Math.min(window.scrollY * .08, 80);
  hero.style.transform = `scale(1.01) translateY(${y}px)`;
}, {passive:true});
