import React, { useRef, useState, useEffect, useContext } from "react";
import styles from "./Team.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { API_URL } from '../../api/apiConfig';
import axiosInstance from "../../api/axios";

const EDIT_URL = "/teams/edit";

export default function Team() {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [teamName, setTeamName] = useState(
    localStorage.getItem("teamName") || ""
  );
  const [teamGoal, setTeamGoal] = useState(
    localStorage.getItem("teamGoal") || ""
  );
  const [teamDescription, setTeamDescription] = useState(
    localStorage.getItem("teamDescription") || ""
  );
  const [teamMembers, setTeamMembers] = useState(
    localStorage.getItem("MemberTeam") || []
  );
  const [teamSkills, setTeamSkills] = useState(
    localStorage.getItem("team_stack") || []
  );
  const [numberOfmembers, setNumberOfmembers] = useState(
    JSON.parse(localStorage.getItem("MemberTeam")).length
  );

  const [errMsg, setErrMsg] = useState("");
  const [error, setError] = useState("");

  console.log(teamSkills);
  console.log(teamMembers);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setTeamName(localStorage.getItem("teamName") || "");
    setTeamGoal(localStorage.getItem("teamGoal") || "");

    setError("");
  };

  const handleSaveClick = async (e) => {
    if (!teamName.trim() || !teamGoal.trim()) {
      setError("Пожалуйста, заполните все поля");
      return;
    }
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    const team_lead = user;
    const userData = JSON.parse(localStorage.getItem("userData"));

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
      const response = await axiosInstance.post(EDIT_URL, jsonData, {
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

  return (
    <div className={styles.team_page}>
      <Header />
      <div className={styles.bgcolor}>
        <div className={styles.description}>
          <div className={styles.team_profile_player}>
            <div className={styles.team}>
              <h2>Команда</h2>
              <div className={styles.acc_panel}>
                <img
                  src="../../images/csgo.ico"
                  alt="Avatar"
                  className={styles.avatar}
                />
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
                    <p className={styles.fullness}>
                      Количество участников: {numberOfmembers}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.player}>
              <h2>Участники</h2>
              <div className={styles.blocks_players}>
                {JSON.parse(teamMembers).map((member) => (
                  <div key={member.Id} className={styles.block_player}>
                    <img
                      src="images/avatar.jpg"
                      alt="player_icon"
                      className={styles.player_icon}
                    />
                    <div className={styles.desc}>
                      <p className={styles.player_title}>
                        {member.dataMemberUser.name}
                      </p>
                      <div className={styles.state}>
                        <p className={styles.fullness}>
                          {member.roleMember === 0
                            ? "Участник"
                            : member.roleMember === 1
                            ? "Админ"
                            : member.roleMember === 2
                            ? "Создатель"
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.applic_member}>
              <h2>Заявки на вступление</h2>
              <div className={styles.applic_member_teams}>
                <div className={styles.block_player}>
                  <img
                    src="images/avatar.jpg"
                    alt="player_icon"
                    className={styles.player_icon}
                  />
                  <div className={styles.desc}>
                    <p className={styles.player_title}>Никнейм</p>
                    <div className={styles.state}></div>
                  </div>
                  <div className={styles.buttons}>
                    <button className={styles.button_add}>Добавить</button>
                    <button className={styles.button_remove}>Отклонить</button>
                  </div>
                </div>
                <div className={styles.block_player}>
                  <img
                    src="images/avatar.jpg"
                    alt="player_icon"
                    className={styles.player_icon}
                  />
                  <div className={styles.desc}>
                    <p className={styles.player_title}>Никнейм</p>
                    <div className={styles.state}></div>
                  </div>
                  <div className={styles.buttons}>
                    <button className={styles.button_add}>Добавить</button>
                    <button className={styles.button_remove}>Отклонить</button>
                  </div>
                </div>
                <div className={styles.block_player}>
                  <img
                    src="images/avatar.jpg"
                    alt="player_icon"
                    className={styles.player_icon}
                  />
                  <div className={styles.desc}>
                    <p className={styles.player_title}>Никнейм</p>
                    <div className={styles.state}></div>
                  </div>
                  <div className={styles.buttons}>
                    <button className={styles.button_add}>Добавить</button>
                    <button className={styles.button_remove}>Отклонить</button>
                  </div>
                </div>
                <div className={styles.block_player}>
                  <img
                    src="images/avatar.jpg"
                    alt="player_icon"
                    className={styles.player_icon}
                  />
                  <div className={styles.desc}>
                    <p className={styles.player_title}>Никнейм</p>
                    <div className={styles.state}></div>
                  </div>
                  <div className={styles.buttons}>
                    <button className={styles.button_add}>Добавить</button>
                    <button className={styles.button_remove}>Отклонить</button>
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
                  style={{ fontSize: "15pt" }}
                  rows="3"
                  cols="40"
                  required
                ></textarea>
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.info_panel}>
                <p className={styles.inf_title}>Информация о команде</p>
                {teamDescription || isEditing ? (
                  <textarea
                    value={teamDescription}
                    className={styles.inf_p}
                    name="inf-p"
                    style={{ fontSize: "13pt" }}
                    rows="10"
                    cols="40"
                    readOnly={!isEditing}
                    required
                  />
                ) : (
                  <p style={{ fontSize: "13pt" }}>Отсутствует</p>
                )}
              </div>
            </div>

            <div className={styles.info}>
              <div className={styles.info_panel}>
                <p className={styles.inf_title}>Навыки команды:</p>
                <ul className={styles.ul_list_skills}>
                  {teamSkills &&
                    JSON.parse(teamSkills).map((skill, index) => (
                      <div className={styles.skillWrapper} key={index}>
                        <li className={styles.li_item_skills} key={index}>
                          {skill.nameSkill}
                        </li>
                      </div>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.btns}>
          {isEditing ? (
            <div>
              <button className={styles.cancel} onClick={handleCancelClick}>
                Отмена
              </button>
              <button className={styles.confirm} onClick={handleSaveClick}>
                Сохранить
              </button>
            </div>
          ) : (
            <button className={styles.edit} onClick={handleEditClick}>
              Редактировать
            </button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
