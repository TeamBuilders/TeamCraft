import React, { useRef, useState, useEffect, useContext } from "react";
import styles from "./Team.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
// import { API_URL } from '../../api/apiConfig';
import axiosInstance from "../../api/axios";

const EDIT_URL = "/teams/edit";
const REQUIRE_URL = "/team/require/";
const ACCEPT_URL = "/team/acceptRequire/";
const CANCEL_URL = "/team/cancelledRequire/";

export default function Team() {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const location = useLocation();
  const [team, setTeam] = useState(JSON.parse(localStorage.getItem("team")));
  console.log("team: ");
  console.log(team);

  // Проверка на наличие в команде
  const checkIfUserIsMember = (team) => {
    if (team) {
      const userId = JSON.parse(localStorage.getItem("userData")).Id;
      return team.memberTeam.some(
        (member) =>
          member.dataMemberUser && member.dataMemberUserId === parseInt(userId)
      );
    }
  };
  // Проверка на наличие в команде админов
  const checkIfUserIsUPMember = (team) => {
    const userId = JSON.parse(localStorage.getItem("userData")).Id;
    return team.memberTeam.some(
      (member) =>
        member.dataMemberUser &&
        member.dataMemberUserId === parseInt(userId) &&
        member.roleMember !== 0
    );
  };
  // Проверка на наличие в списке заявок
  const checkIfUserInJion = (team) => {
    if (team && team?.jion_means) {
      const userId = JSON.parse(localStorage.getItem("userData")).Id;
      return team.jion_means.some((member) => member.Id === parseInt(userId));
    }
  };

  // Может ли пользователь отправить заявку на вступление в команду
  const [canApply, setCanApply] = useState(!checkIfUserIsMember(team));

  // Отправлена ли заявка на вступление в команду
  const [ApplySubmit, setApplySubmit] = useState(
    team !== null &&
      team !== undefined &&
      team?.jion_means &&
      checkIfUserInJion(team)
  );

  const [ApplyError, setApplyError] = useState("");

  // Запрос на вступление в команду
  const handleApplyClick = async (e) => {
    const jwtToken = localStorage.getItem("token");
    console.log(jwtToken);

    try {
      console.log(
        "Ссылка: " + REQUIRE_URL + JSON.stringify(team.Id || team.id)
      );
      const response = await axiosInstance.post(
        REQUIRE_URL + JSON.stringify(team.Id || team.id),
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;

        console.log("Заявка на вступление подана");
        console.log(data);
        setApplySubmit(true);
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      setApplyError("Корсы или что-то ещё");
    }
  };
  // Принятие участника в команду
  const handleAddMemberClick = async (memberId) => {
    try {
      const jwtToken = localStorage.getItem("token");
      console.log(
        "Ссылка: " +
          ACCEPT_URL +
          JSON.stringify(team.id) +
          "-" +
          JSON.stringify(memberId)
      );
      console.log("jwtToken: " + jwtToken);
      const response = await axiosInstance.post(
        ACCEPT_URL + JSON.stringify(team.id) + "-" + JSON.stringify(memberId),
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
        console.log("Заявка принята");
        console.log("Ответ:")
        console.log(response);
        localStorage.setItem("team", JSON.stringify(response.data));
        setTeam(response.data);
        console.log("Новая команда: ");
        console.log(response.data);
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };
  // Отклонить заявку на вступление в команду
  const handleDeclineClick = async (memberId) => {
    try {
      const jwtToken = localStorage.getItem("token");
      console.log(
        "Ссылка: " +
          CANCEL_URL +
          JSON.stringify(team.id) +
          "-" +
          JSON.stringify(memberId)
      );
      console.log("jwtToken: " + jwtToken);
      const response = await axiosInstance.post(
        CANCEL_URL + JSON.stringify(team.id) + "-" + JSON.stringify(memberId),
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Заявка отклонена");
        console.log("Ответ:")
        console.log(response);
        localStorage.setItem("team", JSON.stringify(response.data));
        setTeam(response.data);
        console.log("Новая команда: ");
        console.log(response.data);
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };

  // Редактирование команды
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Отмена изменений в команде
  const handleCancelClick = () => {
    setIsEditing(false);
    setTeam(JSON.parse(localStorage.getItem("team")));
    console.log("Отмена изменений в команде");
  };

  // Сохранить изменения в команде
  const handleSaveClick = async (e) => {
    e.preventDefault();

    const jwtToken = localStorage.getItem("token");
    const jsonData = team;
    console.log("Адрес: " + EDIT_URL);
    console.log("JSON: " + JSON.stringify(jsonData));
    console.log("jwtToken: " + jwtToken);
    try {
    const response = await axiosInstance.post(EDIT_URL, jsonData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    if (response.status === 200) {
      console.log("Изменения сохранены");
      console.log("Ответ:")
      console.log(response);
      setIsEditing(false);
    }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);

    }

    console.log("Изменения сохранены");
    setIsEditing(false);
  };

  console.log("Проверки:");
  console.log("В команде?: " + checkIfUserIsMember(team));
  console.log("Участник админ?: " + checkIfUserIsUPMember(team));
  console.log("В заявках?: " + checkIfUserInJion(team));
  console.log("Может видеть кнопку заявки? " + canApply);
  console.log("Заявка отправлена?: " + ApplySubmit);
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
                      value={team.teamName}
                      onChange={(e) => setTeam({ ...team, teamName: e.target.value })}
                      required
                    />
                  ) : (
                    <p className={styles.name}>{team.teamName}</p>
                  )}
                  <div className={styles.state}>
                    <div className={styles.circle} id="1"></div>
                    <p className={styles.fullness}>
                      Количество участников: {team.memberTeam.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.player}>
              <h2>Участники</h2>
              <div className={styles.blocks_players}>
                {team.memberTeam.map((member, index) => (
                  <div key={index} className={styles.block_player}>
                    <img
                      src="images/avatar.jpg"
                      alt="player_icon"
                      className={styles.player_icon}
                    />
                    <div className={styles.desc}>
                      <p className={styles.player_title}>
                        {member.dataMemberUser?.name +
                          " " +
                          member.dataMemberUser?.sureName}
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
            {checkIfUserIsUPMember(team) && (
              <div className={styles.applic_member}>
                <h2>Заявки на вступление</h2>
                <div className={styles.applic_member_teams}>
                  {team.jion_means.length === 0 && (
                    <p>Нет заявок на вступление</p>
                  )}
                  {team.jion_means.map((member) => (
                    <div key={member.Id} className={styles.block_player}>
                      <img
                        src="images/avatar.jpg"
                        alt="player_icon"
                        className={styles.player_icon}
                      />
                      <div className={styles.desc}>
                        <p className={styles.player_title}>
                          {member.name + " " + member.sureName}
                        </p>
                        <div className={styles.state}></div>
                      </div>
                      <div className={styles.buttons}>
                        <button
                          className={styles.button_add}
                          onClick={() => handleAddMemberClick(member.id)}
                        >
                          Добавить
                        </button>
                        <button
                          className={styles.button_remove}
                          onClick={() => handleDeclineClick(member.id)}
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
          <div className={styles.info_team}>
            <div className={styles.tag}>
              <p>Цель команды:</p>
              <div className={styles.tag_field}>
                <textarea
                  value={team.teamGoal}
                  className={styles.tags}
                  onChange={(e) => setTeam({ ...team, teamGoal: e.target.value })}
                  name="tags"
                  style={{ fontSize: "15pt" }}
                  rows="3"
                  cols="40"
                  readOnly={!isEditing}
                  required
                ></textarea>
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.info_panel}>
                <p className={styles.inf_title}>Информация о команде</p>
                <textarea
                  value={
                    team.teamDescription === ""
                      ? "Описание отсутствует"
                      : team.teamDescription
                  }
                  onChange={(e) => setTeam({ ...team, teamDescription: e.target.value })}
                  className={styles.inf_p}
                  name="inf-p"
                  style={{ fontSize: "13pt" }}
                  rows="10"
                  cols="40"
                  readOnly={!isEditing}
                  required
                />
              </div>
            </div>

            <div className={styles.info}>
              <div className={styles.info_panel}>
                <p className={styles.inf_title}>Теги:</p>
                <ul className={styles.ul_list_skills}>
                  {team &&
                    team.team_stack?.map((skill, index) => (
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
            <>
              {canApply &&
                !ApplySubmit &&
                ApplyError === "" && (
                  <button className={styles.confirm} onClick={handleApplyClick}>
                    Подать заявку
                  </button>
                )}
              {ApplySubmit && (
                <button className={styles.confirm}>Заявка отправлена</button>
              )}
              {ApplyError && (
                <button className={styles.cancel}>{ApplyError}</button>
              )}
              {/* TODO: Надо изменить условие здесь!!! */}
              {checkIfUserIsUPMember(team) && (
                <button className={styles.edit} onClick={handleEditClick}>
                  Редактировать
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
