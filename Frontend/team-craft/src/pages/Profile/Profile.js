import AuthContext from '../../context/AuthProvider';
import React, {useRef, useState, useEffect, useContext} from 'react';
import styles from './Profile.module.css'; // Подключите файл стилей
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AuthProvider from '../../context/AuthProvider';
import { Link } from 'react-router-dom'; // Предполагается, что вы используете React Router
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import PopUp_hobbies from '../../components/PopUp/PopUp_hobbies/PopUp_hobbies';
// import { API_URL } from '../../api/apiConfig';
import axiosInstance from '../../api/axios';

const PROFILE_EDIT_URL = '/profile';
const INCLUDE_TEAM_URL = '/profile/includeTeam/';
const TEAM_URL = '/team/';
const USER_URL = '/test/';

const ACCEPT_URL = "/profile/acceptInvite/";
const CANCEL_URL = "/profile/cancelledInvite/";

export default function Account() {
  //нужен для передачи данных при переходе на страницу профиля c помощью navigate
  const location = useLocation();
  //console.log("location: " + location.state);
  const [isOther, setIsOther] = useState(location.state != null ? true : false);
  //console.log("props: " + JSON.stringify(location.state));

  const [userData, setUserData] = useState(isOther? location.state : JSON.parse(localStorage.getItem('userData')));

  const [isEdit, setIsEdit] = useState(false);

  const[includeTeam, setIncludeTeam] = useState([]);
  const[invitedFromTeam, setInvitedFromTeam] = useState([]);


  // Проверка аутентификации пользователя
  const {isAuth, setIsAuth} = useContext(AuthContext);

  // Получение данных пользователя из локального хранилища
  const user = JSON.parse(localStorage.getItem('user'));
  const email = JSON.parse(localStorage.getItem('email'));
  const dataString = new Date(userData.databirthday);

  // Используйте вызовы методов, чтобы получить год, месяц и день
  const year = dataString.getFullYear();
  const month = dataString.getMonth() + 1; // Прибавляем 1, так как месяцы нумеруются с 0
  const day = dataString.getDate();

  const buttonSaveRef = useRef(null);
  const buttonCancelRef = useRef(null);

  const [isClicked, setIsClicked] = useState(true);

  const UpdateData = async () => {
    try {
      const jwtToken = localStorage.getItem("token");
      //console.log(jwtToken);
      const response = await axiosInstance.get(USER_URL + userData.id,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
      );
      if (response.status === 200) {
        //console.log(response.data);
        localStorage.setItem("userData", JSON.stringify(response.data.dataUser));
        setUserData(response.data.dataUser);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Симуляция нажатия кнопок save и cancel чтобы расположить их не в форме
  const simulateSaveButtonClick = () => {
    if (buttonSaveRef.current) {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });

      buttonSaveRef.current.dispatchEvent(event);
    }
  };

  const simulateCancelButtonClick = () => {
    if (buttonCancelRef.current) {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });

      buttonCancelRef.current.dispatchEvent(event);
    }
  };
 

  const toggleButtonState = () => {
    setIsClicked(prevState => !prevState);
  };

  const navigate = useNavigate();

  const updateData = (newData) => {
    setUserData(newData);
  };

  const toggleModal = () => {
    // window.location.reload();
    setUserData(JSON.parse(localStorage.getItem('userData')));
    
  };

  const handleCopy = (event) => {
    event.preventDefault();
  };

  //Получение данных о командах
  const handleIncludeTeam = async (e) => {
    try {
      //console.log("isOther", userData);
      const userId = isOther ? userData.id : JSON.parse(localStorage.getItem('dataUserId'));
      const response = await axiosInstance.get(INCLUDE_TEAM_URL + userId);
      //console.log(response.data);
      if (response.status === 200) {
        let newIncludeTeam = [];
        for (let i = 0; i < response.data.length; i++) {
          const teamInfo = await axiosInstance.get(TEAM_URL + JSON.stringify(response.data[i].teamId));
          newIncludeTeam.push(teamInfo.data);
        }
        setIncludeTeam(newIncludeTeam);
        //console.log(newIncludeTeam);
        //console.log(localStorage.getItem('userData'));
      }
    } catch (error) {
      console.error('Ошибка при получении команд ', error);
    }
  }

  //Получение данных о командах, которые пригалисили этого участника
  const handleInvitedFromTeam = async (e) => {
      let newInvitedFromTeam = [];
        for (let i = 0; i < userData.invitedFromTeam.length; i++) {
          try{
            const response = await axiosInstance.get(TEAM_URL + JSON.stringify(userData.invitedFromTeam[i]));
            newInvitedFromTeam.push(response.data);
          }
          catch (error) {
            console.error('Ошибка при получении информации о команде', error);
          }
        }
        setInvitedFromTeam(newInvitedFromTeam);
        //console.log(newInvitedFromTeam);
        //console.log(localStorage.getItem('userData'));
  }
  useEffect(() => {
    UpdateData();
    handleIncludeTeam();
    if(userData.invitedFromTeam != null){
      handleInvitedFromTeam();
    }
  }, []);

  //console.log(includeTeam)
  
  // Принятие предложения вступить в команду
  const handleAddMemberClick = async (IdTeam) => {
    try {
      const jwtToken = localStorage.getItem("token");
      const response = await axiosInstance.post(
        ACCEPT_URL + JSON.stringify(IdTeam),
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Обработка успешного ответа
        //localStorage.setItem("userData", JSON.stringify(response.data));
        //setTeam(response.data);
        UpdateData();
        //console.log(response.data);
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };
  // Отклонить предложение вступить в команду
  const handleDeclineClick = async (IdTeam) => {
    try {
      const jwtToken = localStorage.getItem("token");
      const response = await axiosInstance.post(
        CANCEL_URL +JSON.stringify(IdTeam),
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (response.status === 200) {
        localStorage.setItem("userData", JSON.stringify(response.data));
        setUserData(response.data.dataUser);
        //console.log(response.data);
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };

  //Отправка профиля на редактирование
  const handleProfileEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const jsonData = JSON.stringify({
          id : JSON.parse(localStorage.getItem('id')),
          dataUserId : JSON.parse(localStorage.getItem('dataUserId')),
          dataUser : userData,
          settingsUserId: JSON.parse(localStorage.getItem('settingsUserId')),
          settingsUser:{
            isHiddeInResearch: JSON.parse(localStorage.getItem('isHiddeInResearch')),
            isHiddenData: JSON.parse(localStorage.getItem('isHiddenData'))
          }
        }
      );
      //console.log(jsonData);
      //console.log(JSON.parse(jsonData));
      const response = await axiosInstance.post(PROFILE_EDIT_URL, jsonData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      //console.log(response.data);
      if (response.status === 200) {
        localStorage.setItem('userData', JSON.stringify(response.data.dataUser));
        localStorage.setItem('isHiddeInResearch', JSON.stringify(response.data.settingsUser.isHiddeInResearch));
        localStorage.setItem('isHiddenData', JSON.stringify(response.data.settingsUser.isHiddenData));
        setUserData(response.data.dataUser);
        setIsEdit(false);
      }
    } catch (error) {
      console.error('Ошибка при обновлении профиля', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  //Выход из профиля
  const handleLogout = () => {
    setIsAuth(false);
    // Очищаем локальное хранилище
    localStorage.clear();
    // Перенаправляем пользователя на страницу "/home"
    navigate('/');
  };

  //Отмена изменений
  const handleCancelClick = () => {
    setIsEdit(false); 
    setUserData(JSON.parse(localStorage.getItem('userData')));
    //console.log("cancel", localStorage.getItem('userData'));
  };
   //console.log("token", localStorage.getItem('token'));
   //console.log("userData", userData);

   // Переход на страницу команды по клику на ее название
   const handleTeamClick = (team) => {
    localStorage.setItem("team", JSON.stringify(team));
    navigate(`/team/${team.teamName}`);
  };

  // Вычисление минимальной даты (100 лет назад)
  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    return minDate.toISOString().split('T')[0];
  }; 

  return (
    <div className={styles.body}>
      <Header />
      <div className={styles.bgcolor}>
      <div className={styles.container}>
        <div className={styles.account}>
          <div className={styles.profile}>
            <h1>Аккаунт</h1>
          </div>

          <div className={styles.acc_panel}>
            <img className={styles.avatar}  src={userData.avatar} />

            <div className={styles.initials}>
              <p className={styles.nick}>{isOther? userData.name + " " + userData.sureName : user}</p> 
              {!isOther && <p className={styles.init}>{userData.name} {userData.sureName}</p>} {/* Отображаем имя и фамилию пользователя */} 
            </div>
          </div>
        </div>
        <div className={styles.description}>
          <div className={styles.personal}>
            <h2>Личная информация</h2>
                <div>
                  <form onSubmit={handleProfileEdit}>
                  <div className={styles.fields}>
                    <div className={styles.field}>
                      <label>ИМЯ</label>
                      <input
                        type="text"
                        name="name"
                        value={userData.name}
                        readOnly = {!isEdit}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>ФАМИЛИЯ</label>
                      <input
                        type="text"
                        name="sureName"
                        value={userData.sureName}
                        onChange={handleInputChange}
                        readOnly = {!isEdit}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>ДАТА РОЖДЕНИЯ</label>
                      <input
                        type="date"
                        name="databirthday"
                        value={userData.databirthday.slice(0,10)}
                        max={new Date().toISOString().split("T")[0]}
                        min={getMinDate()}
                        onChange={handleInputChange}
                        readOnly={!isEdit}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>ПОЛ</label>
                      <input
                        type="text"
                        name="gender"
                        value={userData.gender}
                        onChange={handleInputChange}
                        readOnly = {!isEdit}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>О СЕБЕ</label>
                      <textarea
                        name="descriptionUser"
                        value={userData.descriptionUser === null && !isEdit ? '' : userData.descriptionUser}
                        onChange={handleInputChange}
                        readOnly = {!isEdit}
                      />
                    </div>
                    <div className={userData.hobbiesPerson == null ? null : styles.hobbies}>
                    {userData.hobbiesPerson && userData.hobbiesPerson.map((hobby, index) => (
                      <div className={styles.hobbyWrapper} key={index}>
                        <p className={styles.p_hobby}>{hobby.nameHobby}</p>
                        <ul className={styles.ul_list}>
                          {userData.skillsPerson && userData.skillsPerson.map((skill, skillIndex) => (
                            skill.categoryHobbyId ===hobby.id && <li className={styles.li_item} key={skillIndex}>{skill.nameSkill}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                    <div className={styles.field}>
                      <label>КОНТАКТЫ</label>
                      <input
                        type="text"
                        name="urlContact"
                        value={userData.urlContact}
                        onChange={handleInputChange}
                        readOnly = {!isEdit}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>ПОЧТА</label>
                      <input
                        type="email"
                        name="email"
                        value={userData.email}
                        readOnly = {!isEdit}
                      />
                    </div>
                  </div>
                  {!isOther && 
                  <div className={styles.profile_edit_buttons}>
                  <button className={styles.unvisble_button} ref= {buttonCancelRef} type="button" onClick={() => {handleCancelClick(); }} disabled={isClicked}>Отмена</button>
                  <button className={styles.unvisble_button} ref= {buttonSaveRef} type="submit" disabled={isClicked}>Сохранить</button>
                  </div>
                  }
                </form>
                  <div className={styles.edit}>
                   {isEdit ? <PopUp_hobbies data={userData} onClose={toggleModal}  setData={updateData}/> : null}
                 </div>
                </div>
          </div>
          <div className={styles.teams_block}>
          <div className={styles.teams}>
            <h2>Команды</h2>
            <div className={styles.block_teams}>
              {includeTeam.length != 0 && includeTeam.map((team, index) => (
                <div key={index} className={styles.block_team} onClick={() => handleTeamClick(team)}>
                  <img  className={styles.team_icon}/>
                  <div className={styles.desc}>
                  <p className={styles.team_title}>{team.teamName}</p>
                  <div className={styles.state}>
                      <p onCopy={handleCopy} className={styles.fullness}>{team.teamGoal}</p>
                  </div>
                  </div>
                </div>
              ))}
            </div>
            </div>
            {!isOther && (
              <div className={styles.applic_member}>
                <h2>Приглашения</h2>
                <div className={styles.applic_member_teams}>
                  {invitedFromTeam.length === 0 && (
                    <p>Нет приглашений</p>
                  )}
                  {!(invitedFromTeam.length === 0) && invitedFromTeam.map((team) => (
                    <div key={team.id} className={styles.block_player} >
                      <div className={styles.block_player_button} onClick={() => handleTeamClick(team)}>
                        <img
                          src="images/avatar.jpg"
                          alt="player_icon"
                          className={styles.player_icon}
                        />
                        <div className={styles.desc}>
                          <p className={styles.player_title} style={{fontSize: "20px", borderRadius: "5px", border: "2px solid #9fc4f0", padding: "2px 4px"}}>
                            {team.teamName}
                          </p>
                          <p className={styles.player_title}>
                            {team.teamGoal}
                          </p>
                          <div className={styles.state}></div>
                        </div>
                      </div>
                      <div className={styles.buttons}>
                        <button
                          className={styles.button_add}
                          onClick={() => handleAddMemberClick(team.id)}
                        >
                          Принять
                        </button>
                        <button
                          className={styles.button_remove}
                          onClick={() => handleDeclineClick(team.id)}
                        >
                          Отклонить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
            {!isOther &&
            <div className={styles.exit}>
            {isEdit?
                <div className={styles.profile_edit_buttons}>
                  <button className={styles.cancel_button} type="button" onClick={() => {toggleButtonState(); simulateCancelButtonClick()}}>Отмена</button>
                  <button className={styles.save_button} type="button" onClick={() =>  {toggleButtonState(); simulateSaveButtonClick()}}>Сохранить</button>
                </div>
                :
                <button className={styles.button_edit} onClick={() => {toggleButtonState(); setIsEdit(true)}}>Редактировать</button>
                }
              <button className={styles.button_exit} onClick={handleLogout}>Выйти</button>
            </div>
            }
        </div>
      </div>
    </div>
      <Footer />
    </div>
  );
}
