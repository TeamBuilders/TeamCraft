import React from 'react';
import styles from './Members.module.css';

const Members = (dataMem, role) => {
    const dataMemberUser = dataMem;

  return (
    <div className={styles.block_player}>
        <img src="images/avatar.jpg" alt="player_icon" className={styles.player_icon}/>
            <div className={styles.desc}>
                <p className={styles.player_title}>{dataMemberUser.name}</p>
                <div className={styles.state}>
                    <p className={styles.fullness}>{role}</p>
                </div>
            </div>
    </div>
  );
};

export default Members;