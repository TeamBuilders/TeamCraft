import {React, useState, useEffect} from 'react';
import styles from './PopUp_category.module.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';



export default function PopUp_category(props) {
    const [category, setCategory] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const Development = [
        "Mobile app development",
        "Web development",
        "Game development",
        "Cyber security",
        "Data science",
        "Blockchain development",
        "Desktop app development",
        "Embedded systems development"
    ]

    const handleOpen = () => {
        setIsOpen(true);
        setCategory(props.text);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    // Создаем состояние для хранения выбранных элементов
    const [selectedItems, setSelectedItems] = useState([]);

    // Функция для обработки клика по элементу списка
    const handleItemClick = (item) => {
        // Проверяем, есть ли уже элемент в выбранных
        const isSelected = selectedItems.includes(item);

        // Если элемент уже выбран, удаляем его из массива выбранных
        // Иначе добавляем его в массив выбранных
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
            trigger={<button className={styles.button_trigger} onClick={handleOpen}>{props.text}</button>} 
            modal 
            nested
        >
            {
                close => (
                    <div className={styles.modal}>
                        <div>
                            <h2>{props.text}</h2>
                            <ul className={styles.ul_list}>
                                    {Development.map((item, index) => (
                                        <li
                                            className={styles.li_item}
                                            key={index}
                                            onClick={() => handleItemClick(item)}
                                            style={{ backgroundColor: selectedItems.includes(item) ? '#1c2e7b' : '#4361EE' }}
                                        >
                                            {item}
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
