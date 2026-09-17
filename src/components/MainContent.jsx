import { createContext, useContext, useState } from 'react'

const RightPaneContext = createContext(null);

export function MainContainer({children, inheritCompName}) {
    return(
        // For supporting scrolling for content in main-container
        <div className={`main-container ${inheritCompName}`}>
            <div className="content">
                <div className="content-sections">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function RightPaneProvider({children}) {
    const [showRightPane, setShowRightPane] = useState(false);
    const rightPane = {
        show: ()=>setShowRightPane(true),
        close: ()=>setShowRightPane(false),
        isOpen: showRightPane,
    }
    return (
        <RightPaneContext.Provider value={rightPane}>
            {children}
        </RightPaneContext.Provider>
    );
}

export function RightPane({children, headTxt, inheritCompName}) {
    const rightPane = useContext(RightPaneContext)
    if(!rightPane || !rightPane.isOpen ) return null;
    return (
        <div className={`right-pane ${inheritCompName}`}>
            <div className="rp-box">
                <div className='head'>
                    <div className='txt'>{headTxt}</div>
                    <span className='close-btn app-btn no-to-outline' onClick={rightPane.close}>✕</span>
                </div>
                <div className="body thin-scroll">
                    {children}
                </div>
            </div>
        </div>
    );
}

export const useRightPane = () => {
    const context = useContext(RightPaneContext);
    // Safety check: helps catch provider layout bugs instantly!
    if(!context)
        throw new Error('useRightPane must be used within a RightPaneProvider');
    return context;
}