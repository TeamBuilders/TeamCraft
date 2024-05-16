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
const DECLINE_URL = "/team/decline/";

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
    localStorage.getItem("teamDescription") || "Описание отсутствует"
  );
  const [teamMembers, setTeamMembers] = useState(
    localStorage.getItem("MemberTeam") || []
  );
  console.log("teamMembers: ");
  console.log(teamMembers);
  const [teamSkills, setTeamSkills] = useState(
    localStorage.getItem("team_stack") || []
  );

  const location = useLocation();
  const [team, setTeam] = useState(location.state?.team);

  // useEffect(() => {
  //   if (team) {
  //     setTeamName(team.teamName);
  //     setTeamGoal(team.teamGoal);
  //     setTeamDescription(team.teamDescription || "Описание отсутствует");
  //     setTeamMembers(JSON.stringify(team.memberTeam));
  //     setTeamSkills(JSON.stringify(team.team_stack));
  //   }
  // }, [team]);

  const checkIfUserIsMember = (team) => {
    if (team == undefined) {
      return false;
    }
    if (team) {
      const userId = JSON.parse(localStorage.getItem("userData")).Id;
      console.log("Проверка на наличие в команде, айди пользователя: " + userId);
      console.log("Пользователь:");
      console.log(JSON.parse(localStorage.getItem("userData")));

      return team.memberTeam.some(
        (member) => member.dataMemberUserId === parseInt(userId)
      );
    }
  };

  const checkIfUserInJion = (team) => {
    if (team == undefined) {
      return false;
    }
    if (team && team?.jion_means) {
      const userId = JSON.parse(localStorage.getItem("userData")).Id;
      console.log("Эта часть JIONMEANS работает, айди: " + userId);
      console.log(team?.jion_means);
      return team.jion_means.some(
        (member) => member.Id === parseInt(userId)
      );
    }
  };
  const checkIfUserIsUPMember = (team) => {
    if (!team || !team.memberTeam) {
        return false;
    }
    
    const userId = JSON.parse(localStorage.getItem("userData")).Id;
    
    return team.memberTeam.some(
        (member) => member.dataMemberUserId === parseInt(userId) && member.roleMember !== 0
    );
};



  const [canApply, setCanApply] = useState(
    team !== null &&
      team !== undefined &&
      team?.memberTeam &&
      !checkIfUserIsMember(team)
  );
  console.log("Проверка на наличие в команде: " + checkIfUserIsMember(team));
  console.log("Проверка на наличие в команде админов: " + checkIfUserIsUPMember(team));
  console.log("Проверка на наличие в списке заявок: " + checkIfUserInJion(team));
  console.log("canApply: " + canApply);
  console.log("team: ");
  console.log(team);
  console.log("team?.memberTeam: ");
  console.log(team?.memberTeam);

  const [errMsg, setErrMsg] = useState("");
  const [error, setError] = useState("");

  const [ApplySubmit, setApplySubmit] = useState(team !== null &&
    team !== undefined &&
    team?.jion_means && checkIfUserInJion(team));

  console.log("ApplySubmit: " + ApplySubmit);
  const [ApplyError, setApplyError] = useState("");

  const handleApplyClick = async (e) => {
    const jwtToken = localStorage.getItem("token");
    console.log(jwtToken);

    try {
      console.log("Ссылка: " + REQUIRE_URL + JSON.stringify(team.Id || team.id));
      const response = await axiosInstance.post(REQUIRE_URL + JSON.stringify(team.Id || team.id), null, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.status === 200) {
        // Преобразование объекта в JSON
        const data = response.data;

        console.log("Заявка на вступление подана");
        console.log(data);
        setApplySubmit(true);
        // navigate("/team/" + data.teamName);
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      setApplyError("Корсы или что-то ещё")
    }
  };
  // Принятие участника в команду
  const handleAddMemberClick = async (memberId) => {
    try {
      const jwtToken = localStorage.getItem("token");
      console.log("Ссылка: " + ACCEPT_URL + JSON.stringify(team.Id) + '-' + JSON.stringify(memberId));
      console.log("jwtToken: " + jwtToken);
      const response = await axiosInstance.post(
        ACCEPT_URL + JSON.stringify(team.Id) + '-' + JSON.stringify(memberId), null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
  
      if (response.status === 200) {
        // Обработка успешного ответа
        console.log("Заявка принята успешно");
        setTeam(response.data);
        console.log("new team: ");
        console.log(team);
        // Обновить страницу
        // Дополнительные действия, если необходимо
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      // Обработка ошибки
    }
  };

  
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
                    <>
                      {team ? (
                        <p className={styles.name}>{team.teamName}</p>
                      ) : (
                        <p className={styles.name}>{teamName}</p>
                      )}
                    </>
                  )}
                  <div className={styles.state}>
                    <div className={styles.circle} id="1"></div>
                    <p className={styles.fullness}>
                      Количество участников:{" "}
                      {team
                        ? team.memberTeam.length
                        : JSON.parse(localStorage.getItem("MemberTeam")).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.player}>
              <h2>Участники</h2>
              <div className={styles.blocks_players}>
                {team ? (
                  team.memberTeam.map((member, index) => (
                    <div key={index} className={styles.block_player}>
                      <img
                        src="images/avatar.jpg"
                        alt="player_icon"
                        className={styles.player_icon}
                      />
                      <div className={styles.desc}>
                        <p className={styles.player_title}>
                          {member.dataMemberUser.name + " " + member.dataMemberUser.sureName}
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
                  ))
                ) : (
                  <>
                    {JSON.parse(teamMembers).map((member) => (
                      <div key={member.Id} className={styles.block_player}>
                        <img
                          src="images/avatar.jpg"
                          alt="player_icon"
                          className={styles.player_icon}
                        />
                        <div className={styles.desc}>
                          <p className={styles.player_title}>
                            {member.dataMemberUser.name + " " + member.dataMemberUser.sureName}
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
                  </>
                )}
              </div>
            </div>
            {(!team || checkIfUserIsUPMember(team)) && (
              <div className={styles.applic_member}>
                <h2>Заявки на вступление</h2>
                <div className={styles.applic_member_teams}>
                  {(team?.jion_means.length === 0 || team?.jion_means.length === undefined) && (
                    <p>Нет заявок на вступление</p>
                  )} 
                  {team?.jion_means.map((member) => (
                    <div key={member.Id} className={styles.block_player}>
                      <img
                        src="images/avatar.jpg"
                        alt="player_icon"
                        className={styles.player_icon}
                      />
                      <div className={styles.desc}>
                        <p className={styles.player_title}>{member.name + " " + member.sureName}</p>
                        <div className={styles.state}></div>
                      </div>
                      <div className={styles.buttons}>
                        <button className={styles.button_add} onClick={() => handleAddMemberClick(member.Id)}>Добавить</button>
                        <button className={styles.button_remove}>
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
                  value={team ? team.teamGoal : teamGoal}
                  className={styles.tags}
                  onChange={(e) => setTeamGoal(e.target.value)}
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
                    team
                      ? team.teamDescription === ""
                        ? "Описание отсутствует"
                        : team.teamDescription
                      : teamDescription
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
                  {team
                    ? team.team_stack.map((skill, index) => (
                        <div className={styles.skillWrapper} key={index}>
                          <li className={styles.li_item_skills} key={index}>
                            {skill.nameSkill}
                          </li>
                        </div>
                      ))
                    : JSON.parse(teamSkills).map((skill, index) => (
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
              {/* Условное отображение кнопки "Подать заявку на вступление" */}
              {canApply && !checkIfUserIsMember(team) && !ApplySubmit && ApplyError === "" && (
                <button className={styles.confirm} onClick={handleApplyClick}>
                  Подать заявку
                </button>
              )}
              {ApplySubmit && (
                <button className={styles.confirm}>
                  Заявка отправлена
                </button>
              )}
              {ApplyError && (
                <button className={styles.cancel}>
                  {ApplyError}
                </button>
              )}
              {/* TODO: Надо изменить условие здесь!!! */}
              {!canApply && (
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
