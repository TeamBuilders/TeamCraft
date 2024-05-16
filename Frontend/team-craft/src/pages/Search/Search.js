import { React, useState, useEffect, useRef } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "../Search/Search.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { API_URL } from "../../api/apiConfig";
import axiosInstance from "../../api/axios";

// const TEAMS_URL = "/teams"; разные регистры - издевательсвто
const FILTER_URL = "/teams/filter";
const SKILL_URL = "/skill/1";

export default function Search() {
  const navigate = useNavigate();
const [teams, setTeams] = useState([]);


  const formRef = useRef(null);
  const handleCancel = () => {
    formRef.current.reset();
    setSelectedSkills([]);

    const checkboxes = formRef.current.querySelectorAll(
      'input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    setFoundTeams(teams);
  };

  const [listSkills, setListSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [foundTeams, setFoundTeams] = useState([]);

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
        setFoundTeams(response.data);
        const foundTeams = response.data;
        console.log(foundTeams);
        // localStorage.setItem("foundTeams", JSON.stringify(foundTeams));
      }
    } catch (err) {
      console.error("Ошибка при отправке запроса:", err);
    }
  };
  const takeTeams = async () => {
    const jsonData = JSON.stringify([]);

      const response = await axiosInstance.post(FILTER_URL, jsonData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
  };

  const takeSkills = async () => {
    const response = await axiosInstance.get(SKILL_URL);
    return response.data;
  };

  useEffect(() => {
    const fetchData = async () => {
        try {
            const teamsData = await takeTeams();
            setTeams(teamsData);
            setFoundTeams(teamsData);
            console.log(teamsData);

            const dataSkills = await takeSkills();
            setListSkills(dataSkills);
        } catch (error) {
            console.error(error);
        }
    };

    fetchData();
}, []);
  const handleTeamClick = (team) => {
    localStorage.setItem("team", JSON.stringify(team));
    navigate(`/team/${team.teamName}`);
  };
  return (
    <div className={styles.search_page}>
      <Header />
      <div className={styles.grid_container}>
      <div className={styles.filter}>
            <form onSubmit={handleSubmit} ref={formRef}>
              <div className={styles.form}>
                <h3>Навыки</h3>
                {listSkills.map((skill, index) => (
                  <label key={index} className={styles.checkbox_btn}>
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
          <div className={styles.search_card}>
            <div className={styles.cards}>
            {foundTeams.map((team, index) => (
              <div key={index} className={styles.card} onClick={() => handleTeamClick(team)}>
                <div style={{ width: "min-content" }}>
                  <div className={styles.card_block}>
                    <div className={styles.picture}>
                      <img className={styles.avatar} />
                    </div>
                    <div className={styles.description2}>
                      <div className={styles.team_name}>
                        <p className={styles.team_name_text}>{team.teamName}</p>
                      </div>
                      <div className={styles.team_goal}>
                        <p className={styles.team_goal_text}>
                          <span>Цель</span>: {team.teamGoal}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.team_stack}>
                    {team.team_stack.map((skill, index) => (
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
