import { createContext, useContext, useState, useEffect } from 'react'
import { checkInitAuthStatus } from './auth'
import { useLocation, Navigate, Outlet } from 'react-router-dom'

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
    
    if(isAuthLoading) {
        return <AuthLoadSpinner />;
    }

    return (
        <AuthContext.Provider value={{setIsAuthLoading, setIsAuthenticated, setUser, isAuthenticated, user, logout}}>
            { children }
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);

// Another name suggestion: AnonymousRoute
export function LoginRoute({ children }) {
    const {isAuthenticated} = useAuthContext();

    // If user already logged in, redirect to dashboard
    // If not logged in, boot them to the login page
    return isAuthenticated?<Navigate to="/" replace />:children;
}

export function ProtectedRouteLayout() {
    const {isAuthenticated} = useAuthContext();

    // If user logged in, render the child routes inside the layout
    // If not logged in, boot them to the login page
    return isAuthenticated?<Outlet />:<Navigate to="/login" replace />;
}