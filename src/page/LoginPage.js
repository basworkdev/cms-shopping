import React ,{useState,useEffect} from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import conTxt from "../config/text.json";
import LoginApi from "../apis/LoginApi"

export default function LoginPage(props) {
    const { register, handleSubmit, watch, errors } = useForm();
    let history = useHistory();

    useEffect(()=>{
        localStorage.clear();
    },[])

    
    const onSubmit = async (data) => {
        let md5 = require('md5');
        let loginData = {
            userName : data.userName,
            password : md5(data.password)
        }
        const login = await LoginApi.doserviceLogin(loginData);
        if(login.code === 1) {
            localStorage.setItem("user" , JSON.stringify({
                userName : loginData.userName,
                name : login.name
            }));
            window.location.replace("/dashboard");
        }else {
            alert(login.message);
        }
    }
    
    return(
        <>
        <div className="container" style={{paddingTop : "100px",paddingBottom : "100px"}}>
            <h1 className="text-center font-weight-bold">Login</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>User</label>
                    <input type="text" name="userName" ref={register({ required: true })} className="form-control"/>
                    {errors.userName && <small className="form-text text-danger">{conTxt.validate.requestFiles}</small>}
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" ref={register({ required: true })} className="form-control"/>
                    {errors.password && <small className="form-text text-danger">{conTxt.validate.requestFiles}</small>}
                </div>
                <center><button type="submit" className="btn btn-primary">login</button></center>
            </form>
        </div>
        </>
    )
}