# Инструкция по настройке Google Forms

## Шаг 1: Создание Google Form

1. Перейдите на [Google Forms](https://forms.google.com)
2. Нажмите "Создать форму" или выберите пустой шаблон
3. Дайте форме название, например: "Розыгрыш консультации по ремонту"

## Шаг 2: Настройка полей формы

Создайте следующие поля в вашей Google Form:

### Поле 1: Имя
- Тип поля: "Краткий ответ"
- Вопрос: "Имя"
- Обязательное поле: ✅

### Поле 2: Телефон
- Тип поля: "Краткий ответ"
- Вопрос: "Телефон"
- Обязательное поле: ✅

### Поле 3: Тип консультации
- Тип поля: "Множественный выбор"
- Вопрос: "Какую консультацию вы бы хотели?"
- Варианты ответов:
  - Дом
  - Квартира
- Обязательное поле: ✅

## Шаг 3: Получение URL формы

1. Нажмите кнопку "Отправить" в правом верхнем углу
2. Выберите вкладку "Ссылка"
3. Скопируйте URL формы (он будет выглядеть примерно так):
   ```
   https://docs.google.com/forms/d/e/1FAIpQLSdXXXXXXXXXXXXXXX/formResponse
   ```

   https://docs.google.com/forms/d/e/1FAIpQLSefFlgx3DPzDlB-sQRv9nT9XuR6OloGp3aYw8qjvL_9hTmcfg/viewform?usp=header

## Шаг 4: Получение Entry IDs (2024)

Entry IDs - это уникальные идентификаторы полей в Google Form. Вот актуальные способы их получения:

### Способ 1: Через предварительный просмотр (самый надежный)

1. **Откройте вашу Google Form**
2. **Нажмите на значок "Глаз" (Предварительный просмотр)** в верхней части страницы
3. **Нажмите правой кнопкой мыши** на любое поле ввода
4. **Выберите "Просмотреть код" (Inspect)**
5. **В появившемся окне разработчика** найдите элемент `<input>`
6. **Обратите внимание на атрибут `name`** - он будет иметь вид `entry.XXXXXXXXX`

### Способ 2: Через Network tab (рекомендуется)

1. **Откройте предварительный просмотр** Google Form
2. **F12** → вкладка **Network**
3. **Заполните форму** тестовыми данными и отправьте
4. **Найдите POST запрос** к `formResponse`
5. **Посмотрите на Payload** - там будут Entry IDs

### Способ 3: Через консоль браузера

1. Откройте предварительный просмотр формы
2. Нажмите F12 → вкладка Console
3. Вставьте и выполните этот код:
```javascript
document.querySelectorAll('input[name^="entry."]').forEach(input => {
    console.log('Entry ID:', input.name, 'Type:', input.type);
});
```

### Способ 4: Через исходный код

1. В режиме предварительного просмотра нажмите Ctrl+U (или Cmd+U на Mac)
2. Найдите в коде строки вида: `<input type="text" name="entry.1234567890" ...>`

Примеры Entry IDs:
- Поле "Имя": `entry.1234567890`
- Поле "Телефон": `entry.0987654321`
- Поле "Тип консультации": `entry.1122334455`

## Шаг 5: Настройка кода

В файле `src/App.js` замените следующие значения:

```javascript
// Замените YOUR_FORM_ID на ID вашей формы из URL
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';

// Используем URLSearchParams вместо FormData (более современный подход)
const formBody = new URLSearchParams();
formBody.append('entry.YOUR_ENTRY_ID_FOR_NAME', formData.name); // Entry ID для поля "Имя"
formBody.append('entry.YOUR_ENTRY_ID_FOR_PHONE', formData.phone); // Entry ID для поля "Телефон"
formBody.append('entry.YOUR_ENTRY_ID_FOR_CONSULTATION', formData.consultation); // Entry ID для поля "Тип консультации"

// Отправка данных
await fetch(GOOGLE_FORM_URL, {
  method: 'POST',
  body: formBody,
  mode: 'no-cors'
});
```

## Шаг 6: Тестирование

1. Запустите приложение: `npm start`
2. Заполните форму и отправьте
3. Проверьте в Google Forms, что данные пришли корректно

## Дополнительные настройки

### Настройка уведомлений
1. В Google Forms перейдите в "Ответы"
2. Нажмите на три точки рядом с "Ответы"
3. Выберите "Получать уведомления по электронной почте"
4. Настройте частоту уведомлений

### Экспорт данных
1. В разделе "Ответы" нажмите на иконку Google Sheets
2. Создайте новую таблицу для автоматического сохранения ответов

## Важные замечания

- Google Forms имеет ограничения на количество запросов
- Для продакшена рекомендуется использовать Google Forms API
- Убедитесь, что форма настроена на прием ответов
- Проверьте, что все поля обязательные отмечены корректно

## Альтернативный способ (через Google Forms API)

Для более надежной работы можно использовать Google Forms API:

1. Включите Google Forms API в Google Cloud Console
2. Создайте сервисный аккаунт
3. Используйте библиотеку `googleapis` для отправки данных

Пример кода с API:
```javascript
import { google } from 'googleapis';

const forms = google.forms({ version: 'v1', auth: authClient });
const response = await forms.forms.responses.create({
  formId: 'YOUR_FORM_ID',
  requestBody: {
    responses: [
      {
        itemId: 'ITEM_ID_1',
        textAnswers: { answers: [{ value: formData.name }] }
      },
      // ... другие поля
    ]
  }
});
```
