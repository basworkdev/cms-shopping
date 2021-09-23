import React ,{useState,useEffect} from "react";
import { useHistory } from "react-router-dom";

export default function MenuTopComp(props) {
    let history = useHistory();
    useEffect(() => {
        if(!localStorage.getItem("user")) {
            localStorage.clear();
            window.location.replace('/login');
        }
    }, [])

    const logout = () => {
        localStorage.clear();
        window.location.replace('/login');
    }
    const changeHistory = (location) => {
        history.push(location)
    }
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container">
                <a className="navbar-brand" href="#">หน้าหลัก</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{cursor : "pointer"}}>
                    <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <a className="nav-link" href="/all-product">สินค้า</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/all-order">คำสั่งซื้อ</a>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Dropdown
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a className="dropdown-item" href="#">Action</a>
                        <a className="dropdown-item" href="#">Another action</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#">Something else here</a>
                        </div>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link disabled" href="#" tabIndex="-1" aria-disabled="true">Disabled</a>
                    </li>
                    </ul>
                    <div className="form-inline my-2 my-lg-0">
                    <button className="btn btn-outline-light my-2 my-sm-0" onClick={()=>logout()}>Logout</button>
                    </div>
                </div>
                </div>
            </nav>
        </>
    )
}