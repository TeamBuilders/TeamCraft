import React, { useRef, useEffect, useState } from "react";
import { faCheck, faTimes, faInfoCircle, faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import axios from "../../api/axios";

const USER_REGEX = /^[a-zA-Zа-яА-Я][a-zA-Zа-яА-Я0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-zа-я])(?=.*[A-ZА-Я])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,24}$/;
const REGISTER_URL = 'https://a25581-9d46.w.d-f.pw/api/register'

const Signup = () => {
    const loginRef = useRef();
    const errRef = useRef();

    const [login, setLogin] = useState('');
    const [validLogin, setValidLogin] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    
    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);

    const [loginFocus, setLoginFocus] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);
    const [matchPwdFocus, setMatchPwdFocus] = useState(false);
    
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [birth_date, setBirth_date] = useState('');
    const [gender, setGender] = useState('male');
    const [user_contacts, setUser_contacts] = useState('');
    
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    
    // const [validSurname, setValidSurname] = useState(false);
    // const [surnameFocus, setSurnameFocus] = useState(false);
    // const [validBirth_date, setValidBirth_date] = useState(false);
    // const [birth_dateFocus, setBirth_dateFocus] = useState(false);

    // const [validGender, setValidGender] = useState(false);
    // const [genderFocus, setGenderFocus] = useState(false);
    
    // const [validUser_contacts, setValidUser_contacts] = useState(false);
    // const [user_contactsFocus, setUser_contactsFocus] = useState(false);
    
    const navigate = useNavigate();
  
    const handleCancel = () => {
      navigate(-1);
    };

    useEffect(() => {
      loginRef.current.focus();
    }, [])

    useEffect(() => {
      const result = USER_REGEX.test(login);
      console.log(result, login);
      setValidLogin(result);
      console.log("Валидация логина: ", validLogin);
    }, [login])

    useEffect(() => {
      const result = PWD_REGEX.test(pwd);
      console.log(result);
      console.log(pwd);
      console.log(matchPwd)
      setValidPwd(result);
      const match = pwd === matchPwd;
      setValidMatch(match);
    
    }, [pwd, matchPwd])
    
    useEffect (() => {
      setErrMsg('');
    }, [login, pwd, matchPwd])
