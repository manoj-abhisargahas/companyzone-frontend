import { NavLink, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import SideBar from './SideBar'
import Dashboard from './Dashboard'
import ToDoZone from './ToDoZone'
import ViewEmployees from './ViewEmployees'
import AddEmployee from './AddEmployee'
import UpdateEmployee from './UpdateEmployee'
import Error404 from './Error404'


function CompanyZone() {
  const location = useLocation();  
  const isViewEmpActive = location.pathname.startsWith('/updateemployee');

  return (
    <div className="root-container">
      <SideBar showSideBar={true}>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/addemployee">Add Employee</NavLink>
        <NavLink to="/viewemployees" className={isViewEmpActive?'active':''}>View Employees</NavLink>
        <NavLink to="/todolist">To Do Zone</NavLink>
      </SideBar>
      <main>
        <Routes>
          <Route path="" element={ <Navigate to="/dashboard" replace/> } ></Route>
          <Route path="dashboard/" element={ <Dashboard /> } />
          <Route path="addemployee" element={ <AddEmployee /> }/>
          <Route path="updateemployee/:eno" element={ <UpdateEmployee /> }/>
          <Route path="viewemployees" element={ <ViewEmployees /> }/>
          <Route path="todolist" element={ <ToDoZone /> }/>
          <Route path="*" end element={ <Error404 /> }/>
        </Routes>
      </main>
    </div>
  );
}

export default CompanyZone