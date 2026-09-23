import { useState, useEffect, useRef, useContext} from 'react';
import { useLocation, useNavigate, NavLink, useSearchParams } from 'react-router-dom'
import axios from 'axios';
import { flatten_arr, manage_axios_api_call_errors } from './functions'
import { API_CONFIG } from '../js/config'
import { useFullScreen } from './FullScreen'

import LeftIndicationIcon from '../assets/icons/left-indicator.svg?react'
import RightIndicationIcon from '../assets/icons/right-indicator.svg?react'
import EditIcon from '../assets/icons/edit-icon.svg?react'
import ViewIcon from '../assets/icons/view-icon-2.svg?react'
import DeleteIcon from '../assets/icons/delete-icon.svg?react'
import useExternalCss from './useExternalCss'

import { ModalTypes } from './Modals'
import { MainContainer, RightPane, useRightPane } from './MainContent'
import { SkeletonRow, ImageWithSkeleton } from './Skeletons'

const SERVER_BASE_URL = API_CONFIG.SERVER_BASE_URL;
const API_BASE_URL = API_CONFIG.API_BASE_URL;

const FETCH_EMPS_API_URL = new URL(`${API_BASE_URL}/CustomEmployee/`); // This Fetch url supports pagination
const getUpdateEmployeeURL = (eno) => `/updateemployee/${eno}`;
const getDeleteEmployeeApiURL = (eno) => `${API_BASE_URL}/Employee/${eno}/`;

