import {React, useState, useEffect} from 'react';
import styles from './PopUp_skill.module.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';



export default function PopUp_skill(props) {
    const [category, setCategory] = useState(props.value);
    const [selectedItems, setSelectedItems] = useState([]);

    const handleClose = () => {
        const newSelectedItems = selectedItems.map(item => JSON.stringify(item));
        localStorage.setItem('team_stack', JSON.stringify(newSelectedItems));
    };

    const handleItemClick = (item) => {

        const isSelected = selectedItems.some(selectedItem => selectedItem.nameSkill === item.nameSkill);

        if (isSelected) {
            setSelectedItems(selectedItems.filter(selectedItem => selectedItem.nameSkill !== item.nameSkill));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };
    
    return (
        <Popup 
            contentStyle={{
                width: '500px', 
                height: '600px', 
                backgroundColor: '#1d2125',
                color: '#333', 
                border: 'none',
                borderRadius: '10px', 
                padding: '20px',
                display: 'flex',
                justifyContent: 'center'
            }} 
            trigger={<button className={styles.button_trigger} type='button' >{props.text}</button>} 
            modal 
            nested
            closeOnDocumentClick
        >
            {
                close => (
                    <div className={styles.modal}>
                        <div>
                            <h2>{props.text}</h2>
                            <ul className={styles.ul_list}>
                                    {category.map((item, index) => (
                                        <li
                                            className={styles.li_item}
                                            key={index}
                                            onClick={() => handleItemClick({nameSkill: item.nameSkill})}
                                            style={{ backgroundColor: selectedItems.some(selectedItem => selectedItem.nameSkill === item.nameSkill) ? '#1c2e7b' : '#4361EE' }}
                                        >
                                            {item.nameSkill}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        <div className={styles.buttons}>
                        <button className={styles.button_close} onClick={() => { handleClose(); close();}}>Сохранить</button>
                        </div>
                    </div>
                )
            }
        </Popup>
    );
}
