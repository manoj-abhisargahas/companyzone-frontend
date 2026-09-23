import { useState, createContext, useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { FullScreenProvider } from './components/FullScreen'
// import { RightPaneProvider } from './components/MainContent'
import { AuthContextProvider } from './components/Authentication'
import CompanyZone from './components/CompanyZone'
import Login from './components/Login'
import Error404 from './components/Error404'

const AppContext = createContext(null);

function App() {
  // App Context - Now just dummy values
  const app_context_values = {
    key1: 'value1', key2: 'value2'
  }

  return (
    <AppContext.Provider value={app_context_values}>
      <FullScreenProvider>
        <AuthContextProvider>
            <Routes>
              <Route path="/*" element={<CompanyZone />} />
              <Route path="/login" element={<Login />} />
              {/* <Route path="*" element={<Error404 />} /> */}
            </Routes>
        </AuthContextProvider>
      </FullScreenProvider>
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
export default App;