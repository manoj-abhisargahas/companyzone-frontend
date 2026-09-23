import useExternalCss from './useExternalCss'
import { MainContainer } from './MainContent'

const compName='error404';
function Error404() {
    // useExternalCss('/src/css/Error404.css');

    return (
        <MainContainer inheritCompName={compName}>
            <div className="head-txt">404</div>
            <div className="txt">Page Not Found.</div>      
        </MainContainer>
    );
}

export default Error404;