import React from 'react';
import Classes from './Header.module.css'
import { AiOutlineLogout } from "react-icons/ai";
import { IconContext } from "react-icons";
import { useHistory } from 'react-router'
import img from './BEBOP.png'
const Header = () => {
    const history = useHistory();

    const onLogOutClick=()=>{
        localStorage.setItem("currentUser" , null);
        history.push("/");
        window.location.reload();
    }
    return (
        <div className={Classes.header2}>
            
            <div className={Classes.logoDiv}>
                <img src={img} className={Classes.logo}></img>
            </div>
        </div>
    );
};

export default Header;