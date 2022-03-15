import React ,{useState,useEffect} from "react";
import { BrowserRouter as Router, useParams ,useHistory } from "react-router-dom";
import axios from "axios";
import bootbox from 'bootbox';
import tc from "../config/text.json"
import {storage} from "../firebase"

// Apis
import MainApi from "../apis/MainApi"
import OrderApi from "../apis/OrderApi"

// CSS
import "../assets/css/paymnet-page.css"

// Comp
import SpinnerComp from "./SpinnerComp"


export default function UploadImageComp(props) {
    let history = useHistory();
    let moment = require('moment');
    const [spinnerState,setSpinnerState] = useState(false);
    const [file, setFile] = useState({}) // ## ใช้เพื่อส่งไปที่ API
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null) // ##ใช้เพื่อภาพ Preview
    const [imageResState , setImageResState] = useState({});
    const [imageState,setImageState] = useState();
    const [image,setImage] = useState(null)
    const [showImageState , setShowImageState] = useState();
    const [progress, setProgress] = useState(0);
    const [urlImage,setUrlImage] = useState("")

    useEffect(()=>{
        console.log("useEffect urlImage 01" , urlImage)
        try {
            if(progress === 100 && urlImage) {
                console.log("useEffect urlImage 02" , urlImage)
                updateOrder(urlImage)
            }
        } catch (error) {
            console.log(error)
        }
        
    },[progress,urlImage])

    const handleUploadImage = (e) => { 
        try {
            const file = e.target.files[0] // ## เก็บไว้ setState ลงใน file
            const reader = new FileReader(); // ## เรียก Class FileReader เพื่อแปลง file image ที่รับเข้ามา
            reader.onloadend = () => { // ## เป็น eventของFileReaderเมื่อโหลดภาพเสร็จ
                setFile(file) // ## ทำการ setState
                setImagePreviewUrl(reader.result) // ##เหมือนด้านบน
                // props.uploadImage(reader.result)
                setShowImageState(reader.result)
            }
            reader.readAsDataURL(file) // ## เป็นส่วนของการแสดงรูป ไม่ค่อยแน่ใจครับ ผู้รู้ช่วยคอมเม้นบอกด้วยนะครับ
            if(file){
                setImage(e.target.files[0])
            }
        } catch (error) {
            console.log(error)
        }
        
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
        try {
            setSpinnerState(true)
            let filePage = "paySlip/"
            const imageName = `${moment().format("YYMMDDHHmmss").toString()}-${props.order.orderId}-${(Math.floor(Math.random()*(999-100+1)+100)).toString()}`;
            let pageUrl = filePage+imageName
            const uploadTask = storage.ref(pageUrl).put(image);

            uploadTask.on(
            "state_changed",
            snapshot => {
                const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
                console.log("progress",progress)
            },
            error => {
                console.log(error);
            },
            () => {
                storage
                .ref("paySlip")
                .child(imageName)
                .getDownloadURL()
                .then(url => {
                    setUrlImage(url)
                });
            }
            );
        } catch (error) {
            setSpinnerState(false)
            console.log(error)
            
        }
        
        //history.push(`/order-status/${orderId}`)
    }

    const updateOrder = async (url) => {
        console.log("upload")
        try {
            setSpinnerState(true)
            if(url) {
                let dataUpdate = {
                    orderId : props.order.orderId,
                    pay_status : props.order.pay_status,
                    pay_date : new Date(),
                    status : props.order.status,
                    pay_image : url
                }
                let respUpdate = await OrderApi.doserviceUpdateSlip(dataUpdate);
                if(respUpdate.code === 1) {
                    nextStepPage();
                }
            } else {
                bootbox.alert(tc.validate.errorUploadImage);
            }
            setSpinnerState(false)
        } catch (error) {
            setSpinnerState(false)
            console.log(error)
        }
        // setShowImageState(resp);
        // console.log("resp",resp);
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