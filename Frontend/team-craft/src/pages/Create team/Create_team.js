import React, { useState } from "react";
import styles from "./Create_team.module.css";
import { useNavigate } from "react-router-dom";
import PopUpHobby from "../../components/PopUp_Team/PopUp_hobby/PopUp_hobby";
import axiosInstance from "../../api/axios";

const CREATE_TEAM_URL = "/teams/create";
const CreateTeamForm = () => {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [teamGoal, setteamGoal] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamStack, setTeamStack] = useState([]);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Формируем итоговый объект JSON
    const jsonData = JSON.stringify({
      teamName: teamName,
      teamGoal: teamGoal,
      team_stack: teamStack,
      teamDescription: teamDescription, // необязательное поле
    });

    try {
      const jwtToken = localStorage.getItem("token");
      const response = await axiosInstance.post(CREATE_TEAM_URL, jsonData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.status === 200) {
        // Преобразование объекта в JSON
        const team = response.data;

        localStorage.setItem("team", JSON.stringify(team));
        navigate(`/team/${team.teamName}`);
      }
    } catch (err) {
      console.error("Ошибка при отправке запроса:", err);
      if (err.response) {
        console.log(err.response.status);
        console.log(err.response.data);
      }
    }
  };

  const toggleModal = () => {
    const prevTeamStack = JSON.parse(localStorage.getItem("team_stack"));
    const newTeamStack = prevTeamStack.map((item) => JSON.parse(item));
    setTeamStack(newTeamStack);
  };

  return (
    <div className={styles.create_team}>
      <div className={styles.wrapper}>
        <div className={styles.form}>
          <h1>Создание команды</h1>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className={styles.field}>
              <label htmlFor="teamName">Название команды*</label>
              <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="teamGoal">Цель команды*</label>
              <textarea
                id="teamGoal"
                value={teamGoal}
                onChange={(e) => setteamGoal(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="teamGoal">Описание команды</label>
              <textarea
                id="teamGoal"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="teamGoal">Навыки команды*</label>

              <PopUpHobby onClose={toggleModal} />
              <ul className={styles.ul_list}>
                {teamStack &&
                  teamStack.length > 0 &&
                  teamStack.map((skill, index) => (
                    <li className={styles.li_item} key={index}>
                      {skill.nameSkill}
                    </li>
                  ))}
              </ul>
            </div>

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
