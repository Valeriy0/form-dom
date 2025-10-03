# Инструкция по настройке Google Sheets для React формы

## Шаг 1: Создание Google Таблицы

1. **Перейдите на [Google Sheets](https://sheets.google.com)**
2. **Создайте новую таблицу** с названием "Розыгрыш консультации"
3. **Создайте заголовки** в первой строке:
   - A1: "Имя"
   - B1: "Телефон" 
   - C1: "Тип консультации"
   - D1: "Дата и время"

## Шаг 2: Создание Google Apps Script

1. **В Google Sheets** нажмите **"Расширения"** → **"Apps Script"**
2. **Удалите весь существующий код** и вставьте следующий:

```javascript
function doPost(e) {
  try {
    // Получаем данные из запроса
    const data = JSON.parse(e.postData.contents);
    
    // Получаем активную таблицу
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Добавляем новую строку с данными
    sheet.appendRow([
      data.name,
      data.phone,
      data.consultation,
      data.timestamp
    ]);
    
    // Возвращаем успешный ответ
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Возвращаем ошибку
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("Google Sheets API работает!")
    .setMimeType(ContentService.MimeType.TEXT);
}
```

## Шаг 3: Сохранение и развертывание

1. **Сохраните проект** (Ctrl+S или Cmd+S)
2. **Дайте название проекту:** "Розыгрыш консультации API"
3. **Нажмите "Развернуть"** → **"Новое развертывание"**
4. **Выберите тип:** "Веб-приложение"
5. **Настройте параметры:**
   - Описание: "API для формы розыгрыша"
   - Выполнять как: "Я"
   - У кого есть доступ: "Все"
6. **Нажмите "Развернуть"**
7. **Скопируйте URL веб-приложения** - он будет выглядеть так:
   ```
   https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

## Шаг 4: Настройка кода React

В файле `src/App.js` замените URL:

```javascript
// Замените YOUR_SCRIPT_ID на ID из URL веб-приложения
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

## Шаг 5: Тестирование

1. **Запустите React приложение:**
   ```bash
   npm start
   ```

2. **Заполните форму** и отправьте
3. **Проверьте Google Таблицу** - данные должны появиться в новой строке

## Преимущества Google Sheets над Google Forms:

✅ **Простота настройки** - не нужно искать Entry ID  
✅ **Надежность** - меньше ошибок при отправке  
✅ **Гибкость** - можно легко изменить структуру данных  
✅ **Контроль** - полный доступ к данным  
✅ **Автоматическое время** - добавляется timestamp  
✅ **JSON API** - современный подход  

## Дополнительные возможности:

### Добавление валидации данных:
```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Валидация данных
    if (!data.name || !data.phone || !data.consultation) {
      throw new Error('Не все поля заполнены');
    }
    
    // Проверка формата телефона
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(data.phone)) {
      throw new Error('Неверный формат телефона');
    }
    
    const sheet = SpreadsheetApp.getActiveSheet();
    sheet.appendRow([
      data.name,
      data.phone,
      data.consultation,
      data.timestamp
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Отправка уведомлений:
```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Добавляем данные
    sheet.appendRow([
      data.name,
      data.phone,
      data.consultation,
      data.timestamp
    ]);
    
    // Отправляем уведомление на email
    MailApp.sendEmail({
      to: "your-email@gmail.com",
      subject: "Новая заявка на консультацию",
      body: `Имя: ${data.name}\nТелефон: ${data.phone}\nТип: ${data.consultation}\nВремя: ${data.timestamp}`
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Безопасность:

- **Ограничьте доступ** к таблице только для нужных людей
- **Используйте валидацию** данных на стороне сервера
- **Добавьте rate limiting** для предотвращения спама
- **Логируйте ошибки** для отладки

## Устранение неполадок:

1. **Ошибка 403** - проверьте права доступа к веб-приложению
2. **Ошибка 500** - проверьте код Apps Script на ошибки
3. **Данные не сохраняются** - убедитесь, что таблица активна
4. **CORS ошибки** - Google Apps Script автоматически обрабатывает CORS
