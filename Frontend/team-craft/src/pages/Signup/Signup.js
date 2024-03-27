import React, { useEffect, useState } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import axios from "../../api/axios";

const USER_REGEX = /^[a-zA-Zа-яА-Я0-9-_]{6,16}$/;
const PWD_REGEX =
  /^(?=.*[a-zа-я])(?=.*[A-ZА-Я])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,24}$/;
const NAME_REGEX = /^[a-zA-Zа-яА-Я]{2,16}$/;
const REGISTER_URL = "https://a25715-5073.x.d-f.pw/api/register";

const Signup = () => {
  const [login, setLogin] = useState("");
  const [validLogin, setValidLogin] = useState(false);
  const [loginFocus, setLoginFocus] = useState(false);
  const [loginErr, setLoginErr] = useState("");

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [pwdErr, setPwdErr] = useState("");

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchPwdFocus, setMatchPwdFocus] = useState(false);

  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [nameErr, setNameErr] = useState("");

  const [surname, setSurname] = useState("");
  const [validSurname, setValidSurname] = useState(false);
  const [surnameErr, setSurnameErr] = useState("");

  const [birth_date, setBirth_date] = useState("");
  const [birth_dateErr, setBirth_dateErr] = useState("");

  const [gender, setGender] = useState("male");
  const [user_contacts, setUser_contacts] = useState("");

  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  useEffect(() => {
    const result = USER_REGEX.test(login);
    console.log(result, login);
    setValidLogin(result);
    console.log("Валидация логина: ", validLogin);
  }, [login]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    console.log("Валидация пароля: ", validPwd);
  }, [pwd]);

  // Match password
  useEffect(() => {
    const result = matchPwd === pwd;
    setValidMatch(result);
  }, [matchPwd]);

  
  useEffect(() => {
    const result = NAME_REGEX.test(name);
    setValidName(result);
    console.log("Валидация имени: ", validName);
    console.log(result, name);
  }, [name]);

  useEffect(() => {
    const result = NAME_REGEX.test(surname);
    setValidSurname(result);
    console.log("Валидация фамилии: ", validSurname);
    console.log(result, surname);
  }, [surname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jsonData = JSON.stringify({
        login,
        password: pwd,
        gender,
        name,
        sureName: surname,
        birthday: birth_date,
        contact: user_contacts,
      });
      console.log(jsonData);
      const response = await axios.post(REGISTER_URL, jsonData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: false,
      });
      console.log(response?.status);
      console.log(JSON.stringify(response?.data));
      console.log("Успешно!", response);
      navigate("/login");

      // successful addition
    } catch (err) {
      // "User = null"
      // "Not all required fields are filled in!"
      // "Inccorect login user. Size or have special symbols"
      // "Inccorect password: length, no number or special symbols"
      // "Inccorect name user. Size or have special symbols or numbers"
      // "Inccorect surname user. Size or have special symbols or numbers"
      // "Юзер либо еще не родился, либо уже умер, в любом случае все по новой"
      // "Такой логин уже есть"

      // setErrMsg(err.response?.data.message);

      console.log(err.response);
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        for (let i = 0; i < err.response?.data.message.length; i++) {
          const msg = err.response?.data.message[i];
          if (
            msg === "Inccorect login user. Size or have special symbols" ||
            msg === "Такой логин уже есть"
          ) {
            setValidLogin(false);
            setLoginErr(msg);
          }
          if (
            msg === "Inccorect password: length, no number or special symbols"
          ) {
            setValidPwd(false);
            setPwdErr(msg);
          }
          if (
            msg ===
            "Inccorect name user. Size or have special symbols or numbers"
          ) {
            setValidName(false);
            setNameErr(msg);
          }
          if (
            msg ===
            "Inccorect surname user. Size or have special symbols or numbers"
          ) {
            setValidSurname(false);
            setSurnameErr(msg);
          }
          if (
            msg ===
            "Юзер либо еще не родился, либо уже умер, в любом случае все по новой"
          ) {
            setBirth_dateErr("Incorrect date of birth");
          }
        }
        setErrMsg(err.response?.data.message);
      } else {
        setErrMsg("Registration Failed");
      }
    }
  };
  return (
    <div className={styles.signup_body}>
      <signup>
        <div className={styles.wrapper}>
          <div className={styles.form}>
            <h1>Регистрация</h1>

            <form onSubmit={handleSubmit}>
              <div className={styles.field}>
                {/* ЛОГИН */}
                <label htmlFor="login" className={styles.labelWithIcon}>
                  логин<span> </span>
                  <span className={validLogin ? styles.valid : styles.hide}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span
                    className={
                      validLogin || !login ? styles.hide : styles.invalid
                    }
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </label>

                <input
                  type="text"
                  id="login"
                  autoComplete="off"
                  onChange={(e) => {
                    setLogin(e.target.value);
                    setLoginErr("");
                  }}
                  value={login}
                  required
                  aria-invalid={validLogin ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setLoginFocus(true)}
                  onBlur={() => setLoginFocus(false)}
                />
                <p
                  id="uidnote"
                  className={
                    loginFocus && login && !validLogin
                      ? styles.instrucions
                      : styles.offscreen
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span> </span>
                  6 to 16 characters. <br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
                <p
                  className={loginErr ? styles.errmsg : styles.offscreen}
                  aria-live="assertive"
                >
                  {loginErr}
                </p>
              </div>

              {/* ПАРОЛЬ */}
              <div className={styles.field}>
                <label htmlFor="password">
                  пароль <span> </span>
                  <span className={validPwd ? styles.valid : styles.hide}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span
                    className={validPwd || !pwd ? styles.hide : styles.invalid}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </label>
                <input
                  type="password"
                  id="password"
                  onChange={(e) => {
                    setPwd(e.target.value);
                    setPwdErr("");
                  }}
                  required
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                />
                <p
                  id="pwdnote"
                  className={
                    pwdFocus && !validPwd
                      ? styles.instrucions
                      : styles.offscreen
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span> </span>
                  6 to 16 characters. <br />
                  Must include uppercase and lowercase letters, a numbers and a
                  special character. <br />
                  Allowed special characters:!@#$%^&*
                </p>
                <p
                  className={pwdErr ? styles.errmsg : styles.offscreen}
                  aria-live="assertive"
                >
                  {pwdErr}
                </p>
              </div>

              <div className={styles.field}>
                <label htmlFor="confirmPassword">
                  подтвердите пароль <span> </span>
                  <span
                    className={
                      validMatch && matchPwd ? styles.valid : styles.hide
                    }
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span
                    className={
                      validMatch || !matchPwd ? styles.hide : styles.invalid
                    }
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchPwdFocus(true)}
                  onBlur={() => setMatchPwdFocus(false)}
                />
                <p
                  id="confirmnote"
                  className={
                    matchPwdFocus && !validMatch
                      ? styles.instrucions
                      : styles.offscreen
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span> </span>
                  Must match the first password input field.
                </p>
              </div>
              <div className={styles.field}>
                <label htmlFor="name">
                  имя<span> </span>
                  <span className={validName ? styles.valid : styles.hide}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span
                    className={
                      validName || !name ? styles.hide : styles.invalid
                    }
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameErr("");
                  }}
                  required
                />
                <p
                  className={nameErr ? styles.errmsg : styles.offscreen}
                  aria-live="assertive"
                >
                  {nameErr}
                </p>
              </div>

              <div className={styles.field}>
                <label htmlFor="surname">
                  фамилия<span> </span>
                  <span className={validSurname ? styles.valid : styles.hide}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span
                    className={
                      validSurname || !surname ? styles.hide : styles.invalid
                    }
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </label>
                <input
                  type="text"
                  id="surname"
                  onChange={(e) => {
                    setSurname(e.target.value);
                    setSurnameErr("");
                  }}
                  required
                />
                <p
                  className={surnameErr ? styles.errmsg : styles.offscreen}
                  aria-live="assertive"
                >
                  {surnameErr}
                </p>
              </div>

              <div className={styles.field}>
                <label htmlFor="birth_date">дата рождения</label>
                <input
                  type="date"
                  id="birth_date"
                  onChange={(e) => {
                    setBirth_date(e.target.value);
                    setBirth_dateErr('');
                  }}
                  required
                />
                <p
                  className={birth_dateErr ? styles.errmsg : styles.offscreen}
                  aria-live="assertive"
                >
                  {birth_dateErr}
                </p>
              </div>
              <div className={styles.field_dropdown}>
                <label htmlFor="optns">пол</label>
                <div className={styles.select_container}>
                  <select
                    type="select"
                    id="optns"
                    defaultValue={"male"}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="male">мужской</option>
                    <option value="female">женский</option>
                    <option value="helicopter">боевой вертолет</option>
                  </select>
                </div>
              </div>

              <div className={styles.field_textarea}>
                <label htmlFor="user_contacts">контакты</label>
                <textarea
                  id="user_contacts"
                  type="text"
                  rows="4"
                  cols="50"
                  onChange={(e) => setUser_contacts(e.target.value)}
                ></textarea>
              </div>
              <p className={styles.text}>
                    Есть аккаунт? <Link to="/login" className={styles.log_button}>Войти</Link>
                </p>
              <div className={styles.btns}>
                <button
                  className={`${styles.cancel}`}
                  type="button"
                  id="cancel"
                  onClick={handleCancel}
                >
                  Отмена
                </button>
                <button
                  className={`${styles.confirm}`}
                  type="submit"
                  id="confirm"
                >
                  Завершить
                </button>
              </div>
            </form>
          </div>
        </div>
      </signup>
    </div>
  );
};
export default Signup;
