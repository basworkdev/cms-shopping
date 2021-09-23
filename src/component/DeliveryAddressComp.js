import React , {useState , useEffect} from "react";

// CSS
import '../assets/css/delivery-address.css'

export default function DeliveryAddressComp(props) {
    const [orderState,setOrderState] = useState([]);
    useEffect(()=>{
        console.log(props.order)
        setOrderState(props.order[0])
    },[props.order])

    return <>
        {orderState ?
        <div className="box-main">
            <h5 className="font-weight-bold"><span><i class="fas fa-truck"></i></span> ที่อยู่ในการจัดส่ง</h5>
            <p>{orderState.customer_name}</p>
            <p>{orderState.customer_tel}</p>
            <p>{orderState.customer_address} ,
            ต. {orderState.customer_district} &nbsp; 
            อ. {orderState.customer_amphure} &nbsp;
            จ. {orderState.customer_province} &nbsp;
            {orderState.customer_postcode}
            </p>
        </div>
        :
        <></>
        }
        
    </>
}