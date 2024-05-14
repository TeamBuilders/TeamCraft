import {React,useState, useEffect} from 'react';
import styles from './PopUp_hobby.module.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import PopUp_skill from '../PopUp_skill/PopUp_skill';
import axios from 'axios';
// import { API_URL } from '../../../api/apiConfig';
import axiosInstance from '../../../api/axios';

const HOBBY_URL = '/hobby';


export default function PopUp_hobbies({onClose}) {
    
    const [hobby, setHobby] = useState([]);
    const [teamStack, setTeamStack] = useState([]);

    
    const handleSubmit = async () => {
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


    // const handleOpen = () => {
    //     if (teamStack === null) {
    //         setTeamStack([]);
    //     }
    // };
    
    // useEffect(() => {
    //     handleOpen();
    //     localStorage.setItem("team_stack", JSON.stringify(teamStack));
    // }, [teamStack]);

    // const handleOpen = () => {

    //     if (teamStack === null) {
    //         setTeamStack([]);
    //         localStorage.setItem("team_stack",JSON.stringify(teamStack));
    //     }
    // };

    // useEffect(() => {
    //      handleOpen();
    // }, []);

    const handleClose2 = () => {
        onClose(); 
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
  {<button className={styles.button_trigger} type='button'> Добавить </button>}
  modal nested closeOnDocumentClick >
  {
      close => (
        <div className={styles.modal}>
            {hobby.map((hobbies, index) => (
                <div className={styles.content} key={index}>
                    <PopUp_skill text={hobbies.nameHobby} value={hobbies.skillPeople}  />
                </div>
            ))}
            <div className={styles.buttons}>
                <button className={styles.button_close} onClick={ () => {handleClose2(); close();} }>Сохранить</button>
            </div>
        </div>
        )
    }
    </Popup>);
}