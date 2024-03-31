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
                    <li><Link to="/search" className={styles.h_text2} href="#">Найти команду</Link></li>
                    <li>
                    <Link to="/team" className={styles.h_text2} href="#">Создать команду</Link></li>
                    
                    <li><a className={styles.h_text2} href="#">Блог</a></li>
                </ul>
             </div>
            <div className={styles.header_text_r} >
                <a className={styles.h_text3} href="#">FAQ</a>
                <Link to="/login" href="login.html" className={styles.btn_sign_in}>Войти</Link>
            </div>
        </div>
    </header>
  );
}

export default Header;
