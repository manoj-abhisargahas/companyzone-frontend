import { useState, createContext, useRef, useContext } from 'react'
import Modals from './Modals'

const FullScreenContext = createContext(null);

export function FullScreenProvider({ children }) {
  // Model Open & Close logic
  const resolveModal = useRef(null);
  const [seletedModalConfig, setSeletedModalConfig] = useState(null);

  const openModal = ({type, props}) => {
    return new Promise((resolve) => {
      resolveModal.current = resolve;
      console.log('props::::::::::::::::::::::::', type, props);
      setSeletedModalConfig({type, props});
    })
  }

  const closeModal = (status) => {
    if(resolveModal.current) {
      resolveModal.current(status);
    }
    setSeletedModalConfig(null);
    resolveModal.current = null;
  }

  const SelectedModal = seletedModalConfig ? Modals[seletedModalConfig.type] : null;
  const fs_context_values = { openModal };

  return (
      <FullScreenContext.Provider value={fs_context_values}>
        { children }
        {(seletedModalConfig && SelectedModal)?
          <div className='black-fullscreen' onClick={()=>closeModal(false)}>
              <SelectedModal props={seletedModalConfig.props} 
              okHandler={()=>closeModal(true)} 
              cancelHandler={()=>closeModal(false)}/>
          </div>:''}
      </FullScreenContext.Provider>
  );
}

export const useFullScreen = () => useContext(FullScreenContext);