import {React,useState, useEffect} from 'react';
import styles from './PopUp_hobbies.module.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import PopUp_category from '../PopUp_category/PopUp_category';
import axios from 'axios';
// import { API_URL } from '../../../api/apiConfig';
import axiosInstance from '../../../api/axios';

const HOBBY_URL = '/hobby';


export default function PopUp_hobbies({onClose}) {
    
    const [hobby, setHobby] = useState([]);

    
    const handleSubmit = async (e) => {
        axiosInstance.get(HOBBY_URL)
        .then((response) => {
            setHobby(response.data);
        })    
        .catch((error) => {
        console.error(error); // обработка ошибок
        });
    }

    useEffect(() => {
        handleSubmit();
    }, []);


    let userData = JSON.parse(localStorage.getItem('userData'));

    const handleOpen2 = () => {

        if (userData.hobbiesPerson === null) {
            userData.hobbiesPerson = [];
            localStorage.setItem('userData', JSON.stringify(userData));
        }
        if (userData.skillsPerson === null) {
            userData.skillsPerson = [];
            // userData.skillsPerson = {
            //     'Разработка': [],
            //     "Музыка": [],
            //     "Анимации": [],
            //     "Гейминг": [],
            //     "Социальные развлечения": [],
            //     "Научные разработки": [],
            //     "Активный отдых": []
            // };
            localStorage.setItem('userData', JSON.stringify(userData));
        }
    };

    const handleClose2 = () => {
        userData = JSON.parse(localStorage.getItem('userData'));
    };


    useEffect(() => {
        handleOpen2();
    }, []);

    const handlePopupClose = () => {
        onClose(); // Вызываем переданную функцию после закрытия Popup
    };

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
  modal nested closeOnDocumentClick  onClose={handlePopupClose}>
  {
      close => (
        <div className={styles.modal}>
            {hobby.map((hobbies, index) => (
                <div className={styles.content} key={index}>
                    <PopUp_category text={hobbies.nameHobby} value={hobbies.skillPeople} value2={userData} />
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