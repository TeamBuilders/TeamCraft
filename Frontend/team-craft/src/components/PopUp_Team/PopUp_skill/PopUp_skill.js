import {React, useState, useEffect} from 'react';
import styles from './PopUp_skill.module.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';



export default function PopUp_category(props) {
    const [category, setCategory] = useState(props.value);
    const [isOpen, setIsOpen] = useState(false);
    const[isSelected, setIsSelected] = useState(false);
    const [teamStack, setTeamStack] = useState(JSON.parse(localStorage.getItem('team_stack')) || []);
    const [selectedItems, setSelectedItems] = useState([]);

    const categories = {
        "Разработка": [
            "Mobile app development",
            "Web development",
            "Game development",
            "Cyber security",
            "Data science",
            "Blockchain development",
            "Desktop app development",
            "Embedded systems development"
        ],
        "Музыка": ["dafdfdg", "dfgdfgd", "dfgdfsg"],
        "Анимации": [],
        "Гейминг": [],
        "Социальные развлечения": [],
        "Научные разработки": [],
        "Активный отдых": []
    };


    const handleOpen = () => {
        setIsOpen(true);

        // setCategory(props.value);
    };

    useEffect(() => {
        handleOpen();
    }, []);


    const handleClose = () => {
        setIsOpen(false);
        console.log(selectedItems);
        localStorage.setItem('team_stack', JSON.stringify(selectedItems));
        console.log(localStorage.getItem('team_stack'));
    };



    const handleItemClick = (item) => {
        const isSelected = selectedItems.length === 0 ? false : selectedItems.includes(item);

        if (isSelected) {
            setSelectedItems(selectedItems.filter(selectedItem => selectedItem !== item));
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
            trigger={<button className={styles.button_trigger} >{props.text}</button>} 
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
                                            onClick={() => handleItemClick(item.nameSkill)}
                                            style={{ backgroundColor: selectedItems.includes(item.nameSkill) ? '#1c2e7b' : '#4361EE' }}
                                        >
                                            {item.nameSkill}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        <div className={styles.buttons}>
                        <button className={styles.button_close} onClick={() => { handleClose(); close(); }}>Сохранить</button>
                        </div>
                    </div>
                )
            }
        </Popup>
    );
}
