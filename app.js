const SUPABASE_URL = 'https://toydvkvhtrjwhhjuabos.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRveWR2a3ZodHJqd2hoanVhYm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1MzQ1NjIsImV4cCI6MjEwNzExMDU2Mn0.P3q6kEjSvvgpVYaCFEuloyj_MIOufmSS0NCUyHz5_0E';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ⚠️ ЗАМЕНИТЕ на username вашего бота/аккаунта поддержки в MAX (без @)
const SUPPORT_BOT_USERNAME = 'hecate_support_bot';

const products = [
    { 
        id: 1, 
        name: "Золотая Жила", 
        category: "oils", 
        price: 3333, 
        short_desc: "Алхимический ключ к потокам изобилия.",
        full_desc: "«Золотая Жила» — это настоящий алхимический ключ к потокам изобилия и удачи. Объем: 10 мл.",
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

let currentProduct = null;
let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();
});

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const filtered = currentCategory === 'all' ? products : products.filter(p => p.category === currentCategory);

    grid.innerHTML = filtered.map(p => `
        <div class="product-card" data-id="${p.id}">
            <div class="product-image">
                <img src="${p.image}" alt="${p.name}" class="card-img" 
                     onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'color:#ff6b6b;text-align:center;padding:20px;font-weight:bold;\\'>️ Нет фото:<br>${p.image}</div>'">
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
    
    document.getElementById('closeProduct').addEventListener('click', () => document.getElementById('productModal').classList.remove('active'));
    document.getElementById('orderBtn').addEventListener('click', orderProduct);
    
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

// Главная функция — переход в чат поддержки с готовым сообщением
function orderProduct() {
    if (!currentProduct) return;
    
    // Формируем текст сообщения
    const message = `Здравствуйте! Хочу заказать: ${currentProduct.name} (${currentProduct.price.toLocaleString('ru-RU')} ₽)`;
    
    // Сохраняем заказ в Supabase (для вашей статистики)
    sb.from('orders').insert({
        user_id: window.WebApp?.initDataUnsafe?.user?.id || null,
        user_name: window.WebApp?.initDataUnsafe?.user?.first_name || 'Гость',
        total_amount: currentProduct.price,
        items: [{ name: currentProduct.name, price: currentProduct.price, quantity: 1 }],
        status: 'Заявка через чат'
    }).then(({ error }) => {
        if (error) console.error('Не удалось сохранить заявку:', error);
    });
    
    // Открываем чат с поддержкой в MAX через диплинк
    // Формат: https://max.ru/:share?text=... — открывает окно выбора чата
    const shareUrl = `https://max.ru/:share?text=${encodeURIComponent(message)}`;
    
    if (window.WebApp && window.WebApp.openLink) {
        window.WebApp.openLink(shareUrl);
    } else {
        window.open(shareUrl, '_blank');
    }
    
    document.getElementById('productModal').classList.remove('active');
}
