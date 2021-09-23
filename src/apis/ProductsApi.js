import axios from "axios";

const doserviceGetAllProduct = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_ENGINE_URL}getAllProduct` , {
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

const doserviceGetBrand = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_ENGINE_URL}getBrand` , {
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

const doserviceGetConfig = (name) => {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_ENGINE_URL}getConfig/${name}` , {
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

const doserviceGetProductType = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_ENGINE_URL}getProductType` , {
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

const doserviceCreateProduct = (data) => {
    return new Promise((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_ENGINE_URL}createProduct`,data, {
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

const doserviceUpdateProduct = (data) => {
    return new Promise((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_ENGINE_URL}updateProduct`,data, {
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

const doserviceDeleteProduct = (data) => {
    return new Promise((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_ENGINE_URL}deleteProduct`,data, {
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

const doserviceDeleteImage = (path) => {
    let fileName = path.split("/");
    fileName = fileName[4]
    return new Promise((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_ENGINE_URL}deleteImage/${fileName}`, {
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

const doserviceGetProductById = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_ENGINE_URL}getProductById/${id}`, {
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

const doserviceGetProductByKey = (key) => {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_ENGINE_URL}getProductByKey/${key}`, {
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

const doserviceGetProductByType = (typeId) => {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_ENGINE_URL}getProductByType/${typeId}`, {
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

const doserviceGetProductAllByType = (typeId) => {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_ENGINE_URL}getProductAllByType/${typeId}`, {
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
    doserviceGetAllProduct,
    doserviceGetBrand,
    doserviceGetProductType,
    doserviceGetConfig,
    doserviceCreateProduct,
    doserviceUpdateProduct,
    doserviceDeleteProduct,
    doserviceGetProductById,
    doserviceGetProductByKey,
    doserviceDeleteImage,
    doserviceGetProductByType,
    doserviceGetProductAllByType
}

export default apis;