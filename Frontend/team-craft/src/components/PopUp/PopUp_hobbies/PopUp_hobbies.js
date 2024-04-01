import {React,useState, useEffect} from 'react';
import styles from './PopUp_hobbies.module.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import PopUp_category from '../PopUp_category/PopUp_category';


export default function PopUp_hobbies() {
    const hobbies = [
        { text: "Разработка" },
        { text: "Музыка" },
        { text: "Анимации" },
        { text: "Гейминг" },
        { text: "Социальные развлечения" },
        { text: "Научные разработки" },
        { text: "Активный отдых" }
      ];

    let userData = JSON.parse(localStorage.getItem('userData'));

    const handleOpen2 = () => {

        if (userData.hobbiesPerson === null) {
            userData.hobbiesPerson = [];
            localStorage.setItem('userData', JSON.stringify(userData));
        }
        if (userData.skillsPerson === null) {
            userData.skillsPerson = {
                "Разработка": [],
                "Музыка": [],
                "Анимации": [],
                "Гейминг": [],
                "Социальные развлечения": [],
                "Научные разработки": [],
                "Активный отдых": []
            };
            localStorage.setItem('userData', JSON.stringify(userData));
        }
    };

    const handleClose2 = () => {
        userData = JSON.parse(localStorage.getItem('userData'));
    };


    useEffect(() => {
        handleOpen2();
    }, []);

  return (<Popup contentStyle={{
    width: '500px', 
    height: '600px', 
    backgroundColor: '#1d2125',
    color: '#333', 
    border: 'none',
    borderRadius: '10px', 
    padding: '20px',
    display: 'flex',
    justifyContent: 'center'
  }} trigger=
  {<button className={styles.button_trigger}> Рассказать о себе </button>}
  modal nested closeOnDocumentClick>
  {
      close => (
        <div className={styles.modal}>
            {hobbies.map((hobby, index) => (
                <div className={styles.content} key={index}>
                    <PopUp_category text={hobby.text} value={userData} />
                </div>
            ))}
            <div className={styles.buttons}>
                <button className={styles.button_close} onClick={() => { handleClose2(); close(); }}>Сохранить</button>
            </div>
        </div>
        )
    }
    </Popup>);
}