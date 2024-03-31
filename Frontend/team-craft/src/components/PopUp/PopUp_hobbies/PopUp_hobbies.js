import React from 'react';
import styles from './PopUp_hobbies.module.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


export default function PopUp_hobbies() {
  return (<Popup contentStyle={{
    width: '500px', 
    height: '500px', 
    backgroundColor: '#1d2125',
    color: '#333', 
    // border: '2px solid #9fc4f0', 
    border: 'none',
    borderRadius: '10px', 
    padding: '20px',
    display: 'flex',
    justifyContent: 'center'
  }} trigger=
  {<button className={styles.button_trigger}> Рассказать о себе </button>} 
  modal nested>
  {
      close => (
          <div className={styles.modal}>
              <div className={styles.content}>
                  <p>Разработка</p>
              </div>
              <div className={styles.content}>
                  <p>Музыка</p>
              </div>
              <div className={styles.content}>
                  <p>Анимации</p>
              </div>
              <div className={styles.content}>
                  <p>Гейминг</p>
              </div>
              <div className={styles.content}>
                  <p>Социальные развлечения</p>
              </div>
              <div className={styles.content}>
                  <p>Научные разработки</p>
              </div>
              <div className={styles.content}>
                  <p>Активный отдых</p>
              </div>
          </div>
        )
    }
    </Popup>);
}