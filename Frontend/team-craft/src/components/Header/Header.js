import {React, useContext} from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import AuthProvider from '../../context/AuthProvider';

function Header() {
  const {isAuth} = useContext(AuthProvider);


  return (
    <header>      
      <div className={styles.header}>
            <div className={styles.header_text}>
                <Link to="/" className={styles.h_text1}>TeamCraft</Link>
                <ul className={styles.navbar_menu}>
                    <li><Link to="/search" className={styles.h_text2} href="#">Найти команду</Link></li>
                    <li><Link to="/team" className={styles.h_text2} href="#">Создать команду</Link></li>
                    <li><Link to=""className={styles.h_text2} href="#">Блог</Link></li>
                </ul>
             </div>
            <div className={styles.header_text_r} >
                <a className={styles.h_text3} href="#">FAQ</a>
                {isAuth ? <Link to="/login"  className={styles.btn_sign_in}>Войти</Link> 
                : <Link to="/profile"  className={styles.btn_sign_in}>Профиль</Link>}
            </div>
        </div>
    </header>
  );
}

export default Header;
