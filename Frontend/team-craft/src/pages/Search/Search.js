import React from "react";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from '../Search/Search.module.css';

export default function Search(){

    return(
        <div className={styles.search_page}>
          <Header/>
          <div className={styles.bgcolor}>
            <div className={styles.description}>
              <div className={styles.filter}></div>
              <div className={styles.search_card}>
                <div className={styles.td}>
                  <input type="search" className={styles.search} placeholder="Поиск" />
                </div>
                <div className={styles.cards}>
                  <div className={styles.card}>
                    <div className={styles.picture}>
                      <img src="../../images/avatar.jpg" alt="Avatar" className={styles.avatar} />
                    </div>
                    <div className={styles.description2}>
                      <div className={styles.text}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer/>
        </div>
    );
}