import React , {useState , useEffect} from "react";
import { Modal } from 'react-bootstrap';

// Comp
import UploadImmagePaySlipComp from "./UploadImmagePaySlipComp"
export default function ModalShowUploadSlip(props) {
    const [showImageState , setShowImageState] = useState();
    return (
        <>
        <Modal show={props.show} size="lg" onHide={()=>{props.onChange(false)}}>
            <Modal.Header closeButton>
            <Modal.Title style={{fontSize:"1.2rem"}}><b><span><i class="fas fa-upload"></i></span> อัพโหลดหลักฐานการชำระเงิน</b></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <UploadImmagePaySlipComp
                detailShow={showImageState ? false : true} 
                order={props.order} 
                uploadStatus={(e) => {props.uploadStatus(e)}}
                />
            </Modal.Body>
        </Modal>
        </>
    )
}