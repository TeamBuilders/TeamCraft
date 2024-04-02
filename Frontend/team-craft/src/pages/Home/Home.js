import {React, useRef, useEffect, useState} from 'react';
import styles from './Home.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import { Link } from "react-router-dom";
function Home() {
  const targetRefs = useRef([]); // Массив для хранения ссылок на целевые элементы
  const [visibilityStates, setVisibilityStates] = useState([]);

  useEffect(() => {
    const observers = []; // Массив для хранения экземпляров IntersectionObserver

    // Создание нового экземпляра IntersectionObserver для каждого целевого элемента
    targetRefs.current.forEach((targetRef, index) => {
        if (targetRef) { // Проверяем, что ref не равен undefined
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                  setVisibilityStates(prevStates => {
                    const newStates = [...prevStates];
                    newStates[index] = entry.isIntersecting;
                    console.log(newStates);
                    return newStates;
                  });
                });
            });

            // Начало отслеживания изменений видимости для текущего целевого элемента
            observer.observe(targetRef);

            observers.push(observer); // Добавление экземпляра IntersectionObserver в массив
        }
    });

    // Очистка всех экземпляров IntersectionObserver при размонтировании компонента
    return () => {
        observers.forEach(observer => observer.disconnect());
    };
}, [targetRefs]);

  const [pageHeight, setPageHeight] = useState('100vh'); // Используем 100vh по умолчанию

  useEffect(() => {
    // Функция для вычисления высоты страницы
    const calculatePageHeight = () => {
      const body = document.body;
      const html = document.documentElement;
      const height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.documentElement.clientHeight
      );
      setPageHeight(height + 'px');
    };
    calculatePageHeight();
    window.addEventListener('resize', calculatePageHeight);

    // Удаляем обработчик изменения размера окна при размонтировании компонента
    return () => {
      window.removeEventListener('resize', calculatePageHeight);
    };
  }, []);

  return (
    <div className={styles.main_body} style={{ height: pageHeight }}>
      <Header />
        <div className={styles.main}>
          <div className={styles.container1}>
            <div ref={ref => targetRefs.current[0] = ref} className={`${styles.main_text} ${visibilityStates[0] ? styles.visible : ''}`}>
              <p className={styles.first_text}>
                Добро пожаловать на{" "}
                <span className={styles.name}>TeamCraft</span> <br />
                <span className={styles.second_text}>
                  Платформу для поиска команды или члена команды
                </span>
              </p>
            </div>
            <Link className={styles.btn_sign_up} to="/Signup">
              Регистрация
            </Link>
          </div>
        </div>
        <div className={styles.container2}>
          <div  ref={ref => targetRefs.current[1] = ref} className={`${styles.img_cont2} ${visibilityStates[1] ? styles.visible : ''}`}></div>
          <div ref={ref => targetRefs.current[2] = ref} className={`${styles.text_cont2} ${visibilityStates[2] ? styles.visible : ''}`}>
            <p> 
              <span className={styles.cont2_head}>Найдите команду</span> <br />{" "}
              <br /> Если вы ищете команду для участия в соревнованиях, проектах
              или просто хотите расширить свой круг общения, у нас есть
              инструменты, чтобы найти то, что вам нужно.
            </p>
          </div>
        </div>
        <div className={styles.container3}>
          <div ref={ref => targetRefs.current[3] = ref} className={`${styles.text_cont3} ${visibilityStates[3] ? styles.visible : ''}`}>
            <p>
              <span className={styles.cont3_head}>Создайте команду</span> <br />{" "}
              <br /> Если у вас уже есть идея или проект и вам нужны партнеры,
              вы можете создать свою собственную команду и найти людей, которые
              разделяют ваши интересы и идеи.
            </p>
          </div>
          <div ref={ref => targetRefs.current[4] = ref} className={`${styles.img_cont3} ${visibilityStates[4] ? styles.visible : ''}`}></div>
        </div>
      <Footer />
    </div>
  );
}

export default Home;
