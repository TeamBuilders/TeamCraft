import React, {useRef, useState, useEffect, useContext} from 'react';
import styles from './Team.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import axios from 'axios';


export default function Team(){
    const [userData, setUserData] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [teamName, setTeamName] = useState(localStorage.getItem('teamName') || '');
    const [numberOfMembers, setNumberOfMembers] = useState(localStorage.getItem('numberOfMembers') || '');
    const [teamTags, setTeamTags] = useState(localStorage.getItem('teamTags') || '');
    const [teamDescription, setTeamDescription] = useState(localStorage.getItem('teamDescription') || '');
    const [error, setError] = useState('');

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setTeamName(localStorage.getItem('teamName') || '');
        setNumberOfMembers(localStorage.getItem('numberOfMembers') || '');
        setTeamTags(localStorage.getItem('teamTags') || '');
        setTeamDescription(localStorage.getItem('teamDescription') || '');
        setError('');
    };

    const handleSaveClick = () => {
        if (!teamName.trim() || !numberOfMembers.trim() || !teamTags.trim() || !teamDescription.trim()) {
            setError('Пожалуйста, заполните все поля');
            return;
        }
        if (numberOfMembers < 2) {
            setError('Количество участников должно быть больше 2');
            return;
        }
        if (numberOfMembers > 10) {
            setError('Количество участников должно быть меньше 10');
            return;
        }
        // Сохранение данных в localStorage
        localStorage.setItem('teamName', teamName);
        localStorage.setItem('numberOfMembers', numberOfMembers);
        localStorage.setItem('teamTags', teamTags);
        localStorage.setItem('teamDescription', teamDescription);
        setIsEditing(false);
    };

    return(
        <div className={styles.team_page}>
            <Header/>
            <div className={styles.bgcolor}>
            <div className={styles.description}>
                <div className={styles.team_profile_player}>
                    <div className={styles.team}>
                        <h2>Команда</h2>
                        <div className={styles.acc_panel}>
                            <img src="../../images/csgo.ico" alt="Avatar" className={styles.avatar} />
                            <div className={styles.initials}>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={teamName}
                                        onChange={(e) => setTeamName(e.target.value)}
                                        required
                                    />
                                ) : (
                                    <p className={styles.name}>{teamName}</p>
                                )}
                                <div className={styles.state}>
                                    <div className={styles.circle} id="1"></div>
                                    <p className={styles.fullness}>1 из {isEditing 
                                    ? <input type="number" 
                                    value={numberOfMembers} 
                                    onChange={(e) => setNumberOfMembers(e.target.value)}
                                    min={2}
                                    max={10} 
                                    required/> 
                                    : numberOfMembers}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.player}>
                        <h2>Участники</h2>
                        {/* Остальные элементы */}
                    </div>
                </div>
                <div className={styles.info_team}>
                    <div className={styles.tag}>
                        <p>Теги</p>
                        <div className={styles.tag_field}>
                            <textarea
                                value={teamTags}
                                className={styles.tags}
                                onChange={(e) => setTeamTags(e.target.value)}
                                name="tags"
                                style={{ fontSize: '15pt' }}
                                rows="3"
                                cols="40"
                                required></textarea>
                        </div>
                    </div>
                    <div className={styles.info}>
                        <div className={styles.info_panel}>
                            <p className={styles.inf_title}>Информация о команде</p>
                            <textarea
                                value={teamDescription}
                                className={styles.inf_p}
                                onChange={(e) => setTeamDescription(e.target.value)}
                                name="inf-p"
                                style={{ fontSize: '13pt' }}    
                                rows="10"
                                cols="40"
                                readOnly={!isEditing}
                                required></textarea>
                        </div>
                    </div>
                </div>
                
            </div>
            <div className={styles.btns}>
            {isEditing ? (
                    <div>
                        <button className={styles.cancel} onClick={handleCancelClick}>Отмена</button>
                        <button className={styles.confirm} onClick={handleSaveClick}>Сохранить</button>
                    </div>
                ) : (
                    <button className={styles.edit} onClick={handleEditClick}>Редактировать</button>
                )}
            </div>
        </div>
            <Footer/>
        </div>
            
    );
}