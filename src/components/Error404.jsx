import useExternalCss from './useExternalCss'
import { MainContainer } from './MainContent'

const compName='error404';
function Error404() {
    useExternalCss('/src/css/Error404.css');

    return (
        <MainContainer inheritCompName={compName}>
            <div class="head-txt">404</div>
            <div class="txt">Page Not Found.</div>      
        </MainContainer>
    );
}

export default Error404;