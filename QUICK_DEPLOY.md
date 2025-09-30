# ⚡ Quick Deploy Guide — Static SPA

## 1. Подготовьте репозиторий
```bash
git add .
git commit -m "Prepare static frontend"
git push origin main
```

## 2. Соберите проект
```bash
cd client
npm install
npm run build
```

## 3. Выберите хостинг
- **Vercel**: импортируйте репозиторий, укажите root `client`, build `npm run build`, output `build`.
- **Netlify**: drag & drop содержимое `client/build` или настройте build команду `npm run build`.
- **GitHub Pages**: опубликуйте содержимое `client/build` на ветке `gh-pages`.

## 4. Быстрая проверка локально
```bash
cd client
npm run build
npx serve -s build
```
Если приложение открывается и не делает запросов к `/api`, всё готово к публикации.

## 5. Сброс демо (при необходимости)
Очистите `localStorage` в браузере, чтобы удалить тестовые аккаунты и клубы.

Готово! Вся логика работает на стороне клиента, поэтому дополнительных сервисов не требуется.
