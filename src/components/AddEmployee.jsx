import axios from 'axios'
import { useState, useEffect, useRef, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { flatten_arr, manage_axios_api_call_errors } from './functions'
import useExternalCss from './useExternalCss'
import { API_CONFIG } from '../js/config'
import { MainContainer, RightPane, useRightPane } from './MainContent'

const SERVER_BASE_URL = API_CONFIG.SERVER_BASE_URL;
const API_BASE_URL = API_CONFIG.API_BASE_URL;

const FORM_METADATA_FETCH_API_URL = `${API_BASE_URL}/NewEmpFormData/`;
const ADD_NEW_EMP_URL = `${API_BASE_URL}/Employee/`;

const compName = 'addemp';
function AddEmployee() {
    // useExternalCss('/src/css/EmployeeTemplate.css');

    const [depts, setDepts] = useState([]);
    const [locs, setLocs] = useState([]);
    const [resMsg, setResMsg] = useState([]);
    const [isError, setIsResMsgError] = useState(false);
    const [fieldsErrors, setFieldsErrors] = useState({});

    const eno = useRef(null);
    const ename = useRef(null);
    const esal = useRef(null);
    const edept = useRef(null);
    const eloc = useRef(null);
    const epfpic = useRef(null);
    const [pfpicClass, SetPfpicClass] = useState('nopic');
    const [pfpicSrc, SetPfpicSrc] = useState(null);

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

        // Clear the input value so you can upload the same picture again
        if(epfpic.current) {
            epfpic.current.value = null;
        }
    }

    const navigate = useNavigate();

    function getStartInfo() {
        cleanResMsg();

        axios.get(FORM_METADATA_FETCH_API_URL).then((response) => {
            console.log(response);
            if(response.data) {     
                setDepts(response.data.depts);
                setLocs(response.data.locs);
                setIsResMsgError(false);
            }
        }).catch((errors) => {
            setIsResMsgError(true);
            manage_axios_api_call_errors(errors, setResMsg, "Fetching Departments, Locations Failed.");
            // manage unique api call errors here, rest handle to "manage_axios_api_call_errors"
            if(errors.response) {
                const err_arr = flatten_arr(errors.response.data);
                err_arr.unshift("⚠ Fetching Departments, Locations Failed.");
                setResMsg(err_arr);
            }
        });
    }

    function validateFormData() {
        let f_errors = {};
        if(!eno.current.value)
            f_errors.eno = 'Required';
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

    function cleanFields() {
        eno.current.value = null;
        ename.current.value = null;
        esal.current.value = null;
        edept.current.value = 'notselected';
        eloc.current.value = 'notselected';
        epfpic.current.value = null;
        setFieldsErrors({});
    }

    function cleanResMsg() {
        setIsResMsgError(false);
        setResMsg([]);
    }

    function addNewEmpData() {
        cleanResMsg();

        let isAllFieldsValidated = validateFormData();
        console.log('validate',isAllFieldsValidated);
        if(!isAllFieldsValidated)
            return;

        let payload = {
            "eno": eno.current.value,
            "ename": ename.current.value,
            "esal": esal.current.value,
        }
        if(edept.current.value!='notselected')
            payload['edept'] = edept.current.value;
        if(eloc.current.value!='notselected')
            payload['eloc'] = eloc.current.value;
        if(epfpic.current.files[0])
            payload['epfpic'] = epfpic.current.files[0];
        console.log('payload',payload);

        let config = {
            headers:{ 'Content-Type': 'multipart/form-data' }
        }

        axios.post(ADD_NEW_EMP_URL, payload, config).then((response) => {
            console.log(response);
            if(response.data) {     
                cleanFields();
                
                const successMsg = `✔️ Employee (${response.data.eno}-${response.data.ename}) Inserted!`;
                setResMsg([successMsg]);
                setIsResMsgError(false);

                navigate('/viewemployees', {
                    state: { msg:{text:successMsg, type:'success'} }
                });
            }
        }).catch((errors) => {
            setIsResMsgError(true);
            manage_axios_api_call_errors(errors, setResMsg, "Adding Employee Data Failed.");
            // manage unique api call errors here, rest handle to "manage_axios_api_call_errors"
            if(errors.response) {
                setResMsg(flatten_arr(errors.response.data));
            }
        });
    }

    useEffect(getStartInfo, []);

    return (
        <MainContainer inheritCompName={`emp-form-wrapper ${compName}`}>
            <div className="page-head">
                <h1>Add Employee</h1>
            </div>
            <div className="emp-form">
                <div className="textfield-container">
                    <div className='field-name'>Employee No:</div>
                    <input ref={eno} type="text"/>
                    { fieldsErrors.eno?<div className="f-error">{fieldsErrors.eno}</div>:"" }
                </div>
                <div className="textfield-container">
                    <div className='field-name'>Employee Name:</div>
                    <input ref={ename} type="text"/>
                    { fieldsErrors.ename?<div className="f-error">{fieldsErrors.ename}</div>:"" }
                </div>
                <div className="textfield-container">
                    <div className='field-name'>Salary:</div>
                    <input ref={esal} type="text"/>
                    { fieldsErrors.esal?<div className="f-error">{fieldsErrors.esal}</div>:"" }
                </div>
                <div className="dropdown-container">
                    <div className='field-name'>Department:</div>
                    <select ref={edept}>
                        <option value='notselected'>--select--</option>
                        {
                            depts.map((dept,index) => {
                                return <option key={index} value={dept.dept_id}>{dept.dept_name}</option>
                            })
                        }
                    </select>
                    { fieldsErrors.edept?<div className="f-error">{fieldsErrors.edept}</div>:"" }
                </div>
                <div className="dropdown-container">
                    <div className='field-name'>Location:</div>
                    <select ref={eloc}>
                        <option value='notselected'>--select--</option>
                        {
                            locs.map((loc,index) => {
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
                        <img src={pfpicSrc} alt="pic" />
                        <button className="remove" onClick={removePfPic}>
                            <span className="icon">🗑</span>
                        </button>
                    </div>
                    { fieldsErrors.epfpic?<div className="f-error">{fieldsErrors.epfpic}</div>:"" }
                </div>
                <div className='submit-section stick-bottom'>
                    {(resMsg.length!=0) && <div className={`msg-container ${isError?'error':'success'}`}>
                        <div className="text">
                            {
                                resMsg.map((msg,index)=> {
                                return <div key={index}>{ msg }</div>
                                })
                            }
                        </div>
                    </div>}
                    <div className="button-container">
                        <button className='app-btn dark-invert' onClick={addNewEmpData}>Insert New Employee</button>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}

export default AddEmployee;