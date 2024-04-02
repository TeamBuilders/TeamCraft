import React, { useState } from "react";
import styles from "./Create_team.module.css";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const CREATE_TEAM_URL = "https://a25913-16e5.w.d-f.pw/api/teams/create";
const CreateTeamForm = () => {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [teamGoal, setteamGoal] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [resErr, setResErr] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
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
    //         "roleMember" : "Тимлид"
    //     }
    //     ]
    // }
    // team_lead это значение user
    e.preventDefault();

    // Формируем объект для team_lead на основе значения user

    const user = JSON.parse(localStorage.getItem("user"));
    const team_lead = user;
    const userData = JSON.parse(localStorage.getItem("userData"));
    const MemberTeam = [
      {
        dataMemberUser: userData, 
        roleMember: "Тимлид",
      },
    ];
    console.log("userData: ", userData);

    // Формируем итоговый объект JSON
    const jsonData = JSON.stringify({
      teamName: teamName,
      teamGoal: teamGoal,
      team_lead: team_lead,
      teamDescription: teamDescription,
      MemberTeam: MemberTeam,
    });

    localStorage.setItem("teamName", teamName);
    localStorage.setItem("teamGoal", teamGoal);
    localStorage.setItem("teamDescription", teamDescription);
    localStorage.setItem("MemberTeam", JSON.stringify(MemberTeam));
    
    console.log("Данные команды:", jsonData);
    try {
      const response = await axios.post(CREATE_TEAM_URL, jsonData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: false,
      });

      if (response.status === 200) {
        console.log("Сохранено");
        navigate("/team/" + teamName);
      }
    } catch (err) {
      console.error("Ошибка при отправке запроса:", err);

      if (err.response) {
        if (err.response.status === 502) {
          if (err.response.data.message[0] === "Bad Gateway") {
            setResErr("Опять че то с сервером");
          }
        } else {
          setErrMsg("Ошибка создания команды");
        }
      } else {
        setErrMsg("Нет ответа от сервера");
      }
    }
  };

  return (
    <div className={styles.create_team}>
      <div className={styles.wrapper}>
        <div className={styles.form}>
          <h1>Создание команды</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="teamName">Название команды:</label>
              <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="teamGoal">Цель команды:</label>
              <textarea
                id="teamGoal"
                value={teamGoal}
                onChange={(e) => setteamGoal(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="teamGoal">Описание команды:</label>
              <textarea
                id="teamGoal"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
              />
            </div>
            {/* <div className={styles.field}>
                            <label htmlFor="team_lead">Теги команды:</label>
                            <textarea
                                id="team_lead"
                                value={team_lead}
                                onChange={(e) => setteam_lead(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="numberOfmembers">Количество участников:</label>
                            <input
                                type="number"
                                id="numberOfmembers"
                                value={numberOfmembers}
                                onChange={(e) => setNumberOfmembers(e.target.value)}
                                min={2}
                                max={10}
                                required
                            />
                        </div> */}

            <div className={styles.btns}>
              <button
                className={styles.cancel}
                type="button"
                onClick={handleCancel}
              >
                Отмена
              </button>
              <button className={styles.confirm} type="submit">
                Создать
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamForm;
