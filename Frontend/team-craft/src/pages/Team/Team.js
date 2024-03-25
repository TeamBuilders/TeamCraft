import React from 'react';
import styles from './Team.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

export default function Team(){
    return(
        <div>
            <Header/>
            <div className={styles.bgcolor}>
                <div className={styles.description}>
                    <div className={styles.team_profile_player}>
                    <div className={styles.team}>
                        <h2>Команда</h2>
                        <div className={styles.acc_panel}>
                        <img src="images/csgo.ico" alt="Avatar" className={styles.avatar} />
                        <div className={styles.initials}>
                            <p className={styles.name}>Название</p>
                            <div className={styles.state}>
                            <div className={styles.circle} id="1"></div>
                            <p className={styles.fullness}>3 из 5</p>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className={styles.player}>
                        <h2>Участники</h2>
                        <div className={styles.blocks_players}>
                        <div className={styles.block_player}>
                            <img src="images/avatar.jpg" alt="player_icon" className={styles.player_icon}/>
                            <div className={styles.desc}>
                            <p className={styles.player_title}>Никнейм</p>
                            <div className={styles.state}>
                                <p className={styles.fullness}>Роль</p>
                            </div>
                            </div>
                        </div>
                        <div className={styles.block_player}>
                            <img src="images/avatar.jpg" alt="player_icon" className={styles.player_icon}/>
                            <div className={styles.desc}>
                            <p className={styles.player_title}>Никнейм</p>
                            <div className={styles.state}>
                                <p className={styles.fullness}>Роль</p>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className={styles.info_team}>
                    <div className={styles.tag}>
                        <p>Теги</p>
                        <div className={styles.tag_field}>
                        <textarea className={styles.tags} name="tags" style={{ fontSize: '15pt' }} rows="3" cols="40"></textarea>
                        </div>
                    </div>
                    <div className={styles.info}>
                        <p>Информация о команде</p>
                        <div className={styles.info_panel}>
                        <textarea className={styles.inf_p} name="inf-p" style={{ fontSize: '15pt' }} rows="10" cols="40"></textarea>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
            
    );
}