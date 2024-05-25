import {React, useContext} from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import AuthContext  from '../../context/AuthProvider';
import { useLocation } from 'react-router-dom';


function Header() {
  const {isAuth} = useContext(AuthContext);
  const location = useLocation();

  function refreshPage(){ 
    if (location.pathname.includes("/profile")) {
      window.location.reload(); 
    }
  }  
  //console.log(location.pathname);
  return (
    <header>      
      <div className={styles.header}>
            <div className={styles.header_text}>
                <Link to="/" className={styles.h_text1}>TeamCraft</Link>
                <ul className={styles.navbar_menu}>
                  {/* Поменял здесь проверку на isAuth, чтобы можно */}
                    <li><Link to={isAuth ? "/search" : "/login" }  className={styles.h_text2} href="#">Найти команду</Link></li>
                    <li><Link to={isAuth ? "/create_team" : "/login" } className={styles.h_text2} href="#">Создать команду</Link></li>
                    <li><Link to="/blog"className={styles.h_text2} href="#">Блог</Link></li>
                </ul>
             </div>
            <div className={styles.header_text_r} >
                <Link to={isAuth ? "/profile" : "/login" }  className={styles.btn_sign_in} onClick={refreshPage}>{isAuth ? <p className={styles.header_button}>Профиль</p> : <p className={styles.header_button}>Войти</p>}</Link> 
            </div>
        </div>
    </header>
  );
}

export default Header;
