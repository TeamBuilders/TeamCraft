import React, { useState } from 'react';
import styles from './Create_team.module.css';
import { useNavigate } from 'react-router-dom';
const CreateTeamForm = () => {
    const navigate = useNavigate();
    const [teamName, setTeamName] = useState('');
    const [teamDescription, setTeamDescription] = useState('');
    const [teamTags, setTeamTags] = useState('');
    const [numberOfmembers, setNumberOfmembers] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Данные команды:', { teamName, teamDescription, teamTags, numberOfmembers });
        localStorage.setItem('teamName', teamName);
        localStorage.setItem('teamDescription', teamDescription);
        localStorage.setItem('teamTags', teamTags);
        localStorage.setItem('numberOfmembers', numberOfmembers);
        navigate('/team/' + teamName);
    };

    return (
        <div className={styles.create_team}> {/* Применение класса из модуля стилей */}
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
                            <label htmlFor="teamDescription">Описание команды:</label>
                            <textarea
                                id="teamDescription"
                                value={teamDescription}
                                onChange={(e) => setTeamDescription(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="teamTags">Теги команды:</label>
                            <textarea
                                id="teamTags"
                                value={teamTags}
                                onChange={(e) => setTeamTags(e.target.value)}
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
                        </div>

                        <div className={styles.btns}>
                            <button className={styles.confirm} type="submit">Создать команду</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTeamForm;
