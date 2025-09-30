# 🚀 Static Deployment Guide for University Clubs

This version of the project is a pure front-end React application. All data is stored locally in the browser (`localStorage`), so you only need to host the static build output.

## 📦 Build Once

```bash
cd client
npm install
npm run build
```

The optimized static assets will appear in `client/build`.

## ☁️ Where to Host

Any static hosting service works:

- [Vercel](https://vercel.com)
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- Your own Nginx/Apache bucket

### Recommended settings

| Provider | Build Command | Output Directory | Root Directory |
|----------|---------------|------------------|----------------|
| Vercel   | `npm run build` | `build`         | `client`       |
| Netlify  | `npm run build` | `build`         | `client`       |
| GitHub Pages | `npm run build` | `build`   | `client`       |

No environment variables are required.

## 🔧 Local Smoke Test

Before deploying, you can serve the static build locally:

```bash
cd client
npm run build
npx serve -s build
```

Open the printed URL (default `http://localhost:3000`). All interactions (регистрация, создание клубов, вступление) work offline without any network calls to `/api`.

## 🔁 Обновление данных

- Чтобы сбросить демо, очистите `localStorage` в браузере.
- При выпуске новой версии достаточно повторно выполнить `npm run build` и загрузить содержимое `client/build` на выбранный хостинг.

## ✅ Check-list перед деплоем

- [ ] Выполнен `npm run build`
- [ ] В каталоге `client/build` появились файлы `index.html`, `static/...`
- [ ] Локальный запуск через `npx serve -s build` работает без ошибок и без запросов к `/api`
- [ ] Репозиторий обновлён и запушен (для автоматических деплоев)

Готово! После загрузки статической сборки приложение не требует серверной части и готово к работе.
