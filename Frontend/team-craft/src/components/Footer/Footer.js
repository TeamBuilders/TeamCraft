import {React, useContext} from 'react';
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';
import AuthContext  from '../../context/AuthProvider';

function Footer() {
  const {isAuth} = useContext(AuthContext );

  return (
    <footer className={styles.Footer}>
    <footer className={styles.foot}>
      <div>
        {!isAuth && <Link className={styles.btn_sign_up} to="/Signup" >Регистрация</Link>}

      </div>

        <div className={styles.footer_text}>
          
            <div className={styles.inf}>
            <p>© 2023-2024 Team-Craft</p>
            <p>Создан в рамках курса проектной деятельности Мехмата ЮФУ</p>
            </div>
        </div>
    </footer>
    </footer>
  );
}

export default Footer;