//     const [formData, setFormData] = useState({
//       login: "",
//       password: "",
//       confirmPassword: "",
//       name: "",
//       surname: "",
//       birth_date: "",
//       gender: "male",
//       user_contacts: "",
//     });
//   {
//     "login" : "Kot-Vasiliy",
  //     "password" : "M0neyL!e",
  //     "gender" : "man",
  //     "name" : "Kolya",
  //     "sureName" : "Vasiliy",
  //     "birthday" : "2002-11-13",
  //     "contact" : "tg"
  // }
    const handleSubmit = async (e) => {
      e.preventDefault();
      // const v1 = USER_REGEX.test(login);
      // const v2 = PWD_REGEX.test(pwd);
      // if (!v1 || !v2) {
      //   setErrMsg("Invalid Entry");
      //   return;
      // }
      try{
        const jsonData = JSON.stringify({login, password: pwd, gender, name, sureName: surname, birthday: birth_date, contact: user_contacts});
        console.log(jsonData);
        const response = await axios.post(REGISTER_URL, 
          jsonData,
          {
            headers: { 'Content-Type' : 'application/json'},
            withCredentials: false
          }
        );
        console.log(response?.status);
        console.log(JSON.stringify(response?.data));
        console.log('Успешно!', response);
      }catch (err){
        console.log(err.response);
        if (!err?.response) {
          setErrMsg('No Server Response');
        } else if (err.response?.status === 400) {
          setErrMsg(err.response?.data.message);
        } else {
          setErrMsg('Registration Failed');
        }
        errRef.current.focus();

      }
      // try {
      //   const response = await axios.post(REGISTER_URL, JSON.stringify({login, password: pwd, gender, name, sureName: surname, birthday: birth_date, contact: user_contacts}),
      //     {
      //       headers: { 'Content-Type': 'application/json'},
      //       withCredentials: true
      //     }
      //   );
      //   console.log(response.data);
      //   console.log(response.accessToken);
      //   console.log(JSON.stringify(response));
      //   setSuccess(true);
      //   // clear input fields

      // } catch (err) {
        // if (!err?.response) {
        //   setErrMsg('No Server Response');
        // } else if (err.response?.status == 409) {
        //   setErrMsg('Username Taken');
        // } else {
        //   setErrMsg('Registration Failed');
        // }
        // errRef.current.focus();
      
    }
    return (
      <>
      {success ? (
              <section>
                <h1>Succes!</h1>
              </section>
      ) : (
      <signup>
      <div className={styles.wrapper}>
        <div className={styles.form}>
          <p ref={errRef} className={(errMsg) ? styles.errmsg :
          styles.offscreen} aria-live="assertive">{errMsg}</p>
          <h1>Регистрация</h1>

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              {/* ЛОГИН */}
              <label htmlFor="login" className={styles.labelWithIcon}>логин<span> </span>
                <span className={validLogin ? styles.valid : styles.hide}>
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={(validLogin || !login) ? styles.hide : styles.invalid}>
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </label>

              <input
                type="text"
                id="login"
                ref={loginRef}
                autoComplete="off"
                onChange={(e) => setLogin(e.target.value)} 
                value={login}
                required
                aria-invalid={validLogin ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setLoginFocus(true)}
                onBlur={() => setLoginFocus(false)}
              />
              <p id="uidnote" className={(loginFocus && login &&
              !validLogin) ? styles.instrucions : styles.offscreen} >
                <FontAwesomeIcon icon={faInfoCircle} /><span> </span>
                4 to 24 characters. <br/>
                Must begin with a letter. <br/>
                Letters, numbers, underscores, hyphens allowed.
                
              </p>
            </div>

            {/* ПАРОЛЬ */}
            <div className={styles.field}>
              <label htmlFor="password">пароль
               {/* <span className={validPwd ? "valid" : "hide"}>
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validPwd || !pwd ? "hide" : "invalid"}>
                  <FontAwesomeIcon icon={faTimes} />
                </span> */}
              </label>
              <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)} 
              value={pwd}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              />
              <p id="pwdnote" className={pwdFocus && !validPwd 
                ? "instrucions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                8 to 24 characters. <br/>
                Must include uppercase and lowercase letters, a numbers and
                a special character. <br/>
                Allowed special characters:
                <span aria-label="exclamation mark">!</span> 
                <span aria-label="at symbol">@</span> 
                <span aria-label="hashtag">#</span> 
                <span aria-label="percent">%</span>
              </p>
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPassword">подтвердите пароль
                {/* <span className={validMatch && matchPwd ? "valid" : "hide"}>
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                  <FontAwesomeIcon icon={faTimes} />
                </span> */}
              </label>
              <input
                type="password"
                id="confirmPassword"
                onChange={(e) => setMatchPwd(e.target.value)} 
                required
                // aria-invalid={validMatch ? "false" : "true"}
                // aria-describedby="confirmnote"
                // onFocus={() => setMatchPwdFocus(true)}
                // onBlur={() => setMatchPwdFocus(false)}
              />
              {/* <p id="confirmnote" className={matchPwdFocus && !validMatch
              ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                Must match the first password input field.
              </p> */}
            </div>
            <div className={styles.field}>
              <label htmlFor="name">имя</label>
              <input
                type="text"
                id="name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="surname">фамилия</label>
              <input
                type="text"
                id="surname"
                onChange={(e) => setSurname(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="birth_date">дата рождения</label>
              <input
                type="date"
                id="birth_date"
                onChange={(e) => setBirth_date(e.target.value)}
                required
                />
            </div>
            <div className={styles.field_dropdown}>
              <label htmlFor="optns">пол</label>
              <div className={styles.select_container}>
                <select
                  type="select"
                  id="optns"
                  defaultValue={'male'}
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
                // disabled={!validLogin || !validPwd || !validMatch ? true : false}

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
    )}
    </>
    )
}
export default Signup

// function Signup() {
    // const navigate = useNavigate();
  
    // const handleCancel = () => {
    //   navigate(-1);
    // };
  
