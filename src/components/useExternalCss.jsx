import { useEffect } from 'react'

function useExternalCss(href) {
    useEffect(() => {
        let link = document.querySelector(`link[href="${href}"]`);

        if(!link) {
            link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        }

        return () => {
            link.remove();
        }
    } ,[href]);
}

export default useExternalCss;