// Улучшенный код для Google Apps Script
// Вставьте этот код в ваш Google Apps Script проект

function doPost(e) {
  try {
    console.log('Получен POST запрос:', e);
    console.log('postData.contents:', e.postData ? e.postData.contents : 'Нет данных');
    console.log('parameters:', e.parameter);
    
    // Получаем данные из запроса
    let data;
    
    // Сначала пробуем получить данные из параметров (FormData)
    if (e.parameter && (e.parameter.name || e.parameter.phone || e.parameter.consultation)) {
      data = {
        name: e.parameter.name || '',
        phone: e.parameter.phone || '',
        consultation: e.parameter.consultation || '',
        timestamp: e.parameter.timestamp || new Date().toLocaleString('ru-RU')
      };
      console.log('Данные из параметров (FormData):', data);
    } else if (e.postData && e.postData.contents) {
      // Если нет параметров, пробуем JSON
      try {
        data = JSON.parse(e.postData.contents);
        console.log('Данные из JSON:', data);
      } catch (parseError) {
        console.log('Ошибка парсинга JSON:', parseError);
        throw new Error('Не удалось получить данные из запроса');
      }
    } else {
      throw new Error('Нет данных в запросе');
    }
    
    // Валидация данных
    if (!data.name || !data.phone || !data.consultation) {
      throw new Error('Не все поля заполнены');
    }
    
    // Получаем активную таблицу
    const sheet = SpreadsheetApp.getActiveSheet();
    console.log('Активная таблица:', sheet.getName());
    
    // Проверяем, есть ли заголовки в первой строке
    const lastRow = sheet.getLastRow();
    console.log('Последняя строка до добавления:', lastRow);
    
    if (lastRow === 0) {
      // Добавляем заголовки, если таблица пустая
      console.log('Добавляем заголовки');
      sheet.getRange(1, 1, 1, 4).setValues([['Имя', 'Телефон', 'Тип консультации', 'Дата и время']]);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
    }
    
    // Добавляем новую строку с данными
    const rowData = [
      data.name,
      data.phone,
      data.consultation,
      data.timestamp
    ];
    console.log('Добавляем строку:', rowData);
    
    sheet.appendRow(rowData);
    
    const newLastRow = sheet.getLastRow();
    console.log('Последняя строка после добавления:', newLastRow);
    
    // Возвращаем успешный ответ с CORS заголовками
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Данные успешно сохранены'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Ошибка в doPost:', error);
    
    // Возвращаем ошибку с CORS заголовками
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        message: 'Произошла ошибка при сохранении данных'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Простой тест для проверки работы API
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'OK',
      message: 'Google Sheets API работает!',
      timestamp: new Date().toLocaleString('ru-RU')
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Дополнительная функция для очистки данных (опционально)
function clearAllData() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 4).clearContent();
  }
}

// Функция для получения всех данных (опционально)
function getAllData() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  return data;
}
