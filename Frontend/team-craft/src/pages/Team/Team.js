import React, {useRef, useState, useEffect, useContext} from 'react';
import styles from './Team.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import axios from 'axios';


export default function Team(){
    const [userData, setUserData] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [teamName, setTeamName] = useState(localStorage.getItem('teamName') || '');
    const [teamGoals, setteamGoals] = useState(localStorage.getItem('teamGoals') || '');
    const [error, setError] = useState('');

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setTeamName(localStorage.getItem('teamName') || '');
        setteamGoals(localStorage.getItem('teamGoals') || '');
        setError('');
    };

    const handleSaveClick = () => {
        if (!teamName.trim() || !teamGoals.trim()) {
            setError('Пожалуйста, заполните все поля');
            return;
        }
        // Сохранение данных в localStorage
        localStorage.setItem('teamName', teamName);
        localStorage.setItem('teamGoals', teamGoals);
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
                                    <p className={styles.fullness}>Количество участников: 1</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.player}>
                        <h2>Участники</h2>
                        <div className={styles.blocks_players}>
                        <div className={styles.block_player}>
                            <img src="images/avatar.jpg" alt="player_icon" className={styles.player_icon}/>
                            <div className={styles.desc}>
                            <p className={styles.player_title}>{JSON.parse(localStorage.getItem('userData')).name}</p>
                            <div className={styles.state}>
                                <p className={styles.fullness}>Тимлид</p>
                            </div>
                            </div>
                        </div>
                        <div className={styles.block_player}>
                            <img src="images/avatar.jpg" alt="player_icon" className={styles.player_icon}/>
                            <div className={styles.desc}>
                            <p className={styles.player_title}>Никнейм</p>
                            <div className={styles.state}>
                                <p className={styles.fullness}>Роль</p>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                <div className={styles.info_team}>
                    <div className={styles.tag}>
                        <p>Теги</p>
                        <div className={styles.tag_field}>
                            <textarea
                                value={teamGoals}
                                className={styles.tags}
                                onChange={(e) => setteamGoals(e.target.value)}
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
                                value={"Какое-то описание (его нет)"}
                                className={styles.inf_p}
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