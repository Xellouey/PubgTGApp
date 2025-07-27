// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Настройка приложения
tg.ready();
tg.expand();

// Элементы DOM
const userDataElement = document.getElementById('user-data');
const mainButton = document.getElementById('main-button');
const closeButton = document.getElementById('close-app');

// Отображение информации о пользователе
function displayUserInfo() {
    const user = tg.initDataUnsafe?.user;
    
    if (user) {
        userDataElement.innerHTML = `
            <p><strong>Имя:</strong> ${user.first_name || 'Не указано'}</p>
            <p><strong>Фамилия:</strong> ${user.last_name || 'Не указано'}</p>
            <p><strong>Username:</strong> @${user.username || 'Не указано'}</p>
            <p><strong>ID:</strong> ${user.id}</p>
            <p><strong>Язык:</strong> ${user.language_code || 'Не указано'}</p>
        `;
    } else {
        userDataElement.innerHTML = '<p>Информация о пользователе недоступна</p>';
    }
}

// Обработчики событий
mainButton.addEventListener('click', () => {
    tg.showAlert('Главная кнопка нажата!');
    
    // Отправка данных обратно в бот
    tg.sendData(JSON.stringify({
        action: 'main_button_clicked',
        timestamp: Date.now(),
        user_id: tg.initDataUnsafe?.user?.id
    }));
});

closeButton.addEventListener('click', () => {
    tg.close();
});

// Настройка главной кнопки Telegram
tg.MainButton.text = 'Отправить данные';
tg.MainButton.show();

tg.MainButton.onClick(() => {
    const data = {
        action: 'telegram_main_button',
        user_data: tg.initDataUnsafe?.user,
        timestamp: Date.now()
    };
    
    tg.sendData(JSON.stringify(data));
});

// Обработка событий темы
tg.onEvent('themeChanged', () => {
    console.log('Тема изменена');
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    displayUserInfo();
    
    // Настройка цветовой схемы
    document.body.style.backgroundColor = tg.themeParams.bg_color || '#ffffff';
    document.body.style.color = tg.themeParams.text_color || '#000000';
});

// Обработка ошибок
window.addEventListener('error', (event) => {
    console.error('Ошибка в приложении:', event.error);
    tg.showAlert('Произошла ошибка в приложении');
});