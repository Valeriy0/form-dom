import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    consultation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Валидация имени
    if (!formData.name.trim()) {
      newErrors.name = 'Пожалуйста, введите ваше имя';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
    }
    
    // Валидация телефона
    if (!formData.phone.trim()) {
      newErrors.phone = 'Пожалуйста, введите номер телефона';
    } else {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = 'Пожалуйста, введите корректный номер телефона';
      }
    }
    
    // Валидация типа консультации
    if (!formData.consultation) {
      newErrors.consultation = 'Пожалуйста, выберите тип консультации';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация формы
    if (!validateForm()) {
      showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
      return;
    }
    
    setIsSubmitting(true);

    // Google Sheets Web App URL
    const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxJLIjaObcEU0PJrM6Aj4j3RJrZvlCFmGZj46sAw_htf_WR-AF_9Ctr5gp9ji0MQT1p/exec';
    
    const dataToSend = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      consultation: formData.consultation,
      timestamp: new Date().toLocaleString('ru-RU')
    };

    try {
      console.log('Отправляем данные:', dataToSend); // Добавляем логирование
      
      const response = await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });
      
      console.log('Ответ сервера:', response); // Логируем ответ
      
      if (response.ok) {
        const result = await response.json();
        console.log('Результат:', result);
        setIsSubmitted(true);
      } else {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      showNotification('Произошла ошибка при отправке формы. Попробуйте еще раз.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isSubmitted) {
    return (
      <div className="app">
        <motion.div 
          className="success-container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="success-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            ✓
          </motion.div>
          <h2>Спасибо за участие!</h2>
          <p>Ваша заявка успешно отправлена.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="app">
        {/* Уведомления */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              className={`notification ${notification.type}`}
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="notification-content">
                <span className="notification-icon">
                  {notification.type === 'error' ? '⚠️' : '✅'}
                </span>
                <span className="notification-message">{notification.message}</span>
                <button 
                  onClick={() => setNotification(null)}
                  className="notification-close"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="container"
          initial={{ opacity: 0, y: isMobile ? 20 : 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0.4 : 0.6 }}
        >
        <motion.div 
          className="header"
          initial={{ opacity: 0, y: isMobile ? -10 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isMobile ? 0.1 : 0.2, duration: isMobile ? 0.3 : 0.5 }}
        >
          <div className="icon">🏠</div>
          <h1>Розыгрыш консультации</h1>
          <p>Оставьте свои контакты и участвуйте в розыгрыше бесплатной консультации по ремонту</p>
        </motion.div>

        <motion.form 
          className="form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: isMobile ? 0.2 : 0.4, duration: isMobile ? 0.3 : 0.5 }}
        >
          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: isMobile ? -10 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: isMobile ? 0.3 : 0.5, duration: isMobile ? 0.3 : 0.4 }}
          >
            <label htmlFor="name">Имя *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Введите ваше имя"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </motion.div>

          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: isMobile ? -10 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: isMobile ? 0.4 : 0.6, duration: isMobile ? 0.3 : 0.4 }}
          >
            <label htmlFor="phone">Телефон *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="+7 (999) 123-45-67"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </motion.div>

          <motion.div 
            className="form-group radio-group"
            initial={{ opacity: 0, x: isMobile ? -10 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: isMobile ? 0.5 : 0.7, duration: isMobile ? 0.3 : 0.4 }}
          >
            <label>Какую консультацию вы бы хотели? *</label>
            <div className="radio-options">
              <motion.label 
                className="radio-option"
                whileHover={!isMobile ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="radio"
                  name="consultation"
                  value="дом"
                  checked={formData.consultation === 'дом'}
                  onChange={handleInputChange}
                  required
                />
                <span className="radio-custom"></span>
                <span className="radio-text">🏡 Дом</span>
              </motion.label>
              
              <motion.label 
                className="radio-option"
                whileHover={!isMobile ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="radio"
                  name="consultation"
                  value="квартира"
                  checked={formData.consultation === 'квартира'}
                  onChange={handleInputChange}
                  required
                />
                <span className="radio-custom"></span>
                <span className="radio-text">🏢 Квартира</span>
              </motion.label>
            </div>
            {errors.consultation && <span className="error-message">{errors.consultation}</span>}
          </motion.div>

          <motion.button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
            whileHover={!isMobile ? { scale: 1.02 } : {}}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: isMobile ? 0.6 : 0.8, duration: isMobile ? 0.3 : 0.4 }}
          >
            {isSubmitting ? 'Отправляем...' : 'Участвовать в розыгрыше'}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}

export default App;
