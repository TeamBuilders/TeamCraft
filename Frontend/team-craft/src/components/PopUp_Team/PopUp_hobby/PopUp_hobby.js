import {React,useState, useEffect} from 'react';
import styles from './PopUp_hobby.module.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import PopUp_skill from '../PopUp_skill/PopUp_skill';
import axios from 'axios';

const HOBBY_URL = 'https://a25715-5073.x.d-f.pw/api/hobby';


export default function PopUp_hobbies({onClose}) {
    
    const [hobby, setHobby] = useState([]);

    
    const handleSubmit = async (e) => {
        axios.get(HOBBY_URL)
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


    // let teamStack = localStorage.getItem(teamStack);


    const handleOpen = () => {

        // if (teamStack === null) {
        //     teamStack = [];
        //      localStorage.setItem(teamStack, JSON.stringify(teamStack));
        // }
    };

    const handleClose2 = () => {
        // teamStack = JSON.parse(localStorage.getItem('teamStack'));
    };


    useEffect(() => {
        handleOpen();
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
  {<button className={styles.button_trigger} disabled> Добавить навыки </button>}
  modal nested closeOnDocumentClick  onClose={handlePopupClose}>
  {
      close => (
        <div className={styles.modal}>
            {hobby.map((hobbies, index) => (
                <div className={styles.content} key={index}>
                    <PopUp_skill text={hobbies.nameHobby} value={hobbies.skillPeople}  />
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