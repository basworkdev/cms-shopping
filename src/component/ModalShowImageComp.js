import React , {useState , useEffect} from "react";
import { Modal } from 'react-bootstrap';
export default function ModalShowImageComp(props) {

    return (
        <>
        <Modal show={props.show} size="lg" onHide={()=>{props.onChange(false)}}>
            <Modal.Header closeButton>
            {/* <Modal.Title style={{fontSize:"1.2rem"}}><b><span className="text-success"><i class="fas fa-check"></i></span> สินค้าจำนวน 1 รายการได้ถูกเพิ่มลงในรถเข็นของท่าน</b></Modal.Title> */}
            </Modal.Header>
            <Modal.Body>
                {props.image ? <img src={props.image} width="100%"/> : ""}
            </Modal.Body>
        </Modal>
        </>
    )
}