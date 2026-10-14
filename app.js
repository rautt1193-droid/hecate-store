const SUPABASE_URL = 'https://toydvkvhtrjwhhjuabos.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRveWR2a3ZodHJqd2hoanVhYm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1MzQ1NjIsImV4cCI6MjEwNzExMDU2Mn0.P3q6kEjSvvgpVYaCFEuloyj_MIOufmSS0NCUyHz5_0E';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const products = [
{ 
    id: 1, 
    name: "Золотая Жила", 
    category: "oils", 
    price: 3333, 
    short_desc: "Это настоящий алхимический ключ к потокам изобилия и удачи. Оно пробуждает денежную энергию, усиливает харизму и открывает скрытые возможности, помогая соединиться с вибрациями процветания и успеха.",
    full_desc: "Энергия масла:\n• Притягивает ресурсы и клиентов, закрепляет их в вашем поле.\n• Создаёт мощную защиту от потерь, зависти и энергетических атак.\n• Убирает внутренние блоки и внешние преграды на пути к богатству.\n• Усиливает уверенность, трудолюбие и личное обаяние.\n• Активирует потоки удачи, ускоряет исполнение намерений.\n\nЭто масло работает как «магнит процветания»: оно помогает не только привлечь финансовые возможности, но и сохранить их, направив энергию в нужное русло. «Золотая Жила» гармонично соединяет силу притяжения и мудрость сохранения, чтобы вы могли шаг за шагом выстраивать свой путь к изобилию и успеху.",
    image: "images/oil1.jpg"
},
       { 
        id: 2, 
        name: "Пробуждение Силы", 
        category: "oils", 
        price: 5555, 
        short_desc: "Алхимический ключ к тонким мирам. Пробуждает интуицию, раскрывает ясновидение и активирует каналы восприятия.",
        full_desc: "Аромат и вибрация этого состава соединяют светлые и тёмные потоки, создавая магический баланс. Оно несёт в себе глубину трансформации, лёгкость обновления, позволяя мягко, но мощно войти в контакт с собственной внутренней силой.\n\nЭнергетические качества:\n• Активация скрытых способностей\n• Защита при работе с тонкими энергиями\n• Усиление видений, снов и символов\n• Связь с архетипами силы и обновление\n\nПодходит для ритуалов ясновидения, шаманских путешествий, астральных практик, медитаций и магической работы с энергией.\n\nЭто масло — прикосновение к живой энергии, которое требует уважения и осознанности. Оно способно открыть врата вглубь себя и в тонкие миры, если вы готовы к встрече с собственной силой.",
        image: "images/oil2.jpg" 
    },
    { 
        id: 3, 
        name: "Сила Предков", 
        category: "oils", 
        price: 5555, 
        short_desc: "Это масло соткано как многослойный оберег, соединяющий с корнями рода. Несёт защиту, очищение и поддержку, помогая провести силу предков «от корней к вершинам».",
        full_desc: "Энергия Масла работает сразу в нескольких направлениях:\n• Очищает родовую линию от тяжёлых влияний\n• Закрепляет защиту и опору, а также раскрывает дары и таланты, передающиеся через поколения\n• Состав действует как проводник между земным и небесным, соединяя память предков с духовной мудростью\n\nЭнергетические качества:\n• Очищение от негативных родовых программ\n• Укрепление корневой и духовной линии рода\n• Защита и закрепление благословения\n• Раскрытие скрытых даров и талантов\n\nПодходит для практик укрепления рода, медитаций на связь с предками, работы с родовой силой и защиты семейного пространства. Оно не только открывает доступ к энергии предков, но и закрепляет результат, создавая прочную сакральную печать.",
        image: "images/oil3.jpg" 
    },
        { 
        id: 4, 
        name: "Дорога Возможностей", 
        category: "oils", 
        price: 2999, 
        short_desc: "Магический проводник, очищающий путь и привлекающий удачные обстоятельства. Убирает блоки, открывает новые дороги и закрепляет результаты.",
        full_desc: "Энергия масла:\n• Снимает ментальные, эмоциональные и энергетические препятствия, освобождая пространство для новых возможностей\n• Притягивает благоприятные события, нужных людей и ресурсы, создавая поток удачи\n• Усиливает уверенность, внутреннюю силу и целеустремлённость\n• Направляет действия осознанно, ускоряет достижение целей и закрепляет результаты\n• Создаёт защитный и гармонизирующий энергетический фон для безопасного движения вперёд\n\nЭто масло работает как «Проводник Судьбы»: оно ведёт через новые врата, открывает двери возможностей и помогает шаг за шагом войти в нужный поток жизни.",
        image: "images/oil4.jpg" 
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
    
    document.getElementById('closeProduct').addEventListener('click', () => document.getElementById('productModal').classList.remove('active'));
    
    // ПРИВЯЗЫВАЕМ КНОПКУ ЗАКАЗА К ФУНКЦИИ
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

function orderProduct() {
    if (!currentProduct) return;
    
    const message = `Здравствуйте! Хочу заказать: ${currentProduct.name} (${currentProduct.price.toLocaleString('ru-RU')} ₽)`;
    
    sb.from('orders').insert({
        user_id: window.WebApp?.initDataUnsafe?.user?.id || null,
        user_name: window.WebApp?.initDataUnsafe?.user?.first_name || 'Гость',
        total_amount: currentProduct.price,
        items: [{ name: currentProduct.name, price: currentProduct.price, quantity: 1 }],
        status: 'Заявка через чат'
    }).then(({ error }) => {
        if (error) console.error('Не удалось сохранить заявку:', error);
    });
    
    // ВАША ССЫЛКА
    const directLink = `https://max.ru/u/f9LHodD0cOJiy6bwhmhT6m3z_BX4WkY_zuRrJipuoLdQ3j_nYN-G9lmEIDs?text=${encodeURIComponent(message)}`;
    
    if (window.WebApp && window.WebApp.openLink) {
        window.WebApp.openLink(directLink);
    } else {
        window.open(directLink, '_blank');
    }
    
    document.getElementById('productModal').classList.remove('active');
}
