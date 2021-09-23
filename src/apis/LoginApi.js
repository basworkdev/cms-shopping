import axios from "axios";

const doserviceLogin = (data) => {
    return new Promise((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_ENGINE_URL}login`, data , {
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
    doserviceLogin
}

export default apis;