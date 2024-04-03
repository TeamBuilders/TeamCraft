import { React, useState, useEffect, useRef } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "../Search/Search.module.css";
import axios from "axios";
import PopUp_hobbies from "../../components/PopUp/PopUp_hobbies/PopUp_hobbies";

const FILTER_URL = "https://a25715-5073.x.d-f.pw/api/teams/filter";
const SKILL_URL = "https://a25715-5073.x.d-f.pw/api/skill/1";

export default function Search() {
  const formRef = useRef(null);
  const handleCancel = () => {
    formRef.current.reset();
  };
  const [listSkills, setListSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Отменяем стандартное поведение отправки формы

    const selectedSkillNames = selectedSkills.map(skill => skill.nameSkill);
    console.log(selectedSkillNames);
    console.log(JSON.stringify({
      skills: selectedSkillNames,
    }));
    try {
      const jsonData = JSON.stringify({
        skills: selectedSkillNames,
      });

      const response = await axios.post(FILTER_URL, jsonData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
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
    } catch (err) {
      console.log(err);
    }

    axios
      .get(SKILL_URL)
      .then((response) => {
        setListSkills(response.data);
      })
      .catch((error) => {
        console.error(error); // обработка ошибок
      });
  };

  useEffect(() => {
    takeSkills();
  }, []);

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
                          setSelectedSkills(prevSkills => [...prevSkills, skill]);
                        } else {
                          setSelectedSkills(prevSkills => prevSkills.filter(prevSkill => prevSkill.id !== skill.id));
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
              />
            </div>
            <div className={styles.cards}>
              <div className={styles.card}>
                <div className={styles.picture}>
                  <img
                    src="../../images/avatar.jpg"
                    alt="Avatar"
                    className={styles.avatar}
                  />
                </div>
                <div className={styles.description2}>
                  <div className={styles.text}></div>
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
