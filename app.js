const SUPABASE_URL = 'https://toydvkvhtrjwhhjuabos.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRveWR2a3ZodHJqd2hoanVhYm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1MzQ1NjIsImV4cCI6MjEwNzExMDU2Mn0.P3q6kEjSvvgpVYaCFEuloyj_MIOufmSS0NCUyHz5_0E';
// ВСТАВЬТЕ СЮДА ВАШИ ДАННЫЕ ИЗ SUPABASE (Шаг 2.3 инструкции)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Товары по 7 разделам
const products = [
    // 1. Магические масла
    { id: 1, name: "Золотая Жила", category: "oils", price: 3333, description: "Алхимический ключ к потокам изобилия. Пробуждает денежную энергию и усиливает харизму.", emoji: "🧴" },
    { id: 2, name: "Эликсир Женственности", category: "oils", price: 3333, description: "Пробуждает внутреннюю богиню, мягкость и притягательность на глубинном уровне.", emoji: "🧴" },
    { id: 3, name: "Дорога Возможностей", category: "oils", price: 2999, description: "Очищает путь, привлекает удачные обстоятельства и помогает быстро проявлять задуманное.", emoji: "🧴" },
    
    // 2. Обрядовые свечи
    { id: 4, name: "Денежная Берегиня", category: "ritual_candles", price: 3777, description: "Свеча-обряд для изобилия. Открывает денежные потоки и привлекает стабильный доход.", emoji: "🕯️" },
    { id: 5, name: "Семейное Счастье", category: "ritual_candles", price: 3333, description: "Для укрепления гармонии и любви в доме. Наполняет пространство теплом и взаимопониманием.", emoji: "🕯️" },
    
    // 3. Программные свечи
    { id: 6, name: "Богиня Здоровья", category: "program_candles", price: 3333, description: "Целительный инструмент для восполнения жизненной силы и внутренней гармонии.", emoji: "🕯️" },
    { id: 7, name: "Исцеление Отношений", category: "program_candles", price: 6666, description: "Снимает негативную энергию и блокады. Очищает пространство от старых обид и ревности.", emoji: "🕯️" },
    
    // 4. Ведьмина ванна
    { id: 8, name: "Мыло «Очищение»", category: "witch_bath", price: 888, description: "Массажное мыло с кофе, кокосовым маслом и люфой для очищения энергии и тела.", emoji: "🧼" },
    { id: 9, name: "Скраб «Очищение Духа»", category: "witch_bath", price: 2222, description: "Сакральный ритуал ухода. Очищает не только кожу, но и внутреннее пространство.", emoji: "🧂" },
    
    // 5. Обереги, амулеты
    { id: 10, name: "Автопарфюм Оберег", category: "amulets", price: 1888, description: "Защищает автомобиль и пассажиров от негативных ситуаций и усталости в пути.", emoji: "📿" },
    { id: 11, name: "Лунный Амулет", category: "amulets", price: 2500, description: "Серебряный амулет с символом Гекаты для защиты и обретения мудрости.", emoji: "🌙" },
    
    // 6. Ограниченные коллекции
    { id: 12, name: "Троица Берегинь", category: "limited", price: 9999, description: "Священный союз женских сил: защита, любовь и изобилие в одном обрядовом комплексе.", emoji: "✨" },
    
    // 7. Алтари, шкатулки, монетницы
    { id: 13, name: "Шкатулка Силы", category: "altars", price: 4500, description: "Резная деревянная шкатулка из дуба для хранения магических инструментов и трав.", emoji: "🗃️" },
    { id: 14, name: "Монетница Изобилия", category: "altars", price: 1500, description: "Латунная монетница с гравировкой рун для привлечения и удержания финансов.", emoji: "🪙" }
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
    
    // Закрытие по клику вне модального окна
    document.getElementById('cartModal').addEventListener('click', (e) => {
        if (e.target.id === 'cartModal') document.getElementById('cartModal').classList.remove('active');
    });
    document.getElementById('productModal').addEventListener('click', (e) => {
        if (e.target.id === 'productModal') document.getElementById('productModal').classList.remove('active');
    });
}

function openProductModal(id) {
    currentProduct = products.find(p => p.id === id);
    document.getElementById('productImage').textContent = currentProduct.emoji;
    document.getElementById('productName').textContent = currentProduct.name;
    document.getElementById('productDescription').textContent = currentProduct.description;
    document.getElementById('productPrice').textContent = `${currentProduct.price.toLocaleString('ru-RU')} ₽`;
    document.getElementById('productModal').classList.add('active');
}

function addToCart() {
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
        const { error } = await supabase.from('orders').insert({
            user_id: window.WebApp?.initDataUnsafe?.user?.id || null,
            user_name: window.WebApp?.initDataUnsafe?.user?.first_name || 'Гость',
            total_amount: total,
            items: cart,
            status: 'Новый'
        });
        
        if (error) throw error;
        
        alert(`✨ Благодарим! Ваш заказ на сумму ${total.toLocaleString('ru-RU')} ₽ принят.\nМы свяжемся с вами для подтверждения.`);
        cart = [];
        updateCart();
        document.getElementById('cartModal').classList.remove('active');
        
    } catch (e) {
        console.error('Ошибка заказа:', e);
        alert('Произошла ошибка при отправке заказа. Пожалуйста, попробуйте позже или напишите нам напрямую.');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}
