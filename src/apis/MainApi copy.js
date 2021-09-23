import axios from "axios";
import pv from "../config/province.json"
import ap from "../config/amphures.json"
import ds from "../config/districts.json"
let _ = require('lodash');

const doserviceUploadImage = (formData) => {
    return new Promise((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_ENGINE_URL}upload`, formData , {
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

const doserviceUploadImageSlipPay = (formData) => {
    let data = {
        formData : formData,
        // tel : tel,
        folder : ""
    }
    return new Promise((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_ENGINE_URL}uploadFolder`, formData , {
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

const percentSell = (fullPrice , price) => {
    const discount = fullPrice - price;
    const percent = (discount/fullPrice) * 100;
    return percent;
}

const getProvinces = () => {
    return _.sortBy(pv, ['name_th']);
}

const getAmphure = (province_id) => {
    let amphure = _.filter(ap,{province_id : parseInt(province_id)})
    return _.sortBy(amphure, ['name_th']); 
}

const getDistricts = (amphure_id) => {
    amphure_id = amphure_id.toString()
    let districts = []
    for(let i=0 ; i<ds.length ; i++ ) {
        let idDs = ds[i].id.toString();
        idDs = idDs.substring(0, 4);
        if(idDs === amphure_id) {
            districts.push(ds[i])
        }
    }

    return _.sortBy(districts, ['name_th']);
}

const getPostCode = (districts_id) => {
    let postCode = _.find(ds , {id : districts_id})
    return postCode.zip_code
}


const apis = {
    doserviceUploadImage,
    doserviceUploadImageSlipPay,
    percentSell,
    getProvinces,
    getAmphure,
    getDistricts,
    getPostCode
}

export default apis;