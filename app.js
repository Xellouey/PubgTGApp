// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Настройка приложения
tg.ready();
tg.expand();

// Константы
const ADMIN_PASSWORD = 'admin123'; // Пароль админа
const STORAGE_KEY = 'pubg_products';

// Состояние приложения
let isAdmin = false;
let products = [];

// Элементы DOM
const productsContainer = document.getElementById('products-container');
const adminBtn = document.getElementById('admin-btn');
const adminAuthModal = document.getElementById('admin-auth-modal');
const addProductModal = document.getElementById('add-product-modal');
const adminPanel = document.getElementById('admin-panel');
const adminPassword = document.getElementById('admin-password');
const authSubmit = document.getElementById('auth-submit');
const addProductBtn = document.getElementById('add-product-btn');
const logoutBtn = document.getElementById('logout-btn');
const productForm = document.getElementById('product-form');
const imagePreview = document.getElementById('image-preview');
const productImage = document.getElementById('product-image');

// Загрузка товаров из localStorage
function loadProducts() {
    const saved = localStorage.getItem(STORAGE_KEY);
    products = saved ? JSON.parse(saved) : [];
    renderProducts();
}

// Сохранение товаров в localStorage
function saveProducts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Отображение товаров
function renderProducts() {
    if (products.length === 0) {
        productsContainer.innerHTML = `
            <div class="empty-state">
                <h2>Магазин пуст</h2>
                <p>Товары появятся здесь после добавления администратором</p>
            </div>
        `;
        return;
    }

    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            ${product.image ? `<img src="${product.image}" alt="${product.name}" class="product-image">` : '<div class="product-image"></div>'}
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price} ₽</div>
                <div class="product-description">${product.description}</div>
                <button class="buy-btn" onclick="buyProduct(${product.id})">Купить</button>
                ${isAdmin ? `<button class="btn btn-secondary" style="margin-top: 8px; width: 100%; padding: 4px; font-size: 11px;" onclick="deleteProduct(${product.id})">Удалить</button>` : ''}
            </div>
        </div>
    `).join('');
}

// Покупка товара
function buyProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Отправляем данные товара боту
    const purchaseData = {
        action: 'buy_product',
        product: {
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description
        },
        user_id: tg.initDataUnsafe?.user?.id,
        timestamp: Date.now()
    };

    tg.sendData(JSON.stringify(purchaseData));
    tg.showAlert(`Запрос на покупку "${product.name}" отправлен!`);
}

// Удаление товара (только для админа)
function deleteProduct(productId) {
    if (!isAdmin) return;
    
    products = products.filter(p => p.id !== productId);
    saveProducts();
    renderProducts();
}

// Модальные окна
function openModal(modal) {
    modal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

// Авторизация админа
adminBtn.addEventListener('click', () => {
    if (isAdmin) {
        // Если уже админ, показываем панель
        adminPanel.classList.toggle('hidden');
    } else {
        // Если не админ, показываем форму авторизации
        openModal(adminAuthModal);
    }
});

authSubmit.addEventListener('click', () => {
    if (adminPassword.value === ADMIN_PASSWORD) {
        isAdmin = true;
        adminBtn.style.opacity = '1';
        adminPanel.classList.remove('hidden');
        closeModal(adminAuthModal);
        adminPassword.value = '';
        renderProducts(); // Перерисовываем с кнопками удаления
        tg.showAlert('Добро пожаловать, администратор!');
    } else {
        tg.showAlert('Неверный пароль!');
    }
});

// Выход из админки
logoutBtn.addEventListener('click', () => {
    isAdmin = false;
    adminBtn.style.opacity = '0.3';
    adminPanel.classList.add('hidden');
    renderProducts(); // Перерисовываем без кнопок удаления
});

// Добавление товара
addProductBtn.addEventListener('click', () => {
    openModal(addProductModal);
});

// Превью изображения
productImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.innerHTML = '';
    }
});

// Отправка формы добавления товара
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const description = document.getElementById('product-description').value;
    const imageFile = productImage.files[0];

    const product = {
        id: Date.now(),
        name,
        price: parseFloat(price),
        description,
        image: null
    };

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            product.image = e.target.result;
            products.push(product);
            saveProducts();
            renderProducts();
            closeModal(addProductModal);
            productForm.reset();
            imagePreview.innerHTML = '';
        };
        reader.readAsDataURL(imageFile);
    } else {
        products.push(product);
        saveProducts();
        renderProducts();
        closeModal(addProductModal);
        productForm.reset();
    }
});

// Закрытие модальных окон
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        closeModal(modal);
    });
});

document.getElementById('cancel-add').addEventListener('click', () => {
    closeModal(addProductModal);
    productForm.reset();
    imagePreview.innerHTML = '';
});

// Закрытие модальных окон по клику вне их
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

// Настройка цветовой схемы
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.backgroundColor = tg.themeParams.bg_color || '#ffffff';
    document.body.style.color = tg.themeParams.text_color || '#000000';
    
    loadProducts();
});

// Обработка ошибок
window.addEventListener('error', (event) => {
    console.error('Ошибка в приложении:', event.error);
    tg.showAlert('Произошла ошибка в приложении');
});