const compName = 'viewemps';
function ViewEmployees() {
    // useExternalCss('/src/css/ViewEmployees.css');
    
    const reqStateStr = "⧖ Employee Data fetching from server!...";
    const resFailedStateStr = "⚠ Fetching Employee Data failed from server!";
    const resSuccessStateStr = "✔️ Employee Data fetched from server!";
    const [resMsg, setResMsg] = useState('');
    const [msgType, setMsgType] = useState('');
    
    const navigate = useNavigate();
    const location = useLocation();
    const [fromMsg, setFromMsg] = useState(location.state?.msg?.text ?? null);
    const [fromMsgType, setFromMsgType] = useState(location.state?.msg?.type ?? 'info');

    const forgetFromMsg = () => {
        // When you use useNavigate() to go to the same page 
        // (e.g., clicking a link for the page you are already on, 
        // or just updating search parameters/dynamic IDs), 
        // React does not wipe your useState.
        // So, we are storing our message in "fromMsg" state variable
        navigate(location, {
            state: null, replace: true
        })
    }

    const closeFromMsg = () => {
        setFromMsg(null);
    }

    const [totalEmpCount, setTotalEmpCount] = useState(0);
    const [currEmpCount, setCurrEmpCount] = useState(0);
    const [empData, setEmpData] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [prevUrl, setPrevUrl] = useState(null);
    const [currStartRecNo, setCurrStartRecNo] = useState(0);
    const [currEndRecNo, setCurrEndRecNo] = useState(0);

    console.log('useFullScreen', useFullScreen());
    const { openModal } = useFullScreen();
    const rightPane = useRightPane();
    const [currViewEmp, setCurrViewEmp] = useState(null);
    function setEmployeeToView(emp) {
        console.log(rightPane);
        rightPane.show();
        setCurrViewEmp(emp);
    }

    const [searchParams, setSearchParams] = useSearchParams();
    const default_limit_value = 3;
    const [limit, setLimit] = useState(searchParams.get('limit') || default_limit_value);
    const limitRef = useRef(null);
    const currentPage = parseInt(searchParams.get('page')) || 1;

    const getCurrPageParams = () => {
        return {view_page_params: {page: currentPage, limit: limit}};
    }

    const updatePaginationParams = (page_value, limit_value) => {
        setSearchParams({page: page_value, limit: limit_value});
        triggerFetchEmployees();
    }

    function updateNextPaginationParams(nextURL) {
        const nextURLObj = new URL(nextURL);
        const nextParams = Object.fromEntries(nextURLObj.searchParams.entries());
        setSearchParams(nextParams);

        // .entries() just gives URLSearchParams Iterator {}  (You can't easily read or use this directly)
        // this iterator is just a machine that can loop through pairs (like ['page', '3'], then ['limit', '10']), 
        // but it isn't a structured data configuration yet.
        // Object.fromEntries() is a built-in utility that grabs that raw Iterator machine, runs through all its pairs, 
        // and glues them together into a standard, readable JavaScript object.
    }

    const handleLimitChange = (event) => { 
        const limit_value = Number(event.target.value);
        setLimit(limit_value);
        setSearchParams(prev=>{
            prev.set('limit', limit_value);
            return prev;
        });
    };

    function deleteEmployee(eno) {
        const DELETE_EMP_URL = getDeleteEmployeeApiURL(eno);
        axios.delete(DELETE_EMP_URL).then((response)=>{
            console.log(response);
            if(response.data) {
                const successMsg = `✔️ Employee (${response.data.eno}-${response.data.ename}) Deleted!`;
                setFromMsg([successMsg]);
                setFromMsgType('success');
                
                if(currViewEmp && (currViewEmp.eno==response.data.eno))
                    rightPane.close();
                if(empData.length==1 && currentPage>1)
                    updatePaginationParams(currentPage-1, limit);
                else
                    updatePaginationParams(currentPage, limit);
            }
        }).catch((errors)=>{
            setFromMsgType('error');
            manage_axios_api_call_errors(errors, setFromMsg, "Deleting Employee Failed.");
            // manage unique api call errors here, rest handle to "manage_axios_api_call_errors"
            if(errors.response) {
                setFromMsg(flatten_arr(errors.response.data));
            }
        })
    }

    async function confirmDeleteEmployee(emp) {
        const confirmed = await openModal({
            type: ModalTypes.DeleteEmpModal,
            props: emp
        });
        if(confirmed) {
            deleteEmployee(emp.eno);
        }
    }

    const [isLoaded, setIsLoaded] = useState(false);
    function goToUrl(url) {

        if(!url) return;
        setResMsg(reqStateStr);

        const presUrlObj = new URL(url);
        // presUrlObj.searchParams.set('limit', limitRef.current.value);

        axios.get(presUrlObj).then((response) => {
            if(response.data) {
                setEmpData(response.data.results);

                const TEMP_totalEmpCount = response.data.count;
                const TEMP_currEmpCount = response.data.results.length;

                let TEMP_nextUrl = null
                if(response.data.next) {
                    const nextUrlObj = new URL(response.data.next);
                    nextUrlObj.searchParams.set('limit', limit);
                    TEMP_nextUrl = nextUrlObj.toString();
                }
                
                let TEMP_previousUrl = null
                if(response.data.previous) {
                    const prevUrlObj = new URL(response.data.previous);
                    prevUrlObj.searchParams.set('limit', limit);
                    TEMP_previousUrl = prevUrlObj.toString();
                }

                const pageNo = Number(presUrlObj.searchParams.get('page')) || 1;
                const TEMP_currStartRecNo = (TEMP_currEmpCount==0)?0:(((pageNo-1) * limit) + 1);
                const TEMP_currEndRecNo = (TEMP_currEmpCount==0)?0:((TEMP_currStartRecNo-1) + TEMP_currEmpCount);
                
                setTotalEmpCount(TEMP_totalEmpCount);
                setCurrEmpCount(TEMP_currEmpCount);
                setNextUrl(TEMP_nextUrl);
                setPrevUrl(TEMP_previousUrl);
                setCurrStartRecNo(TEMP_currStartRecNo);
                setCurrEndRecNo(TEMP_currEndRecNo);
                
                setMsgType('success');
                setResMsg(resSuccessStateStr);
            } else {
                setMsgType('error');
                setResMsg(resFailedStateStr);
            }
            setIsLoaded(true);
        }).catch((errors) => {
            setMsgType('error');
            setResMsg(resFailedStateStr);
            setIsLoaded(true);
            console.log("Error fetching Employee Data -", errors);
        });
    }

    function triggerFetchEmployees() {
        const page_value = searchParams.get('page');
        const limit_value = searchParams.get('limit');
        FETCH_EMPS_API_URL.searchParams.set('page', page_value ?? currentPage);
        FETCH_EMPS_API_URL.searchParams.set('limit', limit_value ?? limit);
        
        if(limit_value)
            setLimit(limit_value);
        goToUrl(FETCH_EMPS_API_URL.toString());
    }
    
    useEffect(() => {
        if(location.state?.msg)
            forgetFromMsg();
        triggerFetchEmployees();
    }, [searchParams.toString()]);

    useEffect(() => {
        rightPane.close();
    }, []);

    return (
        <>
            <MainContainer inheritCompName={compName}>
                <div className="page-head btw">
                    <h1>Employees List</h1>
                </div>
                <div className='msg-container-wrapper'>
                    { fromMsg && <div className={`msg-container official box ${ fromMsgType }`}>
                                <div className="text">{ fromMsg }</div>
                                <button onClick={ closeFromMsg }>✕</button>
                            </div>
                    }
                </div>
                <div className="table-actions">
                    <div><strong>Total Employees:</strong>&nbsp;<span>{ totalEmpCount }</span></div>
                    <div className="limit">
                        <select ref={ limitRef } value={ limit } onInput={ handleLimitChange }
                            title="Records per page" aria-label="Records per page">
                            <option value="3">3</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="100">100</option>
                            {/* Max fetch is 100 only but 110 is just for testing to show how server behaves */}
                            <option value="110">110</option>
                        </select>
                    </div>
                    <div className="pagination">
                        <span className='info'>
                            <span>({ currStartRecNo }-{ currEndRecNo })</span>&nbsp;
                            <span>{ currEmpCount }&nbsp;{ currEmpCount==1?'Record':'Records' }</span>
                        </span>
                        { <button disabled={ !prevUrl } className={`app-btn dark-invert ${ !prevUrl && 'invert' }`} onClick={ () => updateNextPaginationParams(prevUrl) }
                            title="Previous" aria-label="Previous">
                            <LeftIndicationIcon />
                        </button> }
                        { <button disabled={ !nextUrl } className={`app-btn dark-invert ${ !nextUrl && 'invert' }`} onClick={ () => updateNextPaginationParams(nextUrl) }
                            title="Next" aria-label="Next">
                            <RightIndicationIcon />
                        </button> }
                    </div>
                </div>
                <div className='table-wrapper'>
                    <table className='emptable'>
                        <thead>
                            <tr>
                                <th className='fit'>Pic</th>
                                <th className='fit max_w300px'>Eno.</th>
                                <th className='max_w300px'>Name</th>
                                <th className='fit max_w300px'>Salary</th>
                                <th className='fit max_w300px'>Department</th>
                                <th className='fit max_w300px'>Location</th>
                                <th className='fit'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoaded && Array.from({length:limit},(_, index)=><SkeletonRow key={index} classname=""/>)}
                            {(isLoaded && empData.length==0) && <tr>
                                <td colSpan='7' className='no-data-row'>No Employee Data Found.</td>
                            </tr>}
                            {(isLoaded && empData.length>0) && empData.map((emp) => { return (
                            <tr key={ emp.eno }>
                                <td className='pfpic'>
                                    <ImageWithSkeleton src={emp.epfpic && `${SERVER_BASE_URL}${emp.epfpic}`} alt='epfpic'/>
                                </td>
                                <td className='align_c'>{ emp.eno ?? <span className='nahyp'>—</span> }</td>
                                <td className='clickable' onClick={()=>setEmployeeToView(emp)}>{ emp.ename ?? <span className='nahyp'>—</span> }</td>
                                <td className='align_r'>{ emp.esal ?? <span className='nahyp'>—</span> }</td>
                                <td >{ emp.edept?.dept_name ?? <span className='nahyp'>—</span> }</td>
                                <td >{ emp.eloc?.loc_name ?? <span className='nahyp'>—</span> }</td>
                                <td className='record-actions'>
                                    <div className='content'>
                                        <NavLink to={getUpdateEmployeeURL(emp.eno)} state={getCurrPageParams()} className='app-btn dark'title="Edit" aria-label="Edit">
                                            <EditIcon />
                                        </NavLink>
                                        <button className='app-btn no-to-outline'
                                            title="View" aria-label="View" onClick={()=>setEmployeeToView(emp)}>
                                            <ViewIcon />
                                        </button>
                                        <button className='app-btn no-to-outline' onClick={()=>confirmDeleteEmployee(emp)}
                                            title="Delete" aria-label="Delete">
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
                <div className='msg-container-wrapper'>
                    <div className={`msg-container raw ${ msgType }`}>
                        <div className="text">{ resMsg }</div>
                    </div>
                </div>
            </MainContainer>
            {rightPane.isOpen && <RightPane headTxt='Employee Details'>
                <ViewEmployeeTemplate emp={currViewEmp} onClickDelete={confirmDeleteEmployee} currPageParams={getCurrPageParams()}/>
            </RightPane>}
        </>
    );
}

function ViewEmployeeTemplate({emp, onClickDelete, currPageParams}) {
    if(!emp) return null;
    return(
    <div className='view-emp-content'>
        <div className='epfpic'>{emp.epfpic && <img src={`${SERVER_BASE_URL}${emp.epfpic}`}/>}</div>
        <div className="details">
            <div className='ename'>{emp.ename ?? <span className='fnahyp'>—</span>}</div>
            <div className='eno'><b>Employee ID:</b>&nbsp;{emp.eno ?? <span className='fnahyp'>—</span>}</div>
            <div className='edept'>
                <span className='h-txt'>Department:</span>&nbsp;<span className='b-txt'>{emp.edept?.dept_name ?? <span className='fnahyp'>—</span>}</span>
            </div>
            <div className='eloc'>
                <span className='h-txt'>Location:</span>&nbsp;<span className='b-txt'>{emp.eloc?.loc_name ?? <span className='fnahyp'>—</span>}</span>
            </div>
        </div>
        <div className="button-container col">
            <NavLink to={getUpdateEmployeeURL(emp.eno)} state={currPageParams} className='app-btn dark'
                title="Edit" aria-label="Edit">Update Employee</NavLink>
            <button className='app-btn outline' onClick={()=>onClickDelete(emp)}
                title="Delete" aria-label="Delete">Delete Employee</button>
        </div>
    </div>);
}

export default ViewEmployees;