import axios from "axios";

const doserviceGetProvinces = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_ENGINE_URL}getProvinces` , {
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

const doserviceGetAmphures = (province_id) => {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_ENGINE_URL}getAmphures/${province_id}` , {
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

const doserviceGetDistricts = (amphure_id) => {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_ENGINE_URL}getDistricts/${amphure_id}` , {
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
    doserviceGetProvinces,
    doserviceGetAmphures,
    doserviceGetDistricts
}

export default apis;