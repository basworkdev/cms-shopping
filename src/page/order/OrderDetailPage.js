import React ,{useState,useEffect} from "react";
import { useForm  } from "react-hook-form";
import DataTable from 'react-data-table-component';
import ProductsApi from '../../apis/ProductsApi'
import { useHistory , useParams } from "react-router-dom";
import Select from 'react-select';
import tc from '../../config/text.json'
import itemCon from '../../config/itemConfig.json'
import bootbox from 'bootbox';

// Apis
import OrderApi from '../../apis/OrderApi'

// Comp
import DeliveryAddressComp from "../../component/DeliveryAddressComp";
import ModalShowImageComp from "../../component/ModalShowImageComp";
import ModalShowUploadSlip from "../../component/ModalShowUploadSlip";
import SpinnerComp from "../../component/SpinnerComp"


export default function OrderDetailPage(props) {
    const { register, handleSubmit, watch, errors } = useForm();
    let _ = require('lodash');
    const {orderId} = useParams();
    let moment = require('moment');
    let numeral = require('numeral');
    const tcv = tc.validate.requestFiles;
    const selectedDefault = { value: "", label: "" };
    const [spinnerState,setSpinnerState] = useState(false);
    const [orderState,setOrderState] = useState({});
    const [orderDetailState,setOrderDetailState] = useState([]);
    const [imageState , setImageState] = useState({
        image : "",
        show : false
    })
    const [uploadSlipState , setupLoadSlipState] = useState({
        show : false
    })
    const [payStatusState , setPayStatusState] = useState(itemCon.payStatus);
    const [orderStatusState , setOrderStatusState] = useState(itemCon.orderStatus);
    const [deliveryCompanyState , setDeliveryCompanyState] = useState(itemCon.deliveryCompany);
    const [updateNumState , setUpdateNumState] = useState(0)

    // Selected
    const [selectedOrderStatusState , setSelectedOrderStatusState] = useState({ value: "", label: "" });
    const [selectedPayStatusState , setSelectedPayStatusState] = useState({ value: "", label: "" });
    const [selectedDeliveryCompanyState , setSelectedDeliveryCompanyState] = useState({ value: "", label: "" , trace: "" })

    useEffect(()=>{
        getOrder();
    },[updateNumState])

    const getOrder = async () => {
        setSpinnerState(true)
        let orderData = await OrderApi.doserviceGetOrderById(orderId);
        let orderDetailData = await OrderApi.doserviceGetOrderAndOrderDetail(orderId);
        orderData = orderData[0]
        console.log("orderData" , orderData);
        console.log("orderDetailData" , orderDetailData);
        
        let selectedOrderStatus = orderData.status ? _.find(orderStatusState , {value : orderData.status}) : selectedDefault;
        let selectedPayStatus = orderData.pay_status ? _.find(payStatusState , {value : orderData.pay_status}) : selectedDefault;
        selectedDefault.trace = ""
        let selectedDeliveryCompany = orderData.delivery_company ? _.find(deliveryCompanyState , {value : orderData.delivery_company}) : selectedDefault;
        setOrderState(orderData);
        setOrderDetailState(orderDetailData);
        setSelectedOrderStatusState(selectedOrderStatus);
        setSelectedPayStatusState(selectedPayStatus);
        setSelectedDeliveryCompanyState(selectedDeliveryCompany);

        setSpinnerState(false)

    }

    const showImage = (e) => {
        setImageState({
            image : e,
            show : true
        })
    }

    const columns = [
    {
        name: '',
        selector: '',
        sortable: true,
        width : "50px",
        cell: (data) => {
            return <><font style={{fontSize : "1.2rem" , cursor : "pointer"}} onClick={()=>showImage(`${process.env.REACT_APP_ENGINE_URL}images/${data.mainImg}`)}><i class="fas fa-image"></i></font></>
        }
    },
    {
        name: 'รหัสสินค้า',
        selector: 'productKey',
        sortable: true,
        width : "250px"
    },
    {
        name: 'ชื่อ',
        selector: 'name',
        sortable: true,
        width : "250px"
    },
    {
        name: 'แบรนด์',
        selector: 'brandName_th',
        sortable: true,
    },
    {
        name: 'รุ่นรถ',
        selector: 'carModel',
        sortable: true,
        width : "200px"
    },
    {
        name: 'สี',
        selector: 'color',
        sortable: true,
        cell: (data) => {
            return <div class="pro-color-page-mini active" style={{backgroundColor : data.color}}></div>
        }
    },
    {
        name: 'ราคาเต็ม',
        selector: 'fullPrice',
        sortable: true,
        cell: (data) => {
            let value = "-"
            if(data) {
              value = numeral(data.fullPrice).format('0,0')
            }
            return value;
        }
    },
    {
        name: 'ราคา',
        selector: 'price',
        sortable: true,
        cell: (data) => {
            let value = "-"
            if(data) {
              value = numeral(data.price).format('0,0')
            }
            return value;
        }

    },
    {
        name: 'ค่าส่ง',
        selector: 'deliveryCost',
        sortable: true,
        cell: (data) => {
            let value = "-"
            if(data) {
              value = numeral(data.deliveryCost).format('0,0')
            }
            return value;
        }
    },
    {
        name: 'จำนวน',
        selector: 'order_amount',
        sortable: true,
        cell: (data) => {
            let value = "-"
            if(data) {
              value = numeral(data.order_amount).format('0,0')
            }
            return value;
        }
    }
    ];

    const setNumber = (data) => {
        let value = 0
        if(data) {
            value = numeral(data).format('0,0')
        }
        return value;
    }

    const showProduct = (e) => {
        window.open( `/product/${e.productKey}`, '_blank');
    }

    const checkUploadSlip = (status) => {
        if(status === 1) {
            setupLoadSlipState({...uploadSlipState,show : false});
            bootbox.alert(tc.SUCCESS);
            setUpdateNumState(updateNumState + 1)
        }
    }

    const onSubmit = async (data) => {
        data.orderId = orderId;
        if(!data.pay_date) {
            data.pay_date = null
        }
        if(!data.delivery_date) {
            data.delivery_date = null
        }
        setSpinnerState(true)
        let resp = await OrderApi.doserviceUpdateOrderDetail(data);
        setSpinnerState(false)
        bootbox.alert(resp.message);
        setUpdateNumState(updateNumState + 1)

        
    }

    const payDetailForm = () => {
        return <>
            <h2>การชำระเงิน</h2>
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label>สถานะการชำระเงิน</label>
                        <Select 
                            options={payStatusState} 
                            value={selectedPayStatusState}
                            onChange={(e)=>setSelectedPayStatusState(e)}
                        />
                        <input hidden className="form-control" name="pay_status" value={selectedPayStatusState.value} ref={register({ required: false })}/>
                        {errors.pay_status && <span className="text-danger">{tcv}</span>}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label>วันที่</label>
                        <input className="form-control" type="date" name="pay_date" defaultValue={moment(orderState.pay_date).format("YYYY-MM-DD")} ref={register({ required: false })}/>
                        {errors.pay_date && <span className="text-danger">{tcv}</span>}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label>หลักฐานการชำระ</label>
                        <br/>
                        <button type="button" class="btn btn-secondary" onClick={()=>showImage(orderState.pay_image)}>ดูหลักฐานการชำระเงิน</button>&nbsp;&nbsp;
                        <button type="button" class="btn btn-primary" onClick={()=>setupLoadSlipState({...uploadSlipState , show : true})}>อัพโหลดหลักฐานการชำระเงิน</button>
                    </div>
                </div>
            </div>
        </>
    }


    const StatusOrderForm = () => {
        return <>
            <h2>รายละเอียดสถานะสินค้า</h2>
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label>สถานนะการสั่งซื้อ</label>
                        <Select 
                            options={orderStatusState} 
                            value={selectedOrderStatusState}
                            onChange={(e)=>setSelectedOrderStatusState(e)}
                        />
                        <input hidden className="form-control" name="status" value={selectedOrderStatusState.value} ref={register({ required: false })}/>
                        {errors.status && <span className="text-danger">{tcv}</span>}
                    </div>
                </div>
            </div>
            <div className="box-main">
                <h5 className="font-weight-bold"><span><i class="fas fa-truck"></i></span> การจัดสั่ง</h5>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>บริษัทขนส่ง</label>
                            <Select 
                                options={deliveryCompanyState} 
                                value={selectedDeliveryCompanyState}
                                onChange={(e)=>setSelectedDeliveryCompanyState(e)}
                            />
                            <input hidden className="form-control" name="delivery_company" value={selectedDeliveryCompanyState.value} ref={register({ required: false })}/>
                            {errors.delivery_company && <span className="text-danger">{tcv}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>วันที่ส่ง</label>
                            <input className="form-control" type="date" name="delivery_date" defaultValue={orderState.delivery_date ? moment(orderState.delivery_date).format("YYYY-MM-DD") : null }  ref={register({ required: false })}/>
                            {errors.delivery_date && <span className="text-danger">{tcv}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>เลขพัสดุ</label>
                            <input className="form-control" type="text" name="delivery_number" defaultValue={orderState.delivery_number} ref={register({ required: false })}/>
                            {errors.delivery_number && <span className="text-danger">{tcv}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>ลิ้งค์ติดตามสินค้า</label>
                            <input className="form-control" type="text" name="delivery_trace" defaultValue={orderState.delivery_trace} value={selectedDeliveryCompanyState.trace} ref={register({ required: false })}/>
                            {errors.delivery_trace && <span className="text-danger">{tcv}</span>}
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    }

    return(
        <>
        <SpinnerComp spinner={spinnerState}/>
        <ModalShowImageComp 
            show={imageState.show} 
            image={imageState.image} 
            onChange={(e)=>setImageState({...imageState , show : e})}
        />
        <ModalShowUploadSlip 
            show={uploadSlipState.show} 
            onChange={(e)=>setupLoadSlipState({...uploadSlipState , show : e})}
            order={{
                orderId : orderId,
                pay_status : "PAY",
                status : "PAY"
            }}
            uploadStatus={(e)=>checkUploadSlip(e)}
        />
            <div className="container admin-page">
                <h2>รายละเอียดการสั่งซื้อ รายการ <span className="font-weight-bold">{orderId}</span></h2>
                <p>สถานะการสั่งซื้อ <span className="font-weight-bold">{orderState.status}</span></p>
                <div className="row" style={{marginTop : "20px"}}>
                    <div className="col-md-6">
                        <div className="box-main">
                            <h5 className="font-weight-bold"><span><i class="fas fa-money-bill-wave-alt"></i></span> สรุปยอดสั่งซื้อ</h5>
                            <div className="row">
                                <div className="col-7">
                                    <p>ยอดรวม ( จำนวน {setNumber(orderState.amount)} ชิ้น )</p>
                                </div>
                                <div className="col-5 text-right">
                                    <p>{setNumber(orderState.sum_full_price)} บ.</p>
                                </div>
                                <div className="col-7">
                                    <p>ส่วนลด</p>
                                </div>
                                <div className="col-5 text-right">
                                    <p>{setNumber(orderState.sum_discount)} บ.</p>
                                </div>
                                <div className="col-7">
                                    <p>รวม</p>
                                </div>
                                <div className="col-5 text-right">
                                    <p>{setNumber(orderState.sum_price)} บ.</p>
                                </div>

                                <div className="col-7">
                                    <p>ค่าจัดส่ง</p>
                                </div>
                                <div className="col-5 text-right">
                                    <p>{setNumber(orderState.sum_shipping_cost)} บ.</p>
                                </div>

                                <div className="col-7">
                                    <p>ยอดรวมทั้งหมด</p>
                                </div>
                                <div className="col-5 text-right">
                                    <p className="font-weight-bold">{setNumber(orderState.total)} บ.</p>
                                </div>
                            </div>
                        </div>
                        <br/>
                    </div>
                    <div className="col-md-6">
                        <div className="box-main">
                            <h5 className="font-weight-bold"><span><i class="fas fa-truck"></i></span> ที่อยู่ในการจัดส่ง</h5>
                            <p>{orderState.customer_name}</p>
                            <p>{orderState.customer_tel}</p>
                            <p>{orderState.customer_address} ,
                            ต. {orderState.customer_district} &nbsp; 
                            อ. {orderState.customer_amphure} &nbsp;
                            จ. {orderState.customer_province} &nbsp;
                            {orderState.customer_postcode}
                            <hr/>
                            email : {orderState.customer_email}
                            </p>
                        </div>
                        <br/>
                    </div>
                </div>
                <p>รายการสินค้าที่สั่งซื้อ <span className="font-weight-bold">{setNumber(orderState.amount)}</span> ชิ้น</p>
                <div>
                <DataTable
                    noHeader
                    columns={columns}
                    data={orderDetailState}
                    pagination
                    persistTableHead
                    style={{backgroundColor : "none"}}
                    onRowClicked={(e)=>showProduct(e)}
                />
                </div>
                
                <hr/>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {payDetailForm()}
                    <hr/>
                    {StatusOrderForm()}
                    <br/>
                    <center><button type="submit" class="btn btn-primary">บันทึก</button></center>
                </form>
            </div>
        </>
    )
}