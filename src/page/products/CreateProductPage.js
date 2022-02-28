import React ,{useState,useEffect} from "react";
import { useForm  } from "react-hook-form";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import ProductsApi from '../../apis/ProductsApi'
import Select from 'react-select';
import tc from '../../config/text.json'
import {storage} from "../../firebase"

// Comp
import UploadImageComp from '../../component/UploadImageComp'
import TinyEditerComp from '../../component/TinyEditerComp';
import SpinnerComp from "../../component/SpinnerComp"

// Apis
import MainApi from '../../apis/MainApi'

export default function CreateProductPage(props) {
  let { event,id } = useParams();
  let _ = require('lodash');
  let moment = require('moment');
  const { register, handleSubmit, watch, errors } = useForm();
  const [spinnerState,setSpinnerState] = useState(false);
  const [dataBrandState , setDataBrandState] = useState([]);
  const [dataProductTypeState , setDataProductTypeState] = useState([]);
  const [dataColorState , setDataColorState] = useState([]);
  const [selectColorState , setSelectColorState] = useState([]);
  const [imagesUploadState , setImagesUploadState] = useState([]);
  const [selectTypeState , setSelectTypeState] = useState({});
  const [typeState , setTypeState] = useState("");
  const [selectBrandState,selectSetBrandState] = useState({})
  const [brandState , setBrandState] = useState("");
  const [productState , setProductState] = useState([]);
  const [selectSalesType,setSelectSalesType] = useState({ value: 'CASH', label: 'Cash' })
  const [salesType , setSalesType] = useState([
        { value: 'CASH', label: 'Cash' },
        { value: 'PREORDER', label: 'Pre-order' }
  ])
  const [showImageState , setShowImageState] = useState({  
      main : null,
      image : []
  })
  const [fileImageState , setFileImageState] = useState({  
    main : null,
    image : []
})

  const tcv = tc.validate.requestFiles;
  
  useEffect( async () => {
    if(event === "create") {
        setProductState({...productState,stock : 0})
    } else if(event === "edit") {
        let pdList = await ProductsApi.doserviceGetProductById(id);
        let pd = pdList[0];
        setProductState(pd);
        setSelectTypeState({ value: pd.typeId, label: pd.typeName })
        setTypeState(pd.typeId)
        selectSetBrandState({ value: pd.brandId, label: pd.brandName_th })
        setShowImageState({
            main : pd.mainImg ? pd.mainImg : "",
            image : pd.img ? pd.img.split(",") : []
        })
        setFileImageState({
            main : pd.mainImg ? pd.mainImg : "",
            image : pd.img ? pd.img.split(",") : []
        })
        // setImagesUploadState( pd.img ? pd.img.split(",") : [])
        setSelectColorState(pd.color.split(","))
        // setOldMainImageState(pd.mainImg);
        let salesTypeData = _.find(salesType , {value : pd.salesType})
        setSelectSalesType(salesTypeData)
        console.log("edit : " , pd);
    }
    getBrand();
    getProductType();
    getProductColor();
  }, []);
 
  
  const getBrand = async () => {
    let brandList = await ProductsApi.doserviceGetBrand();
    let brand = brandList.map((data,index)=>{
        return { value: data.id, label: data.name };
    })
    setDataBrandState(brand);
  }
  const getProductType = async () => {
    let typeList = await ProductsApi.doserviceGetProductType();
    let type = typeList.map((data,index)=>{
        return { value: data.id, label: data.name_th };
    })
    setDataProductTypeState(type);
  }
  const getProductColor = async () => {
    let colorData = await ProductsApi.doserviceGetConfig("PRODUCT_COLOR");
    colorData = (colorData[0].value).split(",")
    let color = colorData.map((data,index)=>{
        return data
    })
    setDataColorState(color);
  }

  const selectColor = (data) => {
    setSelectColorState([...selectColorState,data]);
  }
  const removeColor = (data) => {
    let color = selectColorState;
    let evens = _.remove(color, function(n) {
        return n !== data;
    });
    setSelectColorState([...evens]);
  }


  const clickUpload = (e) => {
    setImagesUploadState([...imagesUploadState , e.filename]);
  }

  const removeUpload = (index) => {
    let showImage = showImageState.image;
    let fileImage = fileImageState.image
    
    // let evensShowImage = _.remove(showImage, function(n) {
    //     return n !== data;
    // });
    // let evensFileImage = _.remove(fileImage, function(n) {
    //     return n !== data;
    // });
    showImage.splice(index, 1);
    fileImage.splice(index, 1);
    setShowImageState({
        ...showImageState,
        image : showImage
    });
    setFileImageState({
        ...fileImageState,
        image : fileImage
    })
  }

  const selectType = (e) => {
    setSelectTypeState({ value: e.value, label: e.label })
    setTypeState(e.value)
  }

  const selectBrand = (e) => {
    selectSetBrandState({ value: e.value, label: e.label })
    setBrandState(e.value)
  }

  const statusClick = () => {
    let st = productState.status;
    if(st === "Y") {
        st = "N"
    }else {
        st = "Y"
    }
    setProductState({...productState,status : st})
  }


  const handleUploadImage = (e,type) => { 
    try {
        const file = e.target.files[0] // ## เก็บไว้ setState ลงใน file
        const reader = new FileReader(); // ## เรียก Class FileReader เพื่อแปลง file image ที่รับเข้ามา
        reader.onloadend = () => { // ## เป็น eventของFileReaderเมื่อโหลดภาพเสร็จ
            if(type === "MAIN") {
                setShowImageState({
                    ...showImageState,
                    main : reader.result,
                })
            } else {
                let imageList = showImageState.image;
                imageList.push(reader.result);
                setShowImageState({
                    ...showImageState,
                    image : imageList,
                })
            }
        }
        reader.readAsDataURL(file) // ## เป็นส่วนของการแสดงรูป ไม่ค่อยแน่ใจครับ ผู้รู้ช่วยคอมเม้นบอกด้วยนะครับ
        if(file){
            if(type === "MAIN") {
                setFileImageState({
                    ...fileImageState,
                    main : e.target.files[0]
                })
            } else {
                if(e.target.files[0]) {
                    let imageList = fileImageState.image;
                    imageList.push(e.target.files[0]);
                    setFileImageState({
                        ...fileImageState,
                        image : imageList
                    })
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const saveImage = (data) => {
    try {
        const uploadTask = storage.ref(data.pageUrl).put(data.file);
        return new Promise(resolve => {
            uploadTask.on(
            "state_changed",
            snapshot => {
                const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                // setProgress(progress);
                console.log("progress",progress)
            },
            error => {
                console.log(error);
            },
            () => {
                storage
                .ref(data.ref)
                .child(data.imageName)
                .getDownloadURL()
                .then(url => {
                    // setUrlImage(url)
                    resolve(url)
                    // console.log(url)
                });
            }
            );
        });
    } catch (error) {
        console.log(error)
        
    }
    
    //history.push(`/order-status/${orderId}`)
}

  const saveMainImage = async (data) => {
      
    if(data.file.name) {
        let filePage = `product/${data.key}/`
        let ref = `product/${data.key}`
        let imageName = `main-${data.key}`;
        let pageUrl = filePage+imageName
        let file = data.file
        data = {
            filePage,
            ref,
            imageName,
            pageUrl,
            file
        }
        return await saveImage(data)
    } else {
        return data.file
    }
    
  }

  const saveImages = async (data) => {
    let image = []
    for(let i=0;i<data.file.length;i++){
        if(data.file[i].name) {
            let filePage = `product/${data.key}/`
            let ref = `product/${data.key}`
            let imageName = `${data.key}-${i}`
            let pageUrl = filePage+imageName
            let file = data.file[i]
            let dataImg = {
                filePage,
                ref,
                imageName,
                pageUrl,
                file
            }
            let saveImageData = await saveImage(dataImg)
            image.push(saveImageData)
        } else {
            image.push(data.file[i])
        }
    }
    image = image.toString();
    return image;
  }

  const onSubmit = async (data) => {
    setSpinnerState(true)
    try {
        data.status = data.status === true ? data.status = "Y" : data.status = "N";
        console.log(data);
        let create;
        let mainImage = {
            file : fileImageState.main,
            key : data.productKey
        }
        let image = {
            file : fileImageState.image,
            key : data.productKey
        }
        data.mainImg = await saveMainImage(mainImage)
        data.img = await saveImages(image)
        if(event === "create") {
            create = await ProductsApi.doserviceCreateProduct(data);
        } else if(event === "edit") {
            data.id = id
            create = await ProductsApi.doserviceUpdateProduct(data);
        }
        setSpinnerState(false)
        if(create.code === 1) {
            // if(event === "edit" && uploadMainImageState === true) {
            //     ProductsApi.doserviceDeleteImage(oldMainImageState);
            // }
            alert(create.message);
        } else {
            alert(tcv.error);
        }
    } catch (error) {
        setSpinnerState(false)
        alert(tc.SYSTEMERROR)
    }
    
  }

  const tinyEditerChange = (e) => {
    setProductState({...productState,subDetail : e})
 }

  return(
      <>
      <SpinnerComp spinner={spinnerState}/>
          <div className="container admin-page">
              <h2>{event === "create" ? "เพิ่ม" : "แก้ไข"}สินค้า</h2>
              <br/>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>คีย์สินค้า</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="productKey" 
                                ref={register({ required: true })}
                                defaultValue={productState.productKey}
                            />
                            {errors.productKey && <span className="text-danger">{tcv}</span>}
                        </div>
                        <div className="form-group">
                            <label>ชื่อสินค้า</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="name" 
                                ref={register({ required: true })}
                                defaultValue={productState.name}    
                            />
                            {errors.name && <span className="text-danger">{tcv}</span>}
                        </div>
                        <div className="form-group">
                            <label>รายละเอียดหลัก</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="mainDetail" 
                                ref={register({ required: false })}
                                defaultValue={productState.mainDetail}    
                            />
                            {errors.mainDetail && <span className="text-danger">{tcv}</span>}
                        </div>
                        <div className="form-group">
                            <label>รายละเอียด</label>
                            <textarea 
                                rows="3" 
                                className="form-control" 
                                name="detail" 
                                ref={register({ required: false })}
                                defaultValue={productState.detail}
                            >
                            </textarea>
                            {errors.detail && <span className="text-danger">{tcv}</span>}
                        </div>
                        <div className="form-group">
                            <label>รายละเอียดเพิ่มเติม</label>
                            <TinyEditerComp onChangeEditer={(e) => tinyEditerChange(e)} value={productState.subDetail} height="500" />
                            <input
                                type="hidden"
                                rows="3" 
                                className="form-control" 
                                name="subDetail" 
                                ref={register({ required: false })}
                                defaultValue={productState.subDetail}
                            />
                            {errors.subDetail && <span className="text-danger">{tcv}</span>}
                        </div>
                        <div className="form-group">
                            <label>ราคา</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="price" 
                                ref={register({ required: true })}
                                defaultValue={productState.price}
                            />
                            {errors.price && <span className="text-danger">{tcv}</span>}
                        </div>
                        <div className="form-group">
                            <label>ราคาเต็ม</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="fullPrice" 
                                ref={register({ required: true })}
                                defaultValue={productState.fullPrice}
                                />
                            {errors.fullPrice && <span className="text-danger">{tcv}</span>}
                        </div>
                        <div className="form-group">
                            <label>ค่าจัดส่ง</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="deliveryCost" 
                                ref={register({ required: true })}
                                defaultValue={productState.deliveryCost}
                                />
                            {errors.deliveryCost && <span className="text-danger">{tcv}</span>}
                        </div>
                        
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>แบรนด์</label>
                            <Select 
                                options={dataBrandState} 
                                value={selectBrandState}
                                onChange={(e)=>selectBrand(e)}
                            />
                            <input type="hidden" className="form-control" name="brand" value={selectBrandState.value} ref={register({ required: true })}/>
                            {errors.brand && <span className="text-danger">{tcv}</span>}
                        </div>
                        <div className="form-group">
                            <label>ประเภท</label>
                            <Select 
                                options={dataProductTypeState} 
                                value={selectTypeState}
                                onChange={(e)=>selectType(e)}
                            />
                            <input type="hidden" className="form-control" name="type" value={typeState.toString()} ref={register({ required: false })}/>
                            {errors.type && <span className="text-danger">{tcv}</span>}
                        </div>
                        <div className="form-group">
                            <label>สี</label>
                            <div style={{border : "1px solid #aaa" ,padding : "10px 30px 10px 30px"}}>
                                <div className="row">
                                    {selectColorState.map((data,index)=>{
                                        return <div 
                                            className="col-1" 
                                            style={{marginRight : "10px", width:"100%" , height : "30px" , backgroundColor : `${data}` , cursor : "pointer"}}
                                            onClick={()=>removeColor(data)}
                                        ></div>
                                    })}
                                </div>
                            </div>
                            <br/>
                            <p>เลือกสี</p>
                            <div style={{paddingLeft : "10px"}}>
                                <div className="row">
                                    {dataColorState.map((data,index)=>{
                                        return <div 
                                            className="col-1" 
                                            style={{marginRight : "10px", width:"100%" , height : "30px" , backgroundColor : data , cursor : "pointer"}}
                                            onClick={()=>selectColor(data)}
                                        ></div>
                                    })}
                                </div>
                                <input type="hidden" name="color" value={selectColorState.toString()} ref={register({ required: true })}/>
                            </div>
                            {errors.color && <span className="text-danger">{tcv}</span>}
                        </div>
                        <div className="form-group">
                            {/* {imageState.mainImageData ? imageState.mainImageData.data : ""} */}
                            <label>อัพโหลดรูปภาพหลัก</label>
                            {/* <div style={{width : "50%"}}>
                                {productState.mainImg ? <img src={`${process.env.REACT_APP_ENGINE_URL}images/${productState.mainImg}`} width="100%"/> : ""}
                            </div> */}
                            <div style={{width : "50%"}}>
                                {showImageState.main ? <img src={showImageState.main} width="100%"/> : ""}
                            </div>
                            <br/>
                            <input type="file" onChange={(e)=>handleUploadImage(e,"MAIN")}/>
                            {/* <UploadImageComp onClickUpload={(e)=>clickUploadMainImg(e)} /> */}
                            <br/>
                            {/* <input type="hidden" name="img" value={imageState.mainImageUrl} ref={register({ required: true })}/> */}
                            {errors.img && <span className="text-danger">{tcv}</span>}
                        </div>
                        <div className="form-group">
                            <label>อัพโหลดรูปภาพ</label>
                            <div style={{border : "1px solid #aaa" ,padding : "10px 30px 10px 30px"}}>
                                {showImageState.image.length>0 ?
                                    <div className="row">
                                    {showImageState.image.map((data,index)=>{
                                        return <div 
                                            className="col-3" 
                                            style={{marginRight : "10px", cursor : "pointer" , paddingBottom : 10}}
                                            onClick={()=>removeUpload(index)}
                                        >
                                            <img src={data} width="100%"/>
                                        </div>
                                    })}
                                </div>
                                : ""}
                                <div>
                                    <button type="button" className="btn btn-success">เพิ่ม</button>
                                    <input 
                                        type="file" 
                                        style={{width:50,height:40,marginLeft:-50,opacity:0,cursor:"pointer"}}
                                        onChange={(e)=>handleUploadImage(e,"IMAGE")}
                                    />
                                </div>
                                
                                
                            </div>
                            <br/>
                            {/* <UploadImageComp onClickUpload={(e)=>clickUpload(e)} /> */}

                            <br/>
                            <input type="hidden" name="img" value={showImageState.image.toString()} ref={register({ required: true })}/>
                            {errors.img && <span className="text-danger">{tcv}</span>}
                        </div>
                        <div className="form-group">
                            <label>สต๊อก</label>
                            <input 
                                type="number" 
                                name="stock" 
                                className="form-control" 
                                defaultValue={productState.stock} 
                                ref={register({ required: true })}
                            />
                            {errors.stock && <span className="text-danger">{tcv}</span>}
                        </div>
                        <div className="form-group">
                            <label>ประเภทการขาย</label>
                            <Select 
                                options={salesType} 
                                value={selectSalesType}
                                onChange={(e)=>setSelectSalesType(e)}
                            />
                            <input hidden className="form-control" name="salesType" value={selectSalesType.value} ref={register({ required: true })}/>
                            {errors.stock && <span className="text-danger">{tcv}</span>}
                        </div>

                        <div className="form-group">
                            <label>สถานะ</label>
                            <br/>
                            <label className="switch">
                                <input type="checkbox" name="status" ref={register({ required: false })} onClick={()=>statusClick()} checked={productState.status === "Y" || event === "create" ? true : false }/>
                                {errors.status && <span className="text-danger">{tcv}</span>}
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <br/>
                <center><button className="btn btn-primary" type="submit">บันทึก</button></center>
              </form>
              {/* <button onClick={()=>submitImage(fileImageState.main)}>ok</button> */}
          </div>
      </>
  )
}