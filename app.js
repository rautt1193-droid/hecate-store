const SUPABASE_URL = 'https://toydvkvhtrjwhhjuabos.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRveWR2a3ZodHJqd2hoanVhYm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1MzQ1NjIsImV4cCI6MjEwNzExMDU2Mn0.P3q6kEjSvvgpVYaCFEuloyj_MIOufmSS0NCUyHz5_0E';

// ВАЖНО: переименовали supabase → sb, чтобы не конфликтовать с библиотекой
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const products = [
    { 
        id: 1, 
        name: "Золотая Жила", 
        category: "oils", 
        price: 3333, 
        short_desc: "Алхимический ключ к потокам изобилия.",
        full_desc: "«Золотая Жила» — это настоящий алхимический ключ к потокам изобилия и удачи. Энергия масла: - Притягивает ресурсы и клиентов, закрепляет их в вашем поле. - Создаёт мощную защиту от потерь, зависти и энергетических атак. - Убирает внутренние блоки и внешние преграды на пути к богатству.
- Усиливает уверенность, трудолюбие и личное обаяние.
- Активирует потоки удачи, ускоряет исполнение намерений.

Это масло работает как «магнит процветания»: оно помогает не только привлечь финансовые возможности, но и сохранить их, направив энергию в нужное русло. «Золотая Жила» гармонично соединяет силу притяжения и мудрость сохранения, чтобы вы могли шаг за шагом выстраивать свой путь к изобилию и успеху.
.",
        image: "images/oil1.jpg"
    },
    { 
        id: 2, 
        name: "Денежная Берегиня", 
        category: "ritual_candles", 
        price: 3777, 
        short_desc: "Свеча-обряд для изобилия и процветания.", 
        full_desc: "Свеча-обряд для изобилия, процветания и финансовой удачи. Время горения: 4 часа.", 
        image: "images/candle1.jpg" 
    }
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
    if (!grid) return;

    const filtered = currentCategory === 'all' ? products : products.filter(p => p.category === currentCategory);

    grid.innerHTML = filtered.map(p => `
        <div class="product-card" data-id="${p.id}">
            <div class="product-image">
                <img src="${p.image}" alt="${p.name}" class="card-img" 
                     onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'color:#ff6b6b;text-align:center;padding:20px;font-weight:bold;\\'>⚠️ Нет фото:<br>${p.image}</div>'">
            </div>
            <div class="product-info">
                <h3 class="product-name">${p.name}</h3>
                <p class="product-description">${p.short_desc}</p>
                <div class="product-price">${p.price.toLocaleString('ru-RU')} ₽</div>
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
    
    document.getElementById('cartModal').addEventListener('click', (e) => {
        if (e.target.id === 'cartModal') document.getElementById('cartModal').classList.remove('active');
    });
    document.getElementById('productModal').addEventListener('click', (e) => {
        if (e.target.id === 'productModal') document.getElementById('productModal').classList.remove('active');
    });
}

function openProductModal(id) {
    currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;
    
    document.getElementById('productImage').innerHTML = `<img src="${currentProduct.image}" alt="${currentProduct.name}" class="modal-img" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>📦</text></svg>'">`;
    document.getElementById('productName').textContent = currentProduct.name;
    document.getElementById('productDescription').textContent = currentProduct.full_desc; 
    document.getElementById('productPrice').textContent = `${currentProduct.price.toLocaleString('ru-RU')} ₽`;
    document.getElementById('productModal').classList.add('active');
}

function addToCart() {
    if (!currentProduct) return;
    const existing = cart.find(i => i.id === currentProduct.id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...currentProduct, quantity: 1 });
    }
    updateCart();
    document.getElementById('productModal').classList.remove('active');
}

function updateCart() {
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    document.getElementById('cartCount').textContent = count;
    
    document.getElementById('cartItems').innerHTML = cart.map(i => `
        <div class="cart-item">
            <div>
                <div class="cart-item-name">${i.name}</div>
                <div class="cart-item-price">${i.price.toLocaleString('ru-RU')} ₽ × ${i.quantity}</div>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    document.getElementById('cartTotal').textContent = `${total.toLocaleString('ru-RU')} ₽`;
}

async function checkout() {
    if (cart.length === 0) { alert('Корзина пуста!'); return; }
    
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const btn = document.getElementById('checkoutBtn');
    const originalText = btn.textContent;
    
    btn.textContent = 'Оформляем...';
    btn.disabled = true;

    try {
        // ВАЖНО: здесь тоже заменили supabase → sb
        const { error } = await sb.from('orders').insert({
            user_id: window.WebApp?.initDataUnsafe?.user?.id || null,
            user_name: window.WebApp?.initDataUnsafe?.user?.first_name || 'Гость',
            total_amount: total,
            items: cart,
            status: 'Новый'
        });
        
        if (error) throw error;
        
        alert(`✨ Благодарим! Ваш заказ на сумму ${total.toLocaleString('ru-RU')} ₽ принят.`);
        cart = [];
        updateCart();
        document.getElementById('cartModal').classList.remove('active');
        
    } catch (e) {
        console.error('Ошибка заказа:', e);
        alert('Произошла ошибка при отправке заказа.');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}
