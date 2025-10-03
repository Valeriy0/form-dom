# Инструкция по исправлению CORS проблемы

## Проблема
При отправке формы возникает ошибка CORS:
```
Access to fetch at 'https://script.google.com/macros/s/...' from origin 'https://form-dom.vercel.app' has been blocked by CORS policy
```

## Решение

### Шаг 1: Обновить Google Apps Script код

1. **Откройте ваш Google Apps Script проект**
2. **Замените весь код** на код из файла `google-apps-script-code.js`
3. **Сохраните проект** (Ctrl+S или Cmd+S)
4. **Переразверните веб-приложение:**
   - Нажмите "Развернуть" → "Управление развертываниями"
   - Нажмите на иконку "Редактировать" (карандаш)
   - Нажмите "Развернуть"

### Шаг 2: Код React уже обновлен

Код в `src/App.js` уже обновлен для работы с CORS:
- Добавлен `mode: 'no-cors'`
- Изменен способ отправки данных с JSON на FormData
- Улучшена обработка ошибок

### Шаг 3: Тестирование

1. **Запустите приложение локально:**
   ```bash
   npm start
   ```

2. **Заполните форму** и отправьте

3. **Проверьте Google Таблицу** - данные должны появиться

4. **Если все работает локально, задеплойте на Vercel:**
   ```bash
   git add .
   git commit -m "Fix CORS issue"
   git push origin main
   ```

## Альтернативные решения

### Если проблема все еще есть:

#### Вариант 1: Использовать Google Forms вместо Google Sheets
1. Создайте Google Form
2. Получите Entry IDs
3. Используйте код из `GOOGLE_FORMS_SETUP.md`

#### Вариант 2: Создать прокси-сервер
Создайте простой сервер на Vercel для проксирования запросов:

```javascript
// api/submit.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit form' });
  }
}
```

#### Вариант 3: Использовать Netlify Forms
Если вы используете Netlify, можно использовать встроенные формы:

```html
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  <!-- поля формы -->
</form>
```

## Проверка работы

### Локально:
1. Откройте DevTools (F12)
2. Перейдите на вкладку Network
3. Отправьте форму
4. Проверьте, что запрос отправляется без ошибок

### На продакшене:
1. Откройте сайт на Vercel
2. Отправьте тестовую форму
3. Проверьте Google Таблицу на наличие данных

## Дополнительные улучшения

### Добавить индикатор загрузки:
```javascript
const [isSubmitting, setIsSubmitting] = useState(false);

// В handleSubmit:
setIsSubmitting(true);
// ... отправка данных
setIsSubmitting(false);
```

### Добавить валидацию на стороне сервера:
Код в Google Apps Script уже включает базовую валидацию.

### Добавить логирование:
```javascript
console.log('Отправляем данные:', dataToSend);
```

## Контакты для поддержки

Если проблема не решается:
1. Проверьте консоль браузера на ошибки
2. Убедитесь, что Google Apps Script развернут правильно
3. Проверьте права доступа к Google Таблице
