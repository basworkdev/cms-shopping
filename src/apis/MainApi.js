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

const doserviceUploadImageBase64 = (data) => {
    return new Promise((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_ENGINE_URL}uploadImage`, data , {
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

const doserviceGetCarModel = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_ENGINE_URL}getCarModel`, {
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

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const UploadImageBase64 = async (e , callback) => {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = async function () {
            let image = {};
            let data = file
            let fileName = "";
            
            if(data.size > 500000) {
                alert(`Over 500 KB size "${data.name}"`);
                
            } else {
                const typeFileList = ["PNG","JPG","JPEG"];
                const typeFile = (file.name.split('.')[1]).toUpperCase();
                if( typeFileList.includes(typeFile)) {
                    let dataBase64 = await toBase64(data);
                    var dateObj = new Date();
                    let month = (("0" + (dateObj.getMonth() + 1)).slice(-2)).toString()
                    let day = (("0" + dateObj.getDate()).slice(-2)).toString()
                    let year = (dateObj.getFullYear()).toString();
                    let hours = (("0" + dateObj.getHours()).slice(-2)).toString();
                    let minutes = (("0" + dateObj.getMinutes()).slice(-2)).toString();
                    let milliseconds = (dateObj.getMilliseconds()).toString();
                    
                    fileName = year + month + day + hours + minutes + milliseconds + data.name ;
                    image = {
                        name : `${fileName}`,
                        size : data.size,
                        data : dataBase64.split(',')[1]
                    }
                } else {
                    alert(`The file type is invalid.`);
                }
            }
            callback(image)
            
        };
        reader.readAsDataURL(file);
}

const x = async (e) => {
    let x = await UploadImageBase64(e,(image) => {
    console.log(image)
    return image
    });
    return x
    // return x
    
}

const apis = {
    doserviceUploadImage,
    doserviceUploadImageSlipPay,
    percentSell,
    getProvinces,
    getAmphure,
    getDistricts,
    getPostCode,
    UploadImageBase64,
    x,
    doserviceUploadImageBase64,
    doserviceGetCarModel
}

export default apis;