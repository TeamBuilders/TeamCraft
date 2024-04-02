import React from "react";
import styles from "./Home.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
function Home() {
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
            <div className={styles.main_text}>
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
          <div className={styles.img_cont2}></div>
          <div className={styles.text_cont2}>
            <p>
              <span className={styles.cont2_head}>Найдите команду</span> <br />{" "}
              <br /> Если вы ищете команду для участия в соревнованиях, проектах
              или просто хотите расширить свой круг общения, у нас есть
              инструменты, чтобы найти то, что вам нужно.
            </p>
          </div>
        </div>
        <div className={styles.container3}>
          <div className={styles.text_cont3}>
            <p>
              <span className={styles.cont3_head}>Создайте команду</span> <br />{" "}
              <br /> Если у вас уже есть идея или проект и вам нужны партнеры,
              вы можете создать свою собственную команду и найти людей, которые
              разделяют ваши интересы и идеи.
            </p>
          </div>
          <div className={styles.img_cont3}></div>
        </div>
      <Footer />
    </div>
  );
}

export default Home;
