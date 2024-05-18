import AuthContext from '../../context/AuthProvider';
import React, {useRef, useState, useEffect, useContext} from 'react';
import styles from './Profile.module.css'; // Подключите файл стилей
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AuthProvider from '../../context/AuthProvider';
import { Link } from 'react-router-dom'; // Предполагается, что вы используете React Router
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PopUp_hobbies from '../../components/PopUp/PopUp_hobbies/PopUp_hobbies';
// import { API_URL } from '../../api/apiConfig';
import axiosInstance from '../../api/axios';

const PROFILE_EDIT_URL = '/profile';

export default function Account() {

  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')));

  // Состояния для редактирования профиля
  const [isEdit, setIsEdit] = useState(false);
  const [editUserData, setEditUserData] = useState({ ...userData });

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

  // Объединяем данные календаря в строку
  const dateString = `${year} ${month} ${day}`;

  const buttonSaveRef = useRef(null);
  const buttonCancelRef = useRef(null);

  const [isClicked, setIsClicked] = useState(true);

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
      const response = await axiosInstance.post(PROFILE_EDIT_URL, jsonData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
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

  
  const handleLogout = () => {
    setIsAuth(false);
    // Очищаем локальное хранилище
    localStorage.clear();
    // Перенаправляем пользователя на страницу "/home"
    navigate('/');
  };

  const handleCancelClick = () => {
    setIsEdit(false); 
    setUserData(JSON.parse(localStorage.getItem('userData')));
    //console.log("cancel", localStorage.getItem('userData'));
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
              <p className={styles.nick}>{user}</p> 
              <p className={styles.init}>{userData.name} {userData.sureName}</p> {/* Отображаем имя и фамилию пользователя */}
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
                        onChange={handleInputChange}
                        readOnly = {!isEdit}
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
                        value={userData.descriptionUser}
                        onChange={handleInputChange}
                        readOnly = {!isEdit}
                      />
                    </div>
                    {/* <div className={styles.hobbies}>
                    {userData.hobbiesPerson && JSON.parse(userData.hobbiesPerson).map((hobby, index) => (
                      <div className={styles.hobbyWrapper} key={index}>
                        <p className={styles.p_hobby}>{hobby}</p>
                        <ul className={styles.ul_list}>
                          {userData.skillsPerson && JSON.parse(userData.skillsPerson).map((skill, skillIndex) => (
                            <li className={styles.li_item} key={skillIndex}>{skill}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div> */}
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
                  <div className={styles.profile_edit_buttons}>
                    <button className={styles.unvisble_button} ref= {buttonCancelRef} type="button" onClick={() => {handleCancelClick(); }} disabled={isClicked}>Отмена</button>
                    <button className={styles.unvisble_button} ref= {buttonSaveRef} type="submit" disabled={isClicked}>Сохранить</button>
                  </div>
                </form>
                  <div className={styles.edit}>
                   {isEdit ? <PopUp_hobbies data={userData} onClose={toggleModal}  setData={updateData}/> : null}
                 </div>
                </div>
          </div>
          {/* Сейчас так, пока не появиться api */}
          <div className={styles.teams}>
            <h2>Команды</h2>
            <div className={styles.block_teams}>
            <div className={styles.block_team}>
                <img  className={styles.team_icon}/>
                <div className={styles.desc}>
                <p className={styles.team_title}>Название команды</p>
                <div className={styles.state}>
                    <p className={styles.fullness}>Цель</p>
                </div>
                </div>
              </div>
              <div className={styles.block_team}>
                <img  className={styles.team_icon}/>
                <div className={styles.desc}>
                <p className={styles.team_title}>Название команды</p>
                <div className={styles.state}>
                    <p className={styles.fullness}>Цель</p>
                </div>
                </div>
              </div>
              <div className={styles.block_team}>
                <img  className={styles.team_icon}/>
                <div className={styles.desc}>
                <p className={styles.team_title}>Название команды</p>
                <div className={styles.state}>
                    <p className={styles.fullness}>Цель</p>
                </div>
                </div>
              </div>
              <div className={styles.block_team}>
                <img  className={styles.team_icon}/>
                <div className={styles.desc}>
                <p className={styles.team_title}>Название команды</p>
                <div className={styles.state}>
                    <p className={styles.fullness}>Цель</p>
                </div>
                </div>
              </div>
              <div className={styles.block_team}>
                <img  className={styles.team_icon}/>
                <div className={styles.desc}>
                <p className={styles.team_title}>Название команды</p>
                <div className={styles.state}>
                    <p className={styles.fullness}>Цель</p>
                </div>
                </div>
              </div>
              <div className={styles.block_team}>
                <img  className={styles.team_icon}/>
                <div className={styles.desc}>
                <p className={styles.team_title}>Название команды</p>
                <div className={styles.state}>
                    <p className={styles.fullness}>Цель</p>
                </div>
                </div>
              </div>
            </div>
            </div>
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
        </div>
      </div>
    </div>
      <Footer />
    </div>
  );
}
