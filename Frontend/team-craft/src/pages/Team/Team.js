import React, { useState, useEffect } from "react";
import styles from "./Team.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useNavigate, useLocation } from "react-router-dom";
// import { API_URL } from '../../api/apiConfig';
import axiosInstance from "../../api/axios";

const EDIT_URL = "/teams/edit";
const REQUIRE_URL = "/team/require/";
const ACCEPT_URL = "/team/acceptRequire/";
const CANCEL_URL = "/team/cancelledRequire/";
const KICK_URL = "/teams/deleteMember/";
const TEAM_URL = "/team/";
const EXIT_URL = "/profile/exitTeam/";

export default function Team() {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [team, setTeam] = useState(JSON.parse(localStorage.getItem("team")));
  const userId = JSON.parse(localStorage.getItem("userData")).id;
  const teamId = team.id;
  const userRole = team.memberTeam.find(
    (member) => member.dataMemberUserId === userId
  )?.roleMember;

  // Обновление данных при перезагрузке страницы
  useEffect(() => {
    const fetchData = async () => {
      console.log("Ссылка: " + TEAM_URL + teamId);
      try {
        const response = await axiosInstance.get(TEAM_URL + teamId);
        console.log(response.data);
        localStorage.setItem("team", JSON.stringify(response.data));
        setTeam(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData(); // Вызываем внутреннюю асинхронную функцию
  }, []);
  
  console.log(team);

  // Проверка на наличие в команде
  const checkIfUserIsMember = (team) => {
    if (team) {
      const userId = JSON.parse(localStorage.getItem("userData")).id;
      return team.memberTeam.some(
        (member) => member.dataMemberUserId === parseInt(userId)
      );
    }
  };
  // Проверка на наличие в команде админов
  const checkIfUserIsUPMember = (team) => {
    return team.memberTeam.some(
      (member) =>
        member.dataMemberUserId === parseInt(userId) && member.roleMember !== 0
    );
  };
  // Проверка на наличие в списке заявок
  const checkIfUserInJion = (team) => {
    if (team && team?.jion_means) {
      const userId = JSON.parse(localStorage.getItem("userData")).id;
      return team.jion_means.some((member) => member.id === parseInt(userId));
    }
  };

  // Может ли пользователь отправить заявку на вступление в команду
  const [canApply, setCanApply] = useState(!checkIfUserIsMember(team));
  // Отправлена ли заявка на вступление в команду
  const [ApplySubmit, setApplySubmit] = useState(
    team?.jion_means && checkIfUserInJion(team) && !checkIfUserIsMember(team)
  );

  const [ApplyError, setApplyError] = useState("");

  // Запрос на вступление в команду
  const handleApplyClick = async (e) => {
    const jwtToken = localStorage.getItem("token");
    try {
      const response = await axiosInstance.post(
        REQUIRE_URL + JSON.stringify(team.id),
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

        setApplySubmit(true);
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      setApplyError(error.response.data?.message);
    }
  };
  const [isExiting, setIsExiting] = useState(false);
  const handleExitClick = async (e) => {
    const jwtToken = localStorage.getItem("token");

    try {
      const response = await axiosInstance.post(
        EXIT_URL + JSON.stringify(team.id),
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
        setIsExiting(true);
        localStorage.setItem("team", JSON.stringify(response.data));
        setTeam(response.data);
        setApplySubmit(false);
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      setApplyError(error.response.data?.message);
    }
  };
  // Принятие участника в команду
  const handleAddMemberClick = async (memberId) => {
    try {
      const jwtToken = localStorage.getItem("token");
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
        localStorage.setItem("team", JSON.stringify(response.data));
        setTeam(response.data);
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };
  // Отклонить заявку на вступление в команду
  const handleDeclineClick = async (memberId) => {
    try {
      const jwtToken = localStorage.getItem("token");
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
        localStorage.setItem("team", JSON.stringify(response.data));
        setTeam(response.data);
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
    setEditError("");
    setIsEditing(false);
    setTeam(JSON.parse(localStorage.getItem("team")));
  };

  const [editError, setEditError] = useState("");
  // Сохранить изменения в команде
  const handleSaveClick = async (e) => {
    e.preventDefault();

    const jwtToken = localStorage.getItem("token");
    const jsonData = team;
    try {
      const response = await axiosInstance.post(EDIT_URL, jsonData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (response.status === 200) {
        localStorage.setItem("team", JSON.stringify(response.data));
        setTeam(response.data);
        setIsEditing(false);
        setEditError("");
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      setTeam(JSON.parse(localStorage.getItem("team")));
      if (error.response.status === 400) {
        setEditError(error.response.data.message);
      }
    }
  };
  // Kick
  const handleKickClick = async (memberId) => {
    const jwtToken = localStorage.getItem("token");
    try {
      const response = await axiosInstance.post(
        KICK_URL + JSON.stringify(team.id) + "-" + JSON.stringify(memberId),
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (response.status === 200) {
        localStorage.setItem("team", JSON.stringify(response.data));
        setTeam(response.data);
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };

  // Переход на страницу профиля по клику на него
  const handleUserClick = (user) => {
    if (user.id === JSON.parse(localStorage.getItem("userData")).id) {
      navigate(`/profile`);
    } else {
      navigate(`/profile/${user.id}`, { state: user });
    }
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
                      value={team.teamName}
                      onChange={(e) =>
                        setTeam({ ...team, teamName: e.target.value })
                      }
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
                  <div
                    key={index}
                    className={styles.block_player}
                    onClick={() => handleUserClick(member.dataMemberUser)}
                  >
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

                    {userRole === 2 && userId !== member.dataMemberUserId && (
                      <div className={styles.kick}>
                        <button
                          className={styles.button_kick}
                          onClick={() => handleKickClick(member.id)}
                        >
                          Кикнуть
                        </button>
                      </div>
                    )}
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
                    <div key={member.id} className={styles.block_player}>
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
            {/* Переход на страницу поиска */}
            {checkIfUserIsUPMember(team) && (
              <div className={styles.find}>
                <button
                  className={styles.button_find}
                  onClick={() => navigate(`/find`)}
                >
                  {" "}
                  Пригласить{" "}
                </button>
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
                  onChange={(e) =>
                    setTeam({ ...team, teamGoal: e.target.value })
                  }
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
                  value={team.teamDescription}
                  onChange={(e) =>
                    setTeam({ ...team, teamDescription: e.target.value })
                  }
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
                !checkIfUserIsMember(team) &&
                ApplyError === "" && (
                  <button className={styles.confirm} onClick={handleApplyClick}>
                    Подать заявку
                  </button>
                )}
              {ApplySubmit &&
              !checkIfUserIsMember(team) && (
                <button className={styles.confirm}>Отправлено</button>
              )}
              {ApplyError && (
                <button className={styles.cancel}>{ApplyError}</button>
              )}
              {checkIfUserIsUPMember(team) && (
                <button className={styles.edit} onClick={handleEditClick}>
                  Редактировать
                </button>
              )}
              {checkIfUserIsMember(team) &&
                !checkIfUserIsUPMember(team) &&
                !isExiting && (
                  <button className={styles.exit} onClick={handleExitClick}>
                    Покинуть команду
                  </button>
                )}
            </>
          )}
          {editError && (
            <div className={styles.editError}>
              <p>{editError}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
