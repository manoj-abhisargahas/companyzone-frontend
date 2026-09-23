import { useState, useRef } from 'react'
import useExternalCss from './useExternalCss'
import { MainContainer } from './MainContent'

const compName='todozone';
function ToDoZone() {
    // useExternalCss('/src/css/ToDoZone.css');

    let [nextId, setNextId] = useState(1);
    let [isItemFinished, setIsItemFinished] = useState(false);
    let [items, setItems] = useState([]);
    let new_item = useRef();
    
    const addItem = () => {
        let item_id = nextId;
        let item_text = new_item.current.value.trim();
        if(item_text) {
            let item = {id:item_id, isFinish:false, text:item_text}
            setItems([...items, item]);
            setNextId(nextId + 1);
        }
    }

    const removeItem = (targetId) => {
        const updatedItems = items.filter(item => item.id!=targetId);
        setItems(updatedItems);
    }
    
    const finishItem = (targetId) => {
        const updatedItems = items.map(
            item => (item.id==targetId?{...item, isFinish:!item.isFinish}:item)
        );
        setItems(updatedItems);
    }

    return(
        <MainContainer inheritCompName={compName}>
            <div className="page-head btw">
                <h1>To Do Zone</h1>
            </div>
            <div className="add-item-section">
                <input ref={ new_item } type="text" name="item-textbox" placeholder="Type to add new item..." />
                <button onClick={ addItem } className="app-btn dark">Add</button>
            </div>
            <ul className="items-list">
            {
                items.length==0?<div className="info">No items to show.</div>:
                items.map(item => { return (
                    <li key={ item.id }>
                        <input type="checkbox" name="finished" onClick={ () => finishItem(item.id) }/>
                        <span className={`text ${item.isFinish?'finished':'notfinish'}`}>{ item.text }</span>
                        <span className="remove" onClick={ () => removeItem(item.id) }>✕</span>
                    </li>)})
            }
            </ul>
        </MainContainer>
    );
}

export default ToDoZone