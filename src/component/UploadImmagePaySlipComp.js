import React ,{useState,useEffect} from "react";
import { BrowserRouter as Router, useParams ,useHistory } from "react-router-dom";
import axios from "axios";
import bootbox from 'bootbox';
import tc from "../config/text.json"

// Apis
import MainApi from "../apis/MainApi"
import OrderApi from "../apis/OrderApi"

// CSS
import "../assets/css/paymnet-page.css"

// Comp
import SpinnerComp from "./SpinnerComp"


export default function UploadImageComp(props) {
    let history = useHistory();
    const [spinnerState,setSpinnerState] = useState(false);
    const [file, setFile] = useState({}) // ## ใช้เพื่อส่งไปที่ API
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null) // ##ใช้เพื่อภาพ Preview
    const [imageResState , setImageResState] = useState({});
    const [imageState,setImageState] = useState();
    const [showImageState , setShowImageState] = useState();

    const handleUploadImage = (e) => { 
        const file = e.target.files[0] // ## เก็บไว้ setState ลงใน file
        const reader = new FileReader(); // ## เรียก Class FileReader เพื่อแปลง file image ที่รับเข้ามา
        reader.onloadend = () => { // ## เป็น eventของFileReaderเมื่อโหลดภาพเสร็จ
            setFile(file) // ## ทำการ setState
            setImagePreviewUrl(reader.result) // ##เหมือนด้านบน
            // props.uploadImage(reader.result)
            setShowImageState(reader.result)
        }
        reader.readAsDataURL(file) // ## เป็นส่วนของการแสดงรูป ไม่ค่อยแน่ใจครับ ผู้รู้ช่วยคอมเม้นบอกด้วยนะครับ
    }

    const onClickUpload = async () => {
        const formData = new FormData() // #สร้างตัวแปร มารับ Class FormData
        formData.append('file', file) // #arg แรกนั้นเป็น ชื่อ Key ส่วน arg2 เป็น Value
        // let uploadImage = await MainApi.doserviceUploadImage(formData);
        // setImageResState(uploadImage);
        // console.log(uploadImage)
        // props.onClickUpload(uploadImage); 
        console.log(formData)
        setImageState(formData);
        // props.upload(formData)
    }

    const saveOrder = async () => {
        setSpinnerState(true)
        let resp = await MainApi.doserviceUploadImageSlipPay(imageState);
        if(resp.filename) {
            let dataUpdate = {
                orderId : props.order.orderId,
                pay_status : props.order.pay_status,
                pay_date : new Date(),
                status : props.order.status,
                pay_image : `${process.env.REACT_APP_ENGINE_URL}imagesSlipPay/${resp.filename}`
            }
            let respUpdate = await OrderApi.doserviceUpdateSlip(dataUpdate);
            if(respUpdate.code === 1) {
                nextStepPage();
            }
        } else {
            bootbox.alert(tc.validate.errorUploadImage);
        }
        setSpinnerState(false)
        setShowImageState(resp);
        console.log("resp",resp);
        //history.push(`/order-status/${orderId}`)
    }

    const nextStepPage = () => {
        if(props.nextStepPage) {
            history.push(props.nextStepPage)
        } else {
            props.uploadStatus(1)
        }
    }
        
   
    return (
        <>
            <SpinnerComp spinner={spinnerState}/>
            <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-4">
                    <div style={{marginBottom : 20}}>
                    {imageState ?
                    <img 
                        // src={`${process.env.REACT_APP_ENGINE_URL}imagesSlipPay/${showImageState.filename}`}
                        src={`${showImageState}`}
                        width="100%"
                    />
                    : 
                    <></>
                    }
                    
                    </div>
                </div>
            </div>
            <div className="box-payment">
                <div>
                    <div style={{marginBottom : "-110px"}}>
                        <div style={{paddingTop:30}}>
                            {props.detailShow ?
                            <p className="text-secondary text-center">
                                ยังไม่มีเอกสาร
                            </p>
                             :
                            <div style={{paddingTop:20}}></div>}
                            
                            <center><button type="button" class="btn btn-danger btn-lg">อัพโหลดหลักฐานการชำระเงิน (คลิก)</button></center>
                        </div>
                    </div>
                    <input 
                        type="file"
                        className="file-upload" 
                        style={{marginTop : "-100px"}}
                        onChange={handleUploadImage}
                        onBlur={(e)=>{onClickUpload();}}
                    />
                    
                </div>   
            </div>
            <br/>
            <center><button type="button" class="btn btn-primary btn-lg" onClick={()=>{saveOrder()}}>ส่งหลักฐานการชำระเงิน</button></center>

             
        </>
    )
}