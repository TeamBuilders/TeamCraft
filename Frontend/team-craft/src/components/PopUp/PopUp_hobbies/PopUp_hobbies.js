import React from 'react';
import styles from './PopUp_hobbies.module.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import PopUp_category from '../PopUp_category/PopUp_category';


export default function PopUp_hobbies() {
    const categories = [
        { text: "Разработка" },
        { text: "Музыка" },
        { text: "Анимации" },
        { text: "Гейминг" },
        { text: "Социальные развлечения" },
        { text: "Научные разработки" },
        { text: "Активный отдых" }
      ];

  return (<Popup contentStyle={{
    width: '500px', 
    height: '500px', 
    backgroundColor: '#1d2125',
    color: '#333', 
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
            {categories.map((category, index) => (
                <div className={styles.content} key={index}>
                    <PopUp_category text={category.text} />
                </div>
            ))}
        </div>
        )
    }
    </Popup>);
}