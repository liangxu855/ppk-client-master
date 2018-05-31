import Api from './Api';

/**
 * create by xiazifei
 * 请求类封装
 */
export default class Request {
    constructor(props) {
        this.parameters = {};
        this.url = '';
        this.method = 'POST';
        this.jsonParam = true;
    }

    /**
     * 设置请求url
     */
    setUrl = (url) => {
        this.url = url;
    }

    /**
     * 添加请求参数
     */
    addParam = (key, value) => {
        this.parameters[key] = value;
    }

    /**
     * 一次性添加所有请求参数
     */
    addAllParam = (params) => {
        this.parameters = params;
    }

    /**
     * 设置GET请求调用
     */
    setGet = () => {
        this.method = 'GET';
    }

    /**
     * 设置post请求调用，jsonParam为false则为xform方式
     */
    setPost = (jsonParam = true) => {
        this.method = 'POST';
        this.jsonParam = jsonParam;
    }

    /**
     * 调用网络请求，传入成功和失败回调函数
     */
    start=(resolve = null, reject = null) => {
        // debugger
        if (this.method == 'POST') {
            this.postRequest(resolve, reject);
        } else if (this.method == 'GET') {
            this.getRequest(resolve, reject);
        }
    }

    /**
     * post请求方式
     */
    postRequest=(resolve = null, reject = null) => {
        Api
            .ajax(this.url, 'POST', this.parameters, this.jsonParam)
            .then((respose) => {
                resolve && resolve(respose);
            })
            .catch((error) => {
                reject && reject(error);
            });
    }

    /**
     * get请求方式
     */
    getRequest=(resolve = null, reject = null) => {
        let fullUrl;
        let param = '';
        for (const key in this.parameters) {
            param += `&${key}=${this.parameters[key]}`;
        }
        if (param.length > 0) {
            fullUrl = `${this.url}?${param.substring(1, param.length)}`;
        } else {
            fullUrl = this.url;
        }
        Api
            .ajax(fullUrl)
            .then((respose) => {
                resolve && resolve(respose);
            })
            .catch((error) => {
                reject && reject(error);
            });
    }
}
