import {React,useState, useEffect} from 'react';
import styles from './PopUp_hobby_edit.module.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import PopUp_skill from '../PopUp_skill/PopUp_skill_edit';
import axios from 'axios';
// import { API_URL } from '../../../api/apiConfig';
import axiosInstance from '../../../api/axios';

const HOBBY_URL = '/hobby';


export default function PopUp_hobbies({team, onClose}) {
    
    const [hobby, setHobby] = useState([]);
    const [teamStack, setTeamStack] = useState(team.team_stack);

    const TeamStackSet = (teamStack) => {
        setTeamStack(teamStack);
    };

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


    const handleClose2 = () => {
        onClose(teamStack);
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
                    <PopUp_skill text={hobbies.nameHobby} value={hobbies.skillPeople}  teamStack={teamStack} setStack={TeamStackSet} />
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