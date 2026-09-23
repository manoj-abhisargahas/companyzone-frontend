import { createContext, useContext, useState, useEffect } from 'react'
import { checkInitAuthStatus } from './auth'
import { useLocation, Navigate } from 'react-router-dom'

const AuthContext = createContext(null);
const sessionExpMsgTxt = "Session expired, login again!";
const sessionExpMsg = { msg:{text:sessionExpMsgTxt, type:'error'} }

function AuthLoadSpinner() {
    console.log('Zone loading.....');
    return(<div className="app-load-spinner">
        <img src="../src/assets/images/companyzone-icon.png" />
        <div>Zone Loading...</div>
    </div>);
}

export function AuthContextProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [user, setUser] = useState(null);
    const location = useLocation();

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.clear();
    };

    useEffect(() => {
        checkInitAuthStatus().then(({isAuth, user})=>{
            console.log('isAuth',isAuth);
            if(isAuth) {
                setIsAuthenticated(true);
                setUser(user);
            }
            else {
                logout();
            }
            setIsAuthLoading(false);
        });
    }, []);
    console.log('loading:',isAuthLoading, 'authenticated:',isAuthenticated, location.pathname);
    return (
        <AuthContext.Provider value={{setIsAuthLoading, setIsAuthenticated, setUser, user, logout}}>
            {/* 1. View blocker while your token checking API is loading */}
            {isAuthLoading && <AuthLoadSpinner />}
            
            {/* 2. Unauthenticated state layout handler */}
            {!isAuthLoading && !isAuthenticated && (location.pathname==='/login'?
                children:<Navigate to="/login" replace state={sessionExpMsg}/>)}

            {/* 3. Authenticated state layout handler */}
            {!isAuthLoading && isAuthenticated && (location.pathname==='/login'?
                <Navigate to="/" replace />:children)}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);