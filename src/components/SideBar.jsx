import { useState } from 'react'
import { Link } from 'react-router-dom'
import full_logo from "../assets/images/companyzone-logo-vert-thin.png"
import mini_logo from "../assets/images/companyzone-icon.png"

function SideBar({children}) {
  const [showSideBar, SetShowSideBar] = useState(true);
  const company_logo = showSideBar?full_logo:mini_logo;
  
  return (
    <aside className={`${showSideBar?'show':'hide'} thin-scroll`}>
      <span className="hamburger" onClick={()=>SetShowSideBar(!showSideBar)}>
        <span className='line'></span>
        <span className='line'></span>
        <span className='line'></span>
      </span>
      <Link className="brand-logo" to="/dashboard">
          <img src={company_logo} 
          key = {company_logo}
          loading='lazy'/>
      </Link>
      <nav>
        { children }
      </nav>
    </aside>
  );
}

export default SideBar