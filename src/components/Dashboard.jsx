import useExternalCss from './useExternalCss'
import { MainContainer } from './MainContent'
import { useAuthContext } from './Authentication'

const compName = 'dashboard';
function Dashboard() {
    // useExternalCss('/src/css/Dashboard.css');
    const {user} = useAuthContext();
    console.log('user',user.username);
    return (
        <MainContainer inheritCompName={compName}>
            <div className="page-head btw">
                <h1>Dashboard</h1>
            </div>
            <div className="greet-user">
                Hello!&nbsp;<span>{user.username}</span>
            </div>
        </MainContainer>
    );
}

export default Dashboard;