//     const [formData, setFormData] = useState({
//       login: "",
//       password: "",
//       confirmPassword: "",
//       name: "",
//       surname: "",
//       birth_date: "",
//       gender: "male",
//       user_contacts: "",
//     });
  
//     const handleChange = (e) => {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     };
  
//     const handleSubmit = async (e) => {
//       e.preventDefault();
  
//       try {
//         const rawFormData = {
//           login: formData.login,
//           password: formData.password,
//           confirmPassword: formData.confirmPassword,
//           name: formData.name,
//           surname: formData.surname,
//           birth_date: formData.birth_date,
//           gender: formData.gender,
//           user_contacts: formData.user_contacts,
//         };
  
//         const response = await fetch(
//           "https://a25473-8e1e.w.d-f.pw/api/register",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(rawFormData), // Используйте JSON.stringify для создания JSON-строки
//           }
//         );
  
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
  
//         // Если регистрация успешна, перенаправляем пользователя на другую страницу
//         navigate("/Home"); // Заменить
//       } catch (error) {
//         console.error("Error during registration:", error);
//       }
//     };

//   return (
    // <signup>
    //   <div className={styles.wrapper}>
    //     <div className={styles.form}>
    //       <h1>Регистрация</h1>

    //       <form onSubmit={handleSubmit}>
    //         <div className={styles.field}>
    //           <label htmlFor="login">логин</label>
    //           <input
    //             name="login"
    //             type="text"
    //             id="login"
    //             value={formData.login}
    //             onChange={handleChange}
    //             autoFocus
    //           />
    //         </div>

    //         <div className={styles.field}>
    //           <label htmlFor="password">пароль</label>
    //           <input
    //             name="password"
    //             type="password"
    //             id="password"
    //             value={formData.password}
    //             onChange={handleChange}
    //           />
    //         </div>

    //         <div className={styles.field}>
    //           <label htmlFor="confirmPassword">подтвердите пароль</label>
    //           <input
    //             name="confirmPassword"
    //             type="password"
    //             id="confirmPassword"
    //             value={formData.confirmPassword}
    //             onChange={handleChange}
    //           />
    //         </div>

    //         <div className={styles.field}>
    //           <label htmlFor="name">имя</label>
    //           <input
    //             name="name"
    //             type="text"
    //             id="name"
    //             value={formData.name}
    //             onChange={handleChange}
    //           />
    //         </div>

    //         <div className={styles.field}>
    //           <label htmlFor="surname">фамилия</label>
    //           <input
    //             name="surname"
    //             type="text"
    //             id="surname"
    //             value={formData.surname}
    //             onChange={handleChange}
    //           />
    //         </div>

    //         <div className={styles.field}>
    //           <label htmlFor="birth_date">дата рождения</label>
    //           <input
    //             name="birth_date"
    //             type="date"
    //             id="birth_date"
    //             value={formData.birth_date}
    //             onChange={handleChange}
    //           />
    //         </div>
    //         <div className={styles.field_dropdown}>
    //           <label htmlFor="optns">пол</label>
    //           <div className={styles.select_container}>
    //             <select
    //               name="gender"
    //               type="select"
    //               id="optns"
    //               value={formData.gender}
    //               onChange={handleChange}
    //             >
    //               <option value="male">мужской</option>
    //               <option value="female">женский</option>
    //               <option value="helicopter">боевой вертолет</option>
    //             </select>
    //           </div>
    //         </div>

    //         <div className={styles.field_textarea}>
    //           <label htmlFor="user_contacts">контакты</label>
    //           <textarea
    //             name="user_contacts"
    //             id="user_contacts"
    //             type="text"
    //             rows="4"
    //             cols="50"
    //             value={formData.user_contacts}
    //             onChange={handleChange}
    //           ></textarea>
    //         </div>

    //         <div className={styles.btns}>
    //           <button
    //             className={`${styles.cancel}`}
    //             type="button"
    //             id="cancel"
    //             onClick={handleCancel}
    //           >
    //             Отмена
    //           </button>
    //           <button
    //             className={`${styles.confirm}`}
    //             type="submit"
    //             id="confirm"
    //           >
    //             Завершить
    //           </button>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    // </signup>
//   );
// }

// export default Signup;
