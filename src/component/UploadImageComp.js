import React ,{useState,useEffect} from "react";
import axios from "axios";
import MainApi from "../apis/MainApi"


export default function UploadImageComp(props) {
    const [file, setFile] = useState({}) // ## ใช้เพื่อส่งไปที่ API
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null) // ##ใช้เพื่อภาพ Preview
    const [imageResState , setImageResState] = useState({});

    const handleUploadImage = (e) => { 
        const file = e.target.files[0] // ## เก็บไว้ setState ลงใน file
        const reader = new FileReader(); // ## เรียก Class FileReader เพื่อแปลง file image ที่รับเข้ามา
        reader.onloadend = () => { // ## เป็น eventของFileReaderเมื่อโหลดภาพเสร็จ
            setFile(file) // ## ทำการ setState
            setImagePreviewUrl(reader.result) // ##เหมือนด้านบน
        }
        reader.readAsDataURL(file) // ## เป็นส่วนของการแสดงรูป ไม่ค่อยแน่ใจครับ ผู้รู้ช่วยคอมเม้นบอกด้วยนะครับ
    }

    const onClickUpload = async () => {
        const formData = new FormData() // #สร้างตัวแปร มารับ Class FormData
        formData.append('file', file) // #arg แรกนั้นเป็น ชื่อ Key ส่วน arg2 เป็น Value
        let uploadImage = await MainApi.doserviceUploadImage(formData);
        setImageResState(uploadImage);
        console.log(uploadImage)
        props.onClickUpload(uploadImage); 
    }
        
   
    return (
        <>
            {/* <img
                src={imagePreviewUrl ? imagePreviewUrl :    "https://dcvta86296.i.lithium.com/t5/image/serverpage/image--id/14321i0011CCD2E7F3C8F8/image-size/large?v=1.0&px=999"
            }
                style={{width: "500px", height: "500px"}}
            />  */}
            <input 
                type="file"
                onChange={handleUploadImage}
            />
            <button type="button" onClick={()=>{onClickUpload()}}> Upload </button>
             
        </>
    )
}