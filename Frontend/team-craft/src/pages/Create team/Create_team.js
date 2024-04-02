import React, { useState } from 'react';
import styles from './Create_team.module.css';
import { useNavigate } from 'react-router-dom';
const CreateTeamForm = () => {
    const navigate = useNavigate();
    const [teamName, setTeamName] = useState('');
    const [teamGoal, setteamGoal] = useState('');
    const [team_lead, setteam_lead] = useState('');
    const [numberOfmembers, setNumberOfmembers] = useState('');
    const handleCancel = () => {
        navigate(-1);
      };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Данные команды:', { teamName, teamGoal, team_lead, numberOfmembers });
        localStorage.setItem('teamName', teamName);
        localStorage.setItem('teamGoal', teamGoal);
        localStorage.setItem('team_lead', team_lead);
        navigate('/team/' + teamName);
    };

    return (
        <div className={styles.create_team}> 
            <div className={styles.wrapper}>
                <div className={styles.form}>
                    <h1>Создание команды</h1>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.field}>
                            <label htmlFor="teamName">Название команды:</label>
                            <input
                                type="text"
                                id="teamName"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="teamGoal">Цель команды:</label>
                            <textarea
                                id="teamGoal"
                                value={teamGoal}
                                onChange={(e) => setteamGoal(e.target.value)}
                                required
                            />
                        </div>
                        {/* <div className={styles.field}>
                            <label htmlFor="team_lead">Теги команды:</label>
                            <textarea
                                id="team_lead"
                                value={team_lead}
                                onChange={(e) => setteam_lead(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="numberOfmembers">Количество участников:</label>
                            <input
                                type="number"
                                id="numberOfmembers"
                                value={numberOfmembers}
                                onChange={(e) => setNumberOfmembers(e.target.value)}
                                min={2}
                                max={10}
                                required
                            />
                        </div> */}

                        <div className={styles.btns}>
                            <button className={styles.cancel} type="button" onClick={handleCancel}>Отмена</button>
                            <button className={styles.confirm} type="submit">Создать</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTeamForm;
