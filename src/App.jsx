import { useState, createContext, useContext } from 'react'
import CompanyZone from './components/CompanyZone'
import { FullScreenProvider } from './components/FullScreen'
import { RightPaneProvider } from './components/MainContent'

const AppContext = createContext(null);

function App() {
  // App Context - Now just dummy values
  const app_context_values = {
    key1: 'value1', key2: 'value2'
  }

  return (
    <AppContext.Provider value={app_context_values}>
      <FullScreenProvider>
        <RightPaneProvider>
            <CompanyZone />
        </RightPaneProvider>
      </FullScreenProvider>
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
export default App;