import axios from 'axios'
import { useState, useEffect, useRef, useContext } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { flatten_arr, manage_api_call_errors } from './functions'
import useExternalCss from './useExternalCss'
import { API_CONFIG } from '../js/config'
import { MainContainer, RightPane, useRightPane } from './MainContent'


const SERVER_BASE_URL = API_CONFIG.SERVER_BASE_URL;
const API_BASE_URL = API_CONFIG.API_BASE_URL;

const getFetchEmployeeDetailsApiURL = (eno) => `${API_BASE_URL}/Employee/${eno}/`;
const getUpdateEmployeeApiURL = (eno) => `${API_BASE_URL}/Employee/${eno}/`;

const compName = 'updateemp';
function UpdateEmployee() {
    useExternalCss('/src/css/EmployeeTemplate.css');
    
    const {eno} = useParams();
    const ename = useRef(null);
    const esal = useRef(null);
    const edept = useRef(null);
    const eloc = useRef(null);
    const epfpic = useRef(null);
    const [pfpicClass, SetPfpicClass] = useState('nopic');
    const [pfpicSrc, SetPfpicSrc] = useState(null);
    const [pfpicUrl, SetPfpicUrl] = useState(null);
    const [isPfpicDeleted, SetIsPfpicDeleted] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const [empInfo, setEmpInfo] = useState({});
    const [resMsg, setResMsg] = useState([]);
    const [isError, setIsResMsgError] = useState(false);
    const [fieldsErrors, setFieldsErrors] = useState({});
    
    const showPfPic = () => {
        const files = epfpic.current.files;
        if(files && files.length > 0) {
            SetPfpicClass('showpic');
            console.log(epfpic.current.value);

            // Convert the file object into a safe, temporary blob URL
            const blob_url = URL.createObjectURL(files[0]);
            console.log(blob_url);
            SetPfpicSrc(blob_url);
        }
    }
    const removePfPic = (e) => {
        if (e) {
            e.preventDefault(); // Prevents any weird native browser side-effects
            e.stopPropagation(); // Blocks the click from bubbling up to layout parents
        }
        SetPfpicClass('nopic');
        SetPfpicSrc(null);
        SetPfpicUrl(null);
        SetIsPfpicDeleted(true);

        // Clear the input value so you can upload the same picture again
        if(epfpic.current) {
            epfpic.current.value = null;
        }
    }

    function getEmployeeInfo() {
        cleanResMsg();

        axios.get(getFetchEmployeeDetailsApiURL(eno)).then((response) => {
            let emp = response.data;
            setEmpInfo(emp);
            
            if(emp.epfpic) {
                let epfpic_url = emp.epfpic;
                // if url has '/' ending:
                // Remove the leading slash from the path if it exists
                // Eg: "/media/profile_pics/profile-pic-4.jpg" => "media/profile_pics/profile-pic-4.jpg"
                // epfpic_url = epfpic_url.startsWith('/')?epfpic_url.slice(1):epfpic_url;
                const full_epfpic_url = `${SERVER_BASE_URL}${epfpic_url}`;
                SetPfpicUrl(full_epfpic_url);
                SetPfpicClass('showpic');
                console.log('epfpic_url:', full_epfpic_url);
            }

            setIsResMsgError(false);
        }).catch((errors) => {
            setIsResMsgError(true);
            manage_api_call_errors(errors, setResMsg, "Fetching Employee Data Failed.");
            // manage unique api call errors here, rest handle to "manage_api_call_errors"
            if(errors.response) {
                setResMsg(flatten_arr(errors.response.data));
            }
        });
    }

    function validateFormData() {
        let f_errors = {};
        // if(!eno.current.value)
        //     f_errors.eno = 'Required';
        if(!ename.current.value)
            f_errors.ename = 'Required';
        if(!esal.current.value)
            f_errors.esal = 'Required';
        // if(edept.current.value=='notselected')
        //     f_errors.edept = 'Required';
        // if(eloc.current.value=='notselected')
        //     f_errors.eloc = 'Required';
        // if(!epfpic.current.value)
        //     f_errors.epfpic = 'Required';
        setFieldsErrors(f_errors);
        console.log('f_errors',f_errors);
        return Object.keys(f_errors).length==0;
    }

    function cleanResMsg() {
        setIsResMsgError(false);
        setResMsg([]);
    }

    function updateEmpData() {
        cleanResMsg();

        let isAllFieldsValidated = validateFormData();
        console.log('validate',isAllFieldsValidated);
        if(!isAllFieldsValidated)
            return;

        let formData = new FormData();
        formData.append('eno', eno);
        formData.append('ename', ename.current.value);
        formData.append('esal', esal.current.value);
        formData.append('edept', edept.current.value);
        formData.append('eloc', eloc.current.value);
        formData.append('epfpic', epfpic.current.files[0] ?? null);
        formData.append('is_epfpic_deleted', isPfpicDeleted);

        console.log('formData:', formData);

        // When you pass a FormData object directly into Axios, 
        // Axios automatically detects it and configures the Content-Type header for you.
        axios.put(getUpdateEmployeeApiURL(eno), formData).then((response) => {
            console.log(response);
            
            const successMsg = `✔️ Employee (${response.data.eno}-${response.data.ename}) Updated!`;
            setResMsg([successMsg]);
            setIsResMsgError(false);

            const view_page_params = location.state?.view_page_params ?? '';
            const params = new URLSearchParams(view_page_params);
            navigate({
                pathname: '/viewemployees',
                search: params.toString()}, {
                state: { msg:{text:successMsg, type:'success'} }
            });
        }).catch((errors) => {
            setIsResMsgError(true);
            manage_api_call_errors(errors, setResMsg, "Updating Employee Data Failed.");
            // manage unique api call errors here, rest handle to "manage_api_call_errors"
            if(errors.response) {
                setResMsg(flatten_arr(errors.response.data));
            }
            manage_api_call_errors(errors, setResMsg);
        });
    }

    useEffect(getEmployeeInfo, []);
    console.log(resMsg, resMsg==false)
    return (
        <MainContainer inheritCompName={compName}>
            <div className="page-head">
                <h1>Update Employee</h1>
            </div>
            <div className="emp-form">
                <div className="textfield-container">
                    <div className='field-name'>Employee No:</div>
                    <input defaultValue={eno} type="text" disabled/>
                </div>
                <div className="textfield-container">
                    <div className='field-name'>Employee Name:</div>
                    <input ref={ename} defaultValue={empInfo.ename} type="text"/>
                    { fieldsErrors.ename?<div className="f-error">{fieldsErrors.ename}</div>:"" }
                </div>
                <div className="textfield-container">
                    <div className='field-name'>Salary:</div>
                    <input ref={esal} defaultValue={empInfo.esal} type="text"/>
                    { fieldsErrors.esal?<div className="f-error">{fieldsErrors.esal}</div>:"" }
                </div>
                <div className="dropdown-container">
                    <div className='field-name'>Department:</div>
                    <select ref={edept} defaultValue={empInfo.edept?.dept_id} key={empInfo.depts?.length ?? 'loading'}>
                        <option value='notselected'>--select--</option>
                        {
                            empInfo.depts?.map((dept,index) => {
                                return <option key={index} value={dept.dept_id}>{dept.dept_name}</option>
                            })
                        }
                    </select>
                    { fieldsErrors.edept?<div className="f-error">{fieldsErrors.edept}</div>:"" }
                </div>
                <div className="dropdown-container">
                    <div className='field-name'>Location:</div>
                    <select ref={eloc} defaultValue={empInfo.eloc?.loc_id} key={empInfo.locs?.length ?? 'loading'}>
                        <option value='notselected'>--select--</option>
                        {
                            empInfo.locs?.map((loc,index) => {
                                return <option key={index} value={loc.loc_id}>{loc.loc_name}</option>
                            })
                        }
                    </select>
                    { fieldsErrors.eloc?<div className="f-error">{fieldsErrors.eloc}</div>:"" }
                </div>
                <div className="file-container">
                    <div>Profile Pic:</div>
                    <input ref={epfpic} id="epfpic" type="file" onChange={showPfPic} className="visually-hidden"/>
                    <div className={`pfpic-box ${pfpicClass}`}>
                        <label htmlFor="epfpic" className="border-dotted">
                            <span className="icon">+</span>
                            <span className="text">Add Profile Pic</span>
                        </label>
                        <img src={pfpicSrc!=null?pfpicSrc:pfpicUrl} alt="pic" />
                        <button className="remove" onClick={removePfPic}>
                            <span className="icon">🗑</span>
                        </button>
                    </div>
                    { fieldsErrors.epfpic?<div className="f-error">{fieldsErrors.epfpic}</div>:"" }
                </div>
                <div className='submit-section stick-bottom'>
                    {(resMsg!=false)?<div className={`msg-container ${isError?'error':'success'}`}>
                        <div className="text">
                            {
                                resMsg.map((msg,index)=> {
                                return <div key={index}>{ msg }</div>
                                })
                            }
                        </div>
                    </div>:''}
                    <div className="button-container">
                        <button className='app-btn outline' onClick={()=>{navigate('/viewemployees')}}>Cancel</button>
                        <button className='app-btn dark' onClick={updateEmpData}>Update Employee</button>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}

export default UpdateEmployee;