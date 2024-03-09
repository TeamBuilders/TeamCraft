import React from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      
      <div className={styles.header}>
            <div className={styles.header_text}>
                <Link to="/" className={styles.h_text1}>TeamCraft</Link>
                <ul className={styles.navbar_menu}>
                    <li><a className={styles.h_text2} href="#">Найти команду</a></li>
                    <li><a className={styles.h_text2} href="#">Создать команду</a></li>
                    <li><a className={styles.h_text2} href="#">Блог</a></li>
                </ul>
             </div>
            <div className={styles.header_text_r} >
                <a className={styles.h_text3} href="#">FAQ</a>
                <a href="login.html" className={styles.btn_sign_in}>Войти</a>
            </div>
        </div>
    </header>
  );
}

export default Header;
