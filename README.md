# Платформа менторства по Go (Frontend – Student/Buddy)

Веб-интерфейс для студентов и наставников (buddy). Реализован на Next.js + TypeScript, Tailwind CSS и HeroUI.

## Запуск через Docker Compose

1. Склонируйте репозиторий и перейдите в папку проекта:

```bash

git clone https://github.com/kazantsev-developer/mentorship-frontend-main.git
cd mentorship-frontend-main
Передайте адрес бэкенда при сборке (или создайте .env.local):

docker-compose build --build-arg NEXT_PUBLIC_API_URL=http://185.75.189.130:8080
docker-compose up -d
Фронтенд будет доступен по адресу http://localhost:3000.

Локальная разработка
npm install
npm run dev

Демо-аккаунты
Роль	Логин	Пароль
Студент	test_student	123
Бадди	test_buddy	123
Админ	admin	123


Технологии
Next.js 14 (App Router, клиентские компоненты)
TypeScript
Tailwind CSS + CSS-переменные (тёмная/светлая тема)
HeroUI (Card, Button, Modal, Progress, Chip, Avatar)
Framer Motion (анимации карточек материалов)
Iconify (иконки)
Sonner (toast-уведомления)
next-themes (переключение тем)

Основные возможности

Для студента
Roadmap с блоками (теория, вопросы, практика, домашка)
Карточки материалов с preview (URL, YouTube, GitHub)
Отметка материалов (обязательные и optional)
Прогресс по блокам и общий прогресс
Система достижений (14 типов, автоматическая выдача)
Бонусная экономика (история операций, конвертация в скидку до 15%)
Mock- и real-собеседования
Заявки на 1x1 с ментором
Календарь событий
Публичный профиль с настройкой приватности

Для наставника (buddy)
Список закреплённых учеников (прогресс, статус, дни неактивности)
Детальный просмотр прогресса ученика
Подтверждение закрытия блоков
Создание и завершение mock-собеседований
Фидбэк по собеседованиям
Календарь событий (создание/редактирование)

Авторизация
Токен сохраняется в localStorage и в cookies.
При запросах автоматически подставляется Authorization: Bearer <token>.
Если пользователь имеет несколько ролей – сначала показывает экран выбора роли. Выбранная роль сохраняется между сессиями.

Проверка работы API
После запуска бэкенда выполните:

curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"login":"test_buddy","password":"123"}'

```
