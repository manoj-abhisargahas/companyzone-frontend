import useExternalCss from './useExternalCss'
import { MainContainer } from './MainContent'

const compName = 'dashboard';
function Dashboard() {
    useExternalCss('/src/css/Dashboard.css');

    return (
        <MainContainer inheritCompName={compName}>
            <div className="page-head btw">
                <h1>Dashboard</h1>
            </div>
            <div className="greet-user">
                Hello!&nbsp;<span>Admin</span>
            </div>       
        </MainContainer>
    );
}

export default Dashboard;