import { useState } from 'react'
import { Link } from 'react-router-dom'

const full_logo = "src/assets/images/companyzone-logo-vert-thin.png";
const mini_logo = "src/assets/images/companyzone-icon.png";

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
          <img src={company_logo} />
      </Link>
      <nav>
        { children }
      </nav>
    </aside>
  );
}

export default SideBar