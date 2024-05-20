import { React, useState, useEffect, useRef } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "../Find/Find.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { API_URL } from "../../api/apiConfig";
import axiosInstance from "../../api/axios";

// const TEAMS_URL = "/teams"; разные регистры - издевательсвто
const PROFILES_URL = "/profiles";
const FILTER_URL = "/profiles/filter";
const SKILL_URL = "/skill/1";
const HOBBY_URL = "/hobby";
const INVITE_URL = "/team/invite/";

export default function Find() {
  const [team, setTeam] = useState(JSON.parse(localStorage.getItem("team")));
  const teamId = team.id;
  const jwtToken = localStorage.getItem("token");
  //   требует
  //   авторизацию от имени создателя команды или ее соруководителя. принимает параметр id
  //   приглашаемого юзера и id команды в которую приглашают. Если все корректно, то у пользователя
  //   в списке добавится команда, в которую его пригласили. В ответ присылает отредактированный профиль юзера

  //   api/profile/acceptInvite/{idTeam} пост запрос требующий авторизацию от имени пользователя, который принимает приглашение , принимает id команды, приглашение которой юзер принимает.  Если все корректно, убирает команду из списка приглашений в инфе юзера и принимает его в команду. Отправляет обновленные данные о команде, куда вступил юзер

  //   api/profile/cancelledInvite/{idTeam} аналогичный пост запрос, но для отмены приглашения. Отправляет дату юзера, в которой уже нет приглашения от команды
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [users, setUsers] = useState([]);

  const handleCancel = async () => {
    formRef.current.reset();

    setSelectedSkills([]);
    const checkboxes = formRef.current.querySelectorAll(
      'input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    const usersData = await takeUsers();
    setFoundUsers(usersData);
  };

  const [listSkills, setListSkills] = useState([]);
  // const [selectedSkills, setSelectedSkills] = useState([]);
  const [foundUsers, setFoundUsers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const jsonData = JSON.stringify(selectedSkills);
      console.log("Запрос: ", jsonData);

      const response = await axiosInstance.post(FILTER_URL, jsonData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        console.log(response.data);
        setFoundUsers(response.data);
        const foundUsers = response.data;
        console.log(foundUsers);
        // localStorage.setItem("foundUsers", JSON.stringify(foundUsers));
      }
    } catch (err) {
      console.error("Ошибка при отправке запроса:", err);
    }
  };
  const takeUsers = async () => {
    const response = await axiosInstance.get(PROFILES_URL);
    console.log(response);
    return response.data;
  };

  const takeSkills = async () => {
    const response = await axiosInstance.get(SKILL_URL);
    console.log(response);
    return response.data;
  };

  const [hobbies, setHobbies] = useState([]);
  const [selectedHobby, setSelectedHobby] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const fetchHobbies = async () => {
    try {
      const response = await axiosInstance.get(HOBBY_URL);
      console.log(response.data);
      setHobbies(response.data);
    } catch (error) {
      console.error("Error fetching hobbies:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await takeUsers();
        console.log(usersData);
        setFoundUsers(usersData);

        fetchHobbies();

        // const dataSkills = await takeSkills();
        // setListSkills(dataSkills);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  const handleHobbyClick = (hobbyId) => {
    // Если выбранное хобби изменилось (или закрывается), сбрасываем выбранные скиллы
    if (selectedHobby === hobbyId) {
      setSelectedHobby(null);
    } else {
      setSelectedHobby(hobbyId);
    }
    setSelectedSkills([]);
  };

  function calculateAgeString(birthDateString) {
    const birthDate = new Date(birthDateString);
    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();

    // Проверка месяца и дня рождения
    const currentMonth = currentDate.getMonth() + 1;
    const birthMonth = birthDate.getMonth() + 1;
    if (
      currentMonth < birthMonth ||
      (currentMonth === birthMonth &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // Определение склонения слова "год"
    let yearsString = "год";
    if (age % 10 === 1 && age % 100 !== 11) {
      yearsString = "год";
    } else if (
      [2, 3, 4].includes(age % 10) &&
      ![12, 13, 14].includes(age % 100)
    ) {
      yearsString = "года";
    }

    return age + " " + yearsString;
  }


  
  // Переход на страницу профиля по клику на него
  const handleUserClick = (user) => {
    if (user.id === JSON.parse(localStorage.getItem("userData")).id) {
      navigate(`/profile`);
    } else {
      navigate(`/profile/${user.id}`, { state: user });
    }
  };
  
  const UserCard = ({ user }) => {
    const [isApplicationSent, setIsApplicationSent] = useState();
    useEffect(() => {
      if (user && Array.isArray(user.invitedFromTeam) && user.invitedFromTeam.includes(teamId)) {
        setIsApplicationSent(true);
      } else {
        setIsApplicationSent(false);
      }
    }, [user, teamId]);
    const INVITE_URL = "/team/invite/";
  //   поста запрос /api/team/invite/{idDataUserInvited}-{idTeam}

    const handleSendApplication = async() => {
      if (!isApplicationSent) {
        console.log("jwtToken: " + jwtToken);
        console.log("teamId: " + teamId);
        console.log("user.id: " + user.id);
        console.log("userId - teamId: " + user.id + "-" + teamId);
        try {
          const response = await axiosInstance.post(
            INVITE_URL + JSON.stringify(user.id) + "-" + JSON.stringify(teamId),
            null,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );
          if (response.status === 200) {
            console.log("Пользователь приглашшен в команду");
            console.log(response.data);
          }
        } catch (error) {
          console.log(error);
        }
      }

      setIsApplicationSent(true);
    };

    return (
      <div key={user.id} className={styles.card}>
        <div style={{ width: "min-content" }}>
          <div
            className={styles.card_block}
            onClick={() => handleUserClick(user)}
          >
            <div className={styles.picture}>
              <img className={styles.avatar} />
            </div>
            <div className={styles.description2}>
              <div className={styles.team_name}>
                <p className={styles.team_name_text}>
                  {user.name + " " + user.sureName}
                </p>
              </div>
              <div className={styles.team_goal}>
                <p className={styles.team_goal_text}>
                  <span>Цель</span>: {user.goalsPerson || "Неизвестно"}
                </p>
              </div>
              <div className={styles.team_goal}>
                <p className={styles.team_goal_text}>
                  <span>Пол</span>:{" "}
                  {user.gender === "male" || user.gender === "man"
                    ? "мужчина"
                    : user.gender === "female" || user.gender === "woman"
                    ? "женщина"
                    : ""}
                </p>
              </div>
              <div className={styles.team_goal}>
                <p className={styles.team_goal_text}>
                  <span>Возраст</span>: {calculateAgeString(user.databirthday)}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.invite}>
            <button
              className={styles.button_invite}
              onClick={handleSendApplication}
              disabled={isApplicationSent} // Если заявка уже отправлена, делаем кнопку неактивной
            >
              {isApplicationSent ? "Отправлено" : "Пригласить"}
            </button>
          </div>
          <div className={styles.team_stack}>
            {user.skillsPerson.map((skill, index) => (
              <div
                key={index}
                className={`${styles.skill} ${
                  selectedSkills.map((s) => s.nameSkill).includes(skill)
                    ? styles.match
                    : ""
                }`}
              >
                <p>{skill.nameSkill}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.search_page}>
      <Header />
      <div className={styles.grid_container}>
        <div className={styles.filter}>
          <form onSubmit={handleSubmit} ref={formRef}>
            <div className={styles.form}>
              <h3>Навыки</h3>
              {hobbies.map((hobby) => (
                <div key={hobby.id}>
                  <button
                    className={styles.button_hobby}
                    onClick={() => handleHobbyClick(hobby.id)}
                  >
                    <span
                      className={
                        selectedHobby === hobby.id
                          ? styles.triangleDown
                          : styles.triangleRight
                      }
                    ></span>
                    {hobby.nameHobby}
                  </button>
                  {selectedHobby === hobby.id && (
                    <div>
                      {hobby.skillPeople.map((skill) => (
                        <label key={skill.id} className={styles.checkbox_btn}>
                          <input
                            type="checkbox"
                            id={`skill-${skill.id}`}
                            name="skill"
                            value={skill.nameSkill}
                            className={styles.checkbox_input}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSkills((prevSkills) => [
                                  ...prevSkills,
                                  skill,
                                ]);
                              } else {
                                setSelectedSkills((prevSkills) =>
                                  prevSkills.filter(
                                    (prevSkill) => prevSkill.id !== skill.id
                                  )
                                );
                              }
                            }}
                          />
                          <span className={styles.checkbox_label}>
                            {skill.nameSkill}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className={styles.btns}>
              <button
                className={`${styles.cancel}`}
                type="button"
                id="cancel"
                onClick={handleCancel}
              >
                Сбросить
              </button>
              <button
                className={`${styles.confirm}`}
                type="submit"
                id="confirm"
              >
                Применить
              </button>
            </div>
          </form>
        </div>
        <div className={styles.bgcolor}>
          <div className={styles.description}>
            <div className={styles.headOfFind}>
              <div className={styles.td}>
                <input
                  type="search"
                  className={styles.search}
                  placeholder="Поиск"
                  value={selectedSkills
                    .map((skill) => skill.nameSkill)
                    .join(", ")}
                  readOnly
                />
              </div>
              <div className={styles.toBack}>
                <button
                  className={styles.button_back}
                  onClick={() => navigate(`/team/${team.teamName}`)}
                >
                  Назад
                </button>
              </div>
            </div>

            <div className={styles.search_card}>
              <div className={styles.cards}>
                {foundUsers.map((user) => (
                  <UserCard user={user} key={user.id} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
