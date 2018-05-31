/**
 * Created by fei on 14/06/2017.
 */
import Api from './Api';
import ServiceVar from './ServiceVar';
import storage, { STORAGE_KEY_USER_INFO, STORAGE_KEY_TOKEN } from '../utils/Storage';

export let PAGE_SIZE = 10;
let globalToken = "";
let globalUserId = "";
export function loginGetCaptcha(mobile, forLogin=true ) {
  return commonGetRequest(ServiceVar.login_captcha, {"mobile": mobile, "isRegister": !forLogin});
}

export function loginDoLogin(mobile, captcha) {
  return commonPostRequest(ServiceVar.login_doLogin, {"mobile": mobile, "smsCode":captcha})
    .then((response) => {
      globalToken = response.entry.token;
      globalUserId = response.entry.userId;
      storage.setItem(STORAGE_KEY_USER_INFO, JSON.stringify(response.entry));
      return response;
    });
}

export function loginRegister(mobile, captcha, inviteCode) {
  return commonPostRequest(ServiceVar.login_register, {"mobile": mobile, "smsCode":captcha, "inviteCode":inviteCode})
    .then((response) => {
      globalToken = response.entry.token;
      globalUserId = response.entry.userId;
      storage.setItem(STORAGE_KEY_USER_INFO, JSON.stringify(response.entry));
      return response;
    });
}

export function checkToken() {
  return commonGetRequest(ServiceVar.login_checkToken, {"userId": globalUserId})
    .then((response)=> {
      if (response.entry.isTokenExpired) {
        return Promise.reject(new Error("token失效，请重新登录")); 
      }
      return response;
    });
}

export function loginLogout() {
  return commonGetRequest(ServiceVar.login_logout, {"userId": globalUserId})
    .then((response)=> {
      storage.removeItem(STORAGE_KEY_USER_INFO);
      globalUserId = "";
      globalToken = "";
      return response;
    });
}

export function goodsList(sortType, withCoupon=false, page=1, pageSize=10,categoryId=0, keyword=null) {
  let params = {"page": page, "pageSize": pageSize, 
                "sortType": sortType, "withCoupon": withCoupon, "userId": globalUserId};
  if (keyword && typeof(keyword) === "string" && keyword.length > 0) {
    params = {...params, "keyword": keyword};
  } else {
    params = {...params, "categoryId": categoryId};
  }
  return commonGetRequest(ServiceVar.goods_getList, params);
}

export function goodDetail(goodId) {
  return commonGetRequest(ServiceVar.goods_getDetail, 
                            {"userId":globalUserId, "goodId": goodId});
}

export function getGoodPromotionUrl(pId, goodId) {
  return commonGetRequest(ServiceVar.goods_getDetail, 
                            {"userId":globalUserId, "p_id": pId, "goodId": goodId});
}

export function getOrderList(page=1,pageSize=10,orderType=0,extensionType=0){
  return commonGetRequest(ServiceVar.order_getList, 
                            {"userId": globalUserId, "page": page, "pageSize": pageSize,
                              "orderStatus": orderType, "extensionType": extensionType});
}

export function getGoodShareLink(goodId){
  return commonGetRequest(ServiceVar.goods_get_share_link, 
                            {"userId":globalUserId,"goodId": goodId});
}

/**
 * 获取会员信息
 */
export function getMemberInfo() {
  return commonGetRequest(ServiceVar.member_getUser, {"userId":globalUserId});
}

/**
 * 创建支付订单
 * @param {*金额} fee 
 * @param {*支付类型} type 
 */
export function createPay(fee, type=1) {
  return commonPostRequest(ServiceVar.pay_pay, {"fee": fee, "type": type});
}

export function payFeeGet(){
    return commonGetRequest(ServiceVar.pay_fee_get, {"userId": globalUserId});
}

export function getSettlement() {
  return commonGetRequest(ServiceVar.member_settlement, {"userId":globalUserId});
}

export function getInviteCode() {
  return commonGetRequest(ServiceVar.member_setInviteCode, {"userId":globalUserId});
}

export function getTeamInfo() {
  return commonGetRequest(ServiceVar.member_getTeamInfo, {"userId":globalUserId});
}

/*
 * 团队订单统计接口*
 * @parameter dateType: 1-今日；2-昨日；3-本月；4-上月
 */
export function getTeamStatistic(dateType) {
  return commonGetRequest(ServiceVar.member_getTeamStatistic, {"userId":globalUserId, "dateType":dateType});
}

/**
 * 通用post请求接口
 * @param {*} url 
 * @param {请求参数} parameters 
 * @param {成功函数} resolve 
 * @param {失败函数} reject 
 * @param {默认为true，false为表单形式形式} jsonParam 
 */
export function commonPostRequest(url,parameters,jsonParam=true) {
  return Api
    .ajax(url, "POST", parameters, jsonParam, {"token": globalToken})
    .then((response) => {
      if (!response.status) {
        return Promise.reject(new Error(response.message));
      }
      return response;
    });
}

/**
 * 通用get请求接口
 * @param {*} url 
 * @param {*} parameters 
 * @param {*} resolve 
 * @param {*} reject 
 */
export function commonGetRequest(url, parameters){
  let fullUrl;
  let param = '';
  for (let key in parameters){
     param += '&'+key + '='+ parameters[key];
  }
  if(param.length > 0){
    fullUrl = url + '?' + param.substring(1, param.length);
  }else{
    fullUrl = url;
  }
  return Api
    .ajax(fullUrl, "GET", null, false, {"token": globalToken})
    .then((response) => {
      if (!response.status) {
        return Promise.reject(new Error(response.message));
      }
      return response;
    });
}

export function prefetchToken(resolve) {
  storage.getItem(STORAGE_KEY_USER_INFO)
    .then((result)=>{
      if (result && result.length > 5){
        let userInfo = JSON.parse(result);
        globalToken = userInfo.token;
        globalUserId = userInfo.userId;
        resolve && resolve();
      }
    });
}

export function updateUserInfo(updateData) {
  storage.getItem(STORAGE_KEY_USER_INFO)
  .then((result)=>{
    if (result && result.length > 5){
      let userInfo = JSON.parse(result);
      userInfo = {...userInfo, ...updateData };
      storage.setItem(STORAGE_KEY_USER_INFO, JSON.stringify(userInfo)); 
    }
  });
}
