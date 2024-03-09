import React from 'react';
import styles from './Home.module.css';
import { Link } from 'react-router-dom';
function Home() {
  return (

    <div className={styles.home}>
    <div className={styles.main}>
    <div className={styles.container1}>
    <div className={styles.main_text}>
                <a className={styles.first_text}>Добро пожаловать на <span className={styles.name}>TeamCraft</span> <br/> 
                <span className={styles.second_text}>Платформу для поиска команды или члена команды</span></a>
            </div>
            <Link className={styles.btn_sign_up} to="/Signup" >Регистрация</Link>
        
    </div>
           </div>
    <div className={styles.container2}>
        <div className={styles.img_cont2}></div>
        <div className={styles.text_cont2}>
            <a><span className={styles.cont2_head}>Найдите команду</span> <br/> <br/> Если вы ищете команду для участия в соревнованиях, проектах или просто хотите расширить свой круг общения, у нас есть инструменты, чтобы найти то, что вам нужно.</a>
        </div>
    </div>
    <div className={styles.container3}>
        <div className={styles.text_cont3}>
           <a><span className={styles.cont3_head}>Создайте команду</span> <br/> <br/> Если у вас уже есть идея или проект и вам нужны партнеры, вы можете создать свою собственную команду и найти людей, которые разделяют ваши интересы и идеи.</a>
        </div>
        <div className={styles.img_cont3}></div>
    </div>
    </div>
  );
}

export default Home;
