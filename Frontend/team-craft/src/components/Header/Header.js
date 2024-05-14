import {React, useContext} from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import AuthContext  from '../../context/AuthProvider';

function Header() {
  const {isAuth} = useContext(AuthContext);

  return (
    <header>      
      <div className={styles.header}>
            <div className={styles.header_text}>
                <Link to="/" className={styles.h_text1}>TeamCraft</Link>
                <ul className={styles.navbar_menu}>
                  {/* Поменял здесь проверку на isAuth, чтобы можно */}
                    <li><Link to={true ? "/search" : "/login" }  className={styles.h_text2} href="#">Найти команду</Link></li>
                    <li><Link to={true ? "/create_team" : "/login" } className={styles.h_text2} href="#">Создать команду</Link></li>
                    <li><Link to=""className={styles.h_text2} href="#">Блог</Link></li>
                </ul>
             </div>
            <div className={styles.header_text_r} >
                <a className={styles.h_text3} href="#">FAQ</a>
                <Link to={isAuth ? "/profile" : "/login" }  className={styles.btn_sign_in}>{isAuth ? <p className={styles.header_button}>Профиль</p> : <p className={styles.header_button}>Войти</p>}</Link> 
            </div>
        </div>
    </header>
  );
}

export default Header;
