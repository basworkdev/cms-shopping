import axios from "axios";

const doserviceSaveOrder = (data) => {
    return new Promise((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_ENGINE_URL}saveOrder` , data , {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
        .then(res => {
            resolve(res.data);
        }).catch(reason => {
            reject(reason);
        })
    });
}

const doserviceGetOrderAndOrderDetail = (orderId) => {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_ENGINE_URL}getOrderAndOrderDetail/${orderId}` , {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
        .then(res => {
            resolve(res.data);
        }).catch(reason => {
            reject(reason);
        })
    });
}

const doserviceGetOrderById = (orderId) => {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_ENGINE_URL}getOrderById/${orderId}` , {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
        .then(res => {
            resolve(res.data);
        }).catch(reason => {
            reject(reason);
        })
    });
}

const doserviceGetOrderAll = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_ENGINE_URL}getOrderAll` , {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
        .then(res => {
            resolve(res.data);
        }).catch(reason => {
            reject(reason);
        })
    });
}

const doserviceUpdateSlip = (data) => {
    let dataUpdate = {
        orderId : data.orderId,
        pay_status : data.pay_status,
        pay_date : data.pay_date,
        status : data.status,
        pay_image : data.pay_image
    }
    return new Promise((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_ENGINE_URL}updateSlip` , dataUpdate, {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
        .then(res => {
            resolve(res.data);
        }).catch(reason => {
            reject(reason);
        })
    });
}

const doserviceSearchOrder = (data) => {
    return new Promise((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_ENGINE_URL}searchOrder` , data, {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
        .then(res => {
            resolve(res.data);
        }).catch(reason => {
            reject(reason);
        })
    });
}

const doservicesearchOrderDetailByOrderId = (order_id) => {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_ENGINE_URL}searchOrderDetailByOrderId/${order_id}` , {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
        .then(res => {
            resolve(res.data);
        }).catch(reason => {
            reject(reason);
        })
    });
}

const doserviceUpdateOrderDetail = (data) => {
    return new Promise((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_ENGINE_URL}updateOrderDetail` , data, {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
        .then(res => {
            resolve(res.data);
        }).catch(reason => {
            reject(reason);
        })
    });
}


const apis = {
    doserviceSaveOrder,
    doserviceGetOrderAndOrderDetail,
    doserviceUpdateSlip,
    doserviceGetOrderById,
    doserviceSearchOrder,
    doservicesearchOrderDetailByOrderId,
    doserviceGetOrderAll,
    doserviceUpdateOrderDetail
}

export default apis;