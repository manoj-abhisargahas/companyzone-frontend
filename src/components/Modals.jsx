import { API_CONFIG } from '../js/config'

const SERVER_BASE_URL = API_CONFIG.SERVER_BASE_URL;
const API_BASE_URL = API_CONFIG.API_BASE_URL;

export function DeleteEmpModal({props, okHandler, cancelHandler}) {
    const emp = props; // employee details
    return (<OkCancelModal okHandler={okHandler} cancelHandler={cancelHandler} okText='Delete' cancelText='Cancel'>
    {/* { Object.entries(emp_details).map(([key,value],index) => <div key={index}>{key}: {value}</div>) } */}
        <div className='delete-modal-container'>
            <div className='epfpic'>{emp.epfpic ? <img src={`${SERVER_BASE_URL}${emp.epfpic}`}/> : ''}</div>
            <div className="details">
                <div className='modal-h-txt'>Do you want to delete?</div>
                <div className='ename'>{ emp.ename ?? <span className='fnahyp'>—</span> }</div>
                <div className='eno'><b>Employee ID:</b>&nbsp;{ emp.eno ?? <span className='fnahyp'>—</span> }</div>
                <div className='edept'>
                    <span className='h-txt'>Department:</span>&nbsp;<span className='b-txt'>{ emp.edept?.dept_name ?? <span className='fnahyp'>—</span> }</span>
                </div>
                <div className='eloc'>
                    <span className='h-txt'>Location:</span>&nbsp;<span className='b-txt'>{ emp.eloc?.loc_name ?? <span className='fnahyp'>—</span> }</span>
                </div>
            </div>
        </div>
    </OkCancelModal>);
}

export function OkCancelModal({ children, okHandler, cancelHandler, okText, cancelText }) {
    console.log('okText:',okText, 'cancelText:',cancelText);
    return (<div className='bfs-model' onClick={e => e.stopPropagation()}>
        { children }
        <div className='submit-section'>
            <div className="button-container">
                <button className='app-btn outline' onClick={cancelHandler}>{cancelText}</button>
                <button className='app-btn dark' onClick={okHandler}>{okText }</button>
            </div>
        </div>
    </div>);
}

const Modals = {
    OkCancelModal: OkCancelModal,
    DeleteEmpModal: DeleteEmpModal,
}
export default Modals;

export const ModalTypes = Object.fromEntries(
    Object.keys(Modals).map(key => [key, key])
)