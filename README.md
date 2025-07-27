# Telegram Mini App

Базовое приложение для Telegram Mini Apps с использованием Telegram Web App API.

## Возможности

- Отображение информации о пользователе
- Интеграция с Telegram Web App API
- Адаптивный дизайн
- Поддержка тем Telegram
- Отправка данных обратно в бот

## Установка

```bash
npm install
```

## Запуск в режиме разработки

```bash
npm run dev
```

## Сборка для продакшена

```bash
npm run build
```

## Настройка бота

Для работы с Mini App необходимо:

1. Создать бота через @BotFather
2. Настроить Menu Button или Inline Keyboard с web_app
3. Указать URL вашего приложения

Пример кода для бота:

```python
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo

# Создание кнопки с Mini App
keyboard = InlineKeyboardMarkup([
    [InlineKeyboardButton("Открыть приложение", web_app=WebAppInfo("https://your-app-url.com"))]
])
```

## Структура проекта

- `index.html` - основная HTML страница
- `app.js` - логика приложения и интеграция с Telegram API
- `style.css` - стили с поддержкой тем Telegram
- `vite.config.js` - конфигурация сборщика

## API Telegram Web App

Приложение использует следующие методы:
- `tg.ready()` - инициализация
- `tg.expand()` - развертывание на весь экран
- `tg.sendData()` - отправка данных боту
- `tg.close()` - закрытие приложения
- `tg.showAlert()` - показ уведомлений