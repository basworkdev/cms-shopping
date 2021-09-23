import React , {useState , useEffect} from "react";
export default function SpinnerComp (props) {
    return (
        <>
        {props.spinner ?
            <div className="background-loader" >
            <div className="sk-chase">
                <div className="loader">Loading...</div>
            </div>
            </div>
        : <></> }
        
        </>
    )
}