import { React, useState, useEffect, useRef } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "../Search/Search.module.css";
import axios from "axios";
import { API_URL } from "../../api/apiConfig";

const TEAMS_URL = API_URL + '/teams';
const FILTER_URL = API_URL + "/teams/filter";
const SKILL_URL = API_URL + "/skill/1";

export default function Search() {

  const [teams, setTeams] = useState([]);

  const takeTeams = async (e) => {
    try {
    } catch (err) {
      console.log(err);
    }

    axios
      .get(TEAMS_URL)
      .then((response) => {
        setTeams(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error); // обработка ошибок
      });
  };

  useEffect(() => {
    takeTeams();
  }, []);

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
  };

  const [listSkills, setListSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Выбранные имена скилов: ", selectedSkills);
    
    try {
      const jsonData = JSON.stringify(selectedSkills); 
      console.log("Запрос: ", jsonData);

      const response = await axios.post(FILTER_URL, jsonData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        console.log(response.data);
        const foundTeams = response.data;
        console.log(foundTeams);
        localStorage.setItem("foundTeams", JSON.stringify(foundTeams));
      }
    } catch (err) {
      console.error("Ошибка при отправке запроса:", err);
    }
  };

  const takeSkills = async (e) => {
    try {
      axios
      .get(SKILL_URL)
      .then((response) => {
        setListSkills(response.data);
        console.log("Один элемент JSON: ", listSkills[0]);
        console.log("Взяли список скилов: ", listSkills.map(s => JSON.stringify (s)));
      })
      .catch((error) => {
        console.error(error); // обработка ошибок
      });
    } catch (err) {
      console.log(err);
    }

    
  };

  useEffect(() => {
    takeSkills();
  }, []);
  localStorage.setItem(
    "team_stack",
    JSON.stringify(["Asp Net Core","CSS","JavaScript","Python","MySql"])
  );
  const team_stack = JSON.parse(localStorage.getItem("team_stack"));
  return (
    <div className={styles.search_page}>
      <Header />
      <div className={styles.bgcolor}>
        <div className={styles.description}>
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
          <div className={styles.search_card}>
            <div className={styles.td}>
              <input
                type="search"
                className={styles.search}
                placeholder="Поиск"
                value={selectedSkills
                  .map((skill) => skill.nameSkill)
                  .join(", ")}
              />
            </div>
            <div className={styles.cards}>
              <div className={styles.card}>
                
              <div style={{ width: 'min-content'}}>
                <div className={styles.card_block}>
                  <div className={styles.picture}>
                    <img className={styles.avatar} />
                  </div>
                  <div className={styles.description2}>
                    <div className={styles.team_name}>
                      <p className={styles.team_name_text}>
                        {/*foundTeams[0].teamName*/}Название команды
                      </p>
                    </div>
                    <div className={styles.team_goal}>
                      <p className={styles.team_goal_text}>
                        <span>Цель</span>: {/*foundTeams[0].teamGoal*/} Цель команды и всё такое 
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.team_stack}>
                  {team_stack.map((skill, index) => (
                    <div
                      key={index}
                      className={`${styles.skill} ${
                        selectedSkills.map((s) => s.nameSkill).includes(skill)
                          ? styles.match
                          : ""
                      }`}
                    >
                      <p>{skill}</p>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
