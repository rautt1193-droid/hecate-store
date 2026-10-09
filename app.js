const SUPABASE_URL = 'ВСТАВЬТЕ_СЮДА_ВАШ_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'ВСТАВЬТЕ_СЮДА_ВАШ_SUPABASE_KEY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const products = [
    { id: 1, name: "Свеча Черной Луны", category: "candles", price: 890, description: "Ручная работа из натурального воска", emoji: "🕯️" },
    { id: 2, name: "Полынь священная", category: "herbs", price: 450, description: "Сушеная полынь для очищения", emoji: "🌿" },
    { id: 3, name: "Амулет Тройной Луны", category: "amulets", price: 2500, description: "Серебряный амулет с символом Гекаты", emoji: "🌙" },
    { id: 4, name: "Свеча Перекрестка", category: "candles", price: 950, description: "Тройная свеча для работы на перекрестках", emoji: "🕯️" },
    { id: 5, name: "Лаванда магическая", category: "herbs", price: 380, description: "Сушеная лаванда для спокойствия", emoji: "💜" },
    { id: 6, name: "Ключ Гекаты", category: "amulets", price: 1800, description: "Бронзовый ключ-талисман", emoji: "🗝️" }
];

let cart = [];
let currentProduct = null;
let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();
    updateCart();
});

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const filtered = currentCategory === 'all' ? products : products.filter(p => p.category === currentCategory);
    grid.innerHTML = filtered.map(p => `
        <div class="product-card" data-id="${p.id}">
            <div class="product-image">${p.emoji}</div>
            <div class="product-info">
                <h3 class="product-name">${p.name}</h3>
                <p class="product-description">${p.description}</p>
                <div class="product-price">${p.price} ₽</div>
            </div>
        </div>
    `).join('');
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => openProductModal(parseInt(card.dataset.id)));
    });
}

function setupEventListeners() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderProducts();
        });
    });
    document.getElementById('cartFloat').addEventListener('click', () => document.getElementById('cartModal').classList.add('active'));
    document.getElementById('closeCart').addEventListener('click', () => document.getElementById('cartModal').classList.remove('active'));
    document.getElementById('closeProduct').addEventListener('click', () => document.getElementById('productModal').classList.remove('active'));
    document.getElementById('addToCartBtn').addEventListener('click', addToCart);
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
}

function openProductModal(id) {
    currentProduct = products.find(p => p.id === id);
    document.getElementById('productImage').textContent = currentProduct.emoji;
    document.getElementById('productName').textContent = currentProduct.name;
    document.getElementById('productDescription').textContent = currentProduct.description;
    document.getElementById('productPrice').textContent = `${currentProduct.price} ₽`;
    document.getElementById('productModal').classList.add('active');
}

function addToCart() {
    const existing = cart.find(i => i.id === currentProduct.id);
    if (existing) existing.quantity++;
    else cart.push({ ...currentProduct, quantity: 1 });
    updateCart();
    document.getElementById('productModal').classList.remove('active');
}

function updateCart() {
    document.getElementById('cartCount').textContent = cart.reduce((s, i) => s + i.quantity, 0);
    document.getElementById('cartItems').innerHTML = cart.map(i => `
        <div class="cart-item">
            <div>
                <div class="cart-item-name">${i.name}</div>
                <div class="cart-item-price">${i.price} ₽ × ${i.quantity}</div>
            </div>
        </div>
    `).join('');
    document.getElementById('cartTotal').textContent = `${cart.reduce((s, i) => s + i.price * i.quantity, 0)} ₽`;
}

async function checkout() {
    if (cart.length === 0) { alert('Корзина пуста!'); return; }
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    try {
        const { error } = await supabase.from('orders').insert({
            user_id: window.WebApp?.initDataUnsafe?.user?.id || null,
            user_name: window.WebApp?.initDataUnsafe?.user?.first_name || 'Гость',
            total_amount: total,
            items: cart,
            status: 'Новый'
        });
        if (error) throw error;
        alert(`✨ Заказ оформлен!\nСумма: ${total} ₽`);
        cart = [];
        updateCart();
        document.getElementById('cartModal').classList.remove('active');
    } catch (e) {
        alert('Ошибка при оформлении заказа');
        console.error(e);
    }
}
