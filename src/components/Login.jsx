import { MainContainer} from './MainContent'
import { flatten_arr, manage_fetch_api_call_errors } from './functions'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../js/config'
import { useAuthContext } from './Authentication'

const ADD_NEW_EMP_URL = `${API_BASE_URL}/login/`;

const compName = 'Login';
function Login() {
    const [isError, setIsResMsgError] = useState(false);
    const [resMsg, setResMsg] = useState([]);
    const [fieldsErrors, setFieldsErrors] = useState({});
    const navigate = useNavigate();
    const {setIsAuthLoading, setIsAuthenticated, setUser} = useAuthContext();

    const uname = useRef(null);
    const pword = useRef(null);

    function validateFormData() {
        let f_errors = {};
        if(!uname.current.value)
            f_errors.uname = 'Required';
        if(!pword.current.value)
            f_errors.pword = 'Required';
        setFieldsErrors(f_errors);
        console.log('f_errors',f_errors);
        return Object.keys(f_errors).length==0;
    }

    function cleanFields() {
        uname.current.value = null;
        pword.current.value = null;
        setFieldsErrors({});
    }

    function cleanResMsg() {
        setIsResMsgError(false);
        setResMsg([]);
    }

    async function doLogin() {
        cleanResMsg();

        let isAllFieldsValidated = validateFormData();
        console.log('validate',isAllFieldsValidated);
        if(!isAllFieldsValidated)
            return;

        let payload = {
            "username": uname.current.value,
            "password": pword.current.value,
        }
        console.log('payload',payload);
        let options = {
            method: 'POST',
            headers:{ 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }

        try {
            const response = await fetch(ADD_NEW_EMP_URL, options);
            const data = await response.json();
            console.log(data);
            if(response.status===200){
                localStorage.setItem('accessToken', data.access);
                localStorage.setItem('refreshToken', data.refresh);
                localStorage.setItem('user', JSON.stringify(data.user));
                setIsAuthLoading(false);
                setIsAuthenticated(true);
                setUser(data.user);
                navigate('/dashboard');
            }
            else if(response.status===401) {
                setIsResMsgError(true);
                // manage unique api call errors here, rest handle to "manage_fetch_api_call_errors"
                if(data.detail)
                    setResMsg(flatten_arr(data.detail));
            }
            else {
                setIsResMsgError(true);
                // manage unique api call errors here, rest handle to "manage_fetch_api_call_errors"
                setResMsg(['⚠ Something went wrong. Please try again!']);
            }
        }
        catch(error) {
            setIsResMsgError(true);
            manage_fetch_api_call_errors(error, setResMsg);
        }
    }

    return(
        <MainContainer inheritCompName={`emp-form-wrapper ${compName}`}>
            <div className="center-logo">
                <a className="brand-logo" href="{% url 'dashboard_url' %}">
                    <img src="../src/assets/images/companyzone-logo-horz.png"/>
                </a>
            </div>
            <div className="page-head">
                <h1>Login</h1>
            </div>
            <div className="emp-form">
                <div className="textfield-container">
                    <div className='field-name'>Username:</div>
                    <input ref={uname} type="text"/>
                    { fieldsErrors.uname?<div className="f-error">{fieldsErrors.uname}</div>:"" }
                </div>
                <div className="textfield-container">
                    <div className='field-name'>Password:</div>
                    <input ref={pword} type="text"/>
                    { fieldsErrors.pword?<div className="f-error">{fieldsErrors.pword}</div>:"" }
                </div>
                <div className='submit-section stick-bottom'>
                    {(resMsg.length!=0) && <div className={`msg-container align_c ${isError?'error':'success'}`}>
                        <div className="text">
                            {
                                resMsg.map((msg,index)=> {
                                return <div key={index}>{ msg }</div>
                                })
                            }
                        </div>
                    </div>}
                    <div className="button-container">
                        <button className='app-btn dark-invert' onClick={doLogin}>Login</button>
                    </div>
                </div>
            </div>
        </MainContainer>);
} 

export default Login;