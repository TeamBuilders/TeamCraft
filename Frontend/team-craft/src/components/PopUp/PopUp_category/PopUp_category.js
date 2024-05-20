import {React, useState, useEffect} from 'react';
import styles from './PopUp_category.module.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';



export default function PopUp_category(props) {
    const [category, setCategory] = useState(props.value);
    const [isOpen, setIsOpen] = useState(false);
    const[isSelected, setIsSelected] = useState(false);

    const [userSkills, setUserSkills] = useState(props.value2)
    //в данных пользователя hobby и skills хранятся раздельно. И в userSkills все скиллы в одном массиве без разделений 
    const [selectedItems, setSelectedItems] = useState(userSkills.skillsPerson.length === 0 ? [] : userSkills.skillsPerson);
    let selectedHobbies = userSkills.hobbiesPerson.length === 0 ? [] : userSkills.hobbiesPerson;

    const handleOpen = () => {
        setIsOpen(true);
        setCategory(props.value);
    };

    useEffect(() => {
        handleOpen();
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        //const newSelectedItems = selectedItems.map(item => JSON.stringify(item));
        userSkills.skillsPerson = selectedItems;
        //console.log(userSkills);
        if (selectedItems.length > 0) {
            selectedHobbies = selectedHobbies.some(hobby => hobby.nameHobby === props.text.nameHobby) ? [...selectedHobbies]: [...selectedHobbies, props.text];
        }
        else{
            selectedHobbies = selectedHobbies.filter(hobby => hobby.id !== props.text.id);
        }
        userSkills.hobbiesPerson = selectedHobbies;
        props.value2.skillsPerson = userSkills.skillsPerson;
        props.value2.hobbiesPerson = userSkills.hobbiesPerson;
    };



    const handleItemClick = (item) => {
        const isSelected = selectedItems.some(selectedItem => selectedItem.nameSkill === item.nameSkill);

        if (isSelected) {
            setSelectedItems(selectedItems.filter(selectedItem => selectedItem.id !== item.id));
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
            trigger={<button className={styles.button_trigger}>{props.text.nameHobby}</button>} 
            modal 
            nested
            closeOnDocumentClick
        >
            {
                close => (
                    <div className={styles.modal}>
                        <div>
                            <h2>{props.text.nameHobby}</h2>
                            <ul className={styles.ul_list}>
                                    {category.map((item, index) => (
                                        <li
                                            className={styles.li_item}
                                            key={index}
                                            onClick={() => handleItemClick(item)}
                                            style={{ backgroundColor: selectedItems.some(selectedItem => selectedItem.id === item.id) ? '#1c2e7b' : '#4361EE' }}
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
