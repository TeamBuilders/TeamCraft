import {React, useContext} from 'react';
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';
import AuthContext  from '../../context/AuthProvider';

function Footer() {
  const {isAuth} = useContext(AuthContext );

  return (
    <footer className={styles.Footer}>
    <footer className={styles.foot}>
        {!isAuth && <Link className={styles.btn_sign_up} to="/Signup" >Регистрация</Link>}

        <div className={styles.footer_text}>
            <div className={styles.soc}>
                <a className={styles.foot_h} href="#">Социальные сети</a>
                <br/><a className={styles.foot_h} href="#">FAQ</a>
            </div>
            <div className={styles.inf}>
                <a className={styles.foot_h}>Компания</a>
                <br/><a className={styles.inf_t_2} href ="#">О проекте</a>
                <br/><a className={styles.inf_t_2} href ="#">Контакты</a>
                <br/><a className={styles.inf_t_2} href ="#">Конфиденциальность</a>
            </div>
        </div>
    </footer>
    </footer>
  );
}

export default Footer;
