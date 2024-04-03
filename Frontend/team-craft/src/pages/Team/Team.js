import React, {useRef, useState, useEffect, useContext} from 'react';
import styles from './Team.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import { API_URL } from '../../api/apiConfig';

const EDIT_URL = API_URL + '/teams/edit';

export default function Team(){
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [teamName, setTeamName] = useState(localStorage.getItem('teamName') || '');
    const [teamGoal, setTeamGoal] = useState(localStorage.getItem('teamGoal') || '');
    const [teamMembers, setTeamMembers] = useState(localStorage.getItem('MemberTeam') || '');
    const [numberOfmembers, setNumberOfmembers] = useState(JSON.parse(teamMembers).length);  
    const [teamSkills, setTeamSkills] = useState(localStorage.getItem('teamSkills') || '');
    const [errMsg, setErrMsg] = useState('');
    const [error, setError] = useState('');
    const [isTeamLeader, setIsTeamLeader] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setTeamName(localStorage.getItem('teamName') || '');
        setTeamGoal(localStorage.getItem('teamGoal') || '');

        setError('');
    };

    const handleSaveClick = async (e) => {
        if (!teamName.trim() || !teamGoal.trim()) {
            setError('Пожалуйста, заполните все поля');
            return;
        }
            //   localStorage.setItem('userData', JSON.stringify(userData));
            //   localStorage.setItem('token', response.data?.jwtToken);
            //   localStorage.setItem('user', JSON.stringify(user));
            // {
            //     "teamName": "Огурцы",
            //     "teamGoal": "Молодцы",
            //     "team_lead" : "Admin1",
            //     "MemberTeam" :
            //     [
            //     {
            //         "dataMemberUser" :
            //            {
            //             "name":"alex",
            //             "sureName":"uglov",
            //             "descriptionUser":null,
            //             "databirthday":"2000-12-31T00:00:00",
            //             "gender":"male",
            //             "hobbiesPerson":null,
            //             "skillsPerson":null,
            //             "goalsPerson":null,
            //             "urlContact":"vk",
            //             "inTeam":false
            //             },
            //         "roleMember" : "wtf"
            //     }
            //     ]
            // }
            // team_lead это значение user
            e.preventDefault();
        
            // Формируем объект для team_lead на основе значения user
        
            const user = JSON.parse(localStorage.getItem("user"));
            const team_lead = user;
            const userData = JSON.parse(localStorage.getItem("userData"));
            // const memberTeam = [
            //   {
            //     dataMemberUser: userData, 
            //     roleMember: "Тимлид",
            //   },
            // ];
        
            // Формируем итоговый объект JSON
            const jsonData = JSON.stringify({
              teamName: teamName,
              teamGoal: teamGoal,
              team_lead: team_lead,
              MemberTeam: JSON.parse(teamMembers), 
            });
        
            console.log("Данные команды:", jsonData);
            localStorage.setItem("teamName", teamName);
            localStorage.setItem("teamGoal", teamGoal);
            localStorage.setItem("MemberTeam", teamMembers);
            try {
              const response = await axios.post(EDIT_URL, jsonData, {
                headers: { "Content-Type": "application/json" },
              });
        
              if (response.status === 200) {
                // Сам напишу
                // Переходим на страницу команды
        
                navigate("/team/" + teamName);
              }
            } catch (err) {
              console.error("Ошибка при отправке запроса:", err);
        
              if (err.response) {
                if (err.response.status === 502) {
                  if (err.response.data.message[0] === "Bad Gateway") {
                    setErrMsg("Опять че то с сервером");
                  }
                } else {
                  setErrMsg("Ошибка создания команды");
                }
              } else {
                setErrMsg("Нет ответа от сервера");
              }
            }
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
                                    <p className={styles.fullness}>Количество участников: {numberOfmembers}</p>
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
                    <div className={styles.applic_member}>
                        <h2>Заявки на вступление</h2>
                        <div className={styles.applic_member_teams}>
                            <div className={styles.block_player}>
                                <img src="images/avatar.jpg" alt="player_icon" className={styles.player_icon}/>
                                <div className={styles.desc}>
                                <p className={styles.player_title}>Никнейм</p>
                                <div className={styles.state}>
                                </div>
                                </div>
                                <div className={styles.buttons}>
                                <button className={styles.button_add} >Добавить</button>
                                <button className={styles.button_remove} >Отклонить</button>
                                </div>
                            </div>
                            <div className={styles.block_player}>
                                <img src="images/avatar.jpg" alt="player_icon" className={styles.player_icon}/>
                                <div className={styles.desc}>
                                <p className={styles.player_title}>Никнейм</p>
                                <div className={styles.state}>
                                </div>
                                </div>
                                <div className={styles.buttons}>
                                <button className={styles.button_add} >Добавить</button>
                                <button className={styles.button_remove} >Отклонить</button>
                                </div>
                            </div>
                            <div className={styles.block_player}>
                                <img src="images/avatar.jpg" alt="player_icon" className={styles.player_icon}/>
                                <div className={styles.desc}>
                                <p className={styles.player_title}>Никнейм</p>
                                <div className={styles.state}>
                                </div>
                                </div>
                                <div className={styles.buttons}>
                                <button className={styles.button_add} >Добавить</button>
                                <button className={styles.button_remove} >Отклонить</button>
                                </div>
                            </div>
                            <div className={styles.block_player}>
                                <img src="images/avatar.jpg" alt="player_icon" className={styles.player_icon}/>
                                <div className={styles.desc}>
                                <p className={styles.player_title}>Никнейм</p>
                                <div className={styles.state}>
                                </div>
                                </div>
                                <div className={styles.buttons}>
                                <button className={styles.button_add} >Добавить</button>
                                <button className={styles.button_remove} >Отклонить</button>
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
                                value={teamGoal}
                                className={styles.tags}
                                onChange={(e) => setTeamGoal(e.target.value)}
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
                    <div className={styles.info}>
                        <div className={styles.info_panel}>
                            <p className={styles.inf_title}>Навыки команды:</p>
                            {/* <div className={styles.hobbies}>
                                {teamSkills && teamSkills.map((hobby, index) => (
                                    <div className={styles.hobbyWrapper} key={index}>
                                        <p className={styles.p_hobby}>{hobby}</p>
                                        <ul className={styles.ul_list}>
                                            {userData.skillsPerson && userData.skillsPerson[hobby] && userData.skillsPerson[hobby].map((skill, skillIndex) => (
                                            <li className={styles.li_item} key={skillIndex}>{skill}</li>
                                            ))}
                                        </ul>
                                    </div>
                                 ))}
                            </div> */}
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