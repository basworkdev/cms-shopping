import React, {  useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import bootbox from 'bootbox';
// import UploadFileApi from '../apis/UploadFileApi'

import MainApi from "../apis/MainApi"


export default function TinyEditerComp(props) {
    const [pathState] = useState(props.mainPath ? props.mainPath : "image");
    const [editerState , setEditerState] = useState()

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
    useEffect(()=>{
        setEditerState(props.value)
    },[props.value])

    return(
        <div style={{marginTop:"-40px"}}>

            {/* 
            --- origin ---
            https://www.tiny.cloud/docs/demo/file-picker/# 
            */}
            <div className="tiny-main">
            <div style={{width : "100%" , marginBottom : "10px"}} className="text-right" >
                <button type="button" className="btn btn-outline-secondary" data-toggle="modal" data-target="#previewEditer">Preview</button>
            </div>
            <Editor
            name="desc"
            id='checklist'
            //initialValue={factorDataState.desc ? factorDataState.desc : ""}
            apiKey="c5gudmhpi5va3nmu52sse35zw3jhv2op991l34rglvc2rkzo"
            value={props.value ? props.value : null}
            
            init={{
                selector: "textarea#checklist",
                height: props.height ? props.height : 500,
                menubar: true,
                plugins: [
                    'advlist autolink lists link image',
                    'charmap print preview anchor help',
                    'searchreplace visualblocks code',
                    'insertdatetime media table paste wordcount'
                ],
                toolbar:
                'undo redo | formatselect | bold italic backcolor | codesample \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | image help',


                /* enable title field in the Image dialog*/
                image_title: true,
                /* enable automatic uploads of images represented by blob or data URIs*/
                automatic_uploads: true,
                /*
                    URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
                    images_upload_url: 'postAcceptor.php',
                    here we add custom filepicker only to Image dialog
                */
                file_picker_types: 'image',
                /* and here's our custom image picker*/
                // images_upload_base_path: 'https://phanechon.com/travel/tra-img/tra-img-maina-jpg/tra-57.jpg',
                file_picker_callback: function (cb, value, meta) {
                    var input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');

                    /*
                    Note: In modern browsers input[type="file"] is functional without
                    even adding it to the DOM, but that might not be the case in some older
                    or quirky browsers like IE, so you might want to add it to the DOM
                    just in case, and visually hide it. And do not forget do remove it
                    once you do not need it anymore.
                    */

                    input.onchange = function () {

                        var file = this.files[0];
                        let uploadStatus = true;
                        var reader = new FileReader();
                        let uploadImage;
                        reader.onload = async function () {
                            let data = file
                            let fileName = "";
                            if(data.size > 10000000) {
                                bootbox.alert(`Over 10 MB size "${data.name}"`);
                                uploadStatus = false;
                            } else {
                                const formData = new FormData() // #สร้างตัวแปร มารับ Class FormData
                                formData.append('file', file) // #arg แรกนั้นเป็น ชื่อ Key ส่วน arg2 เป็น Value
                                uploadImage = await MainApi.doserviceUploadImage(formData);
                                // setImageResState(uploadImage);
                                console.log(uploadImage)
                                uploadStatus = true;
                            } 

                            if(uploadStatus === true) {
                                cb(`${process.env.REACT_APP_ENGINE_URL}/images/${uploadImage.filename}`, { title: file.name });
                            }
                        };
                        reader.readAsDataURL(file);
                        };

                    input.click();
                }
            }}
            // onChange={(e) => onChangeEditer(e)}
            // onBlur={() => onBlurEditer()}
            onEditorChange={(e)=>{props.onChangeEditer(e) ; setEditerState(e)}}
            // onEditorChange={(e)=>{setEditerState(e)}}
        />
        </div>


        {/* <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
        Launch demo modal
        </button> */}
        <div className="modal fade" id="previewEditer" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Preview</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div dangerouslySetInnerHTML={{ __html: editerState }} />
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>
                        
        </div>
    )
}