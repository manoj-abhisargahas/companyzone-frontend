import { NavLink, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
import SideBar from './SideBar'
import Dashboard from './Dashboard'
import ToDoZone from './ToDoZone'
import Error404 from './Error404'
import { RightPaneProvider } from './MainContent'
import { useAuthContext } from './Authentication'
// ----------------------------------------------------------------------------
import { lazy, Suspense } from 'react';

// STANDARD IMPORTS (Avoid these for heavy pages/dashboards)
// import AddEmployee from './AddEmployee'
// import ViewEmployees from './ViewEmployees'
// import UpdateEmployee from './UpdateEmployee'

// COMPONENTS LOADED ON-DEMAND (Code-Splitting)
const AddEmployee = lazy(()=>import('./AddEmployee'));
const ViewEmployees = lazy(()=>import('./ViewEmployees'));
const UpdateEmployee = lazy(()=>import('./UpdateEmployee'));

// VISUAL FALLBACK ELEMENT
// This shows up during the split-second while the browser fetches the new JavaScript chunk
import { PageLoaderSkeleton } from './Skeletons'
// ----------------------------------------------------------------------------

function CompanyZone() {
  const location = useLocation();  
  const isViewEmpActive = location.pathname.startsWith('/updateemployee');
  const {logout} = useAuthContext();

  return (
    <div className="root-container">
      <SideBar showSideBar={true}>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/addemployee">Add Employee</NavLink>
        <NavLink to="/viewemployees" className={isViewEmpActive?'active':''}>View Employees</NavLink>
        <NavLink to="/todozone">To Do Zone</NavLink>
        <Link to="/dashboard" onClick={logout}>Logout</Link>
      </SideBar>
      <main>
        <RightPaneProvider>
          {/* The Suspense boundary intercepts the loading state of any lazy component inside it */}
          <Suspense fallback={<PageLoaderSkeleton />}>
            <Routes>
              <Route path="" element={ <Navigate to="/dashboard" replace/> } ></Route>
              <Route path="dashboard" element={ <Dashboard /> } />
              <Route path="addemployee" element={ <AddEmployee /> }/>
              <Route path="updateemployee/:eno" element={ <UpdateEmployee /> }/>
              <Route path="viewemployees" element={ <ViewEmployees /> }/>
              <Route path="todozone" element={ <ToDoZone /> }/>
              <Route path="*" end element={ <Error404 /> }/>
            </Routes>
          </Suspense>
        </RightPaneProvider>
      </main>
    </div>
  );
}

export default CompanyZone