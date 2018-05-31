/**
 * Created by fei on 14/06/2017.
 */

const url_base = 'https://www.mochongsoft.com/pinpke/';

let ServiceVar = {
  login_captcha: url_base+'smsCode/get',
  login_doLogin: url_base+'doLogin',
  login_register: url_base+'register/add',
  login_checkToken: url_base+'token/status/get',
  login_logout: url_base+'loginOut',

  goods_getList: url_base+'goods/getGoodsList',
  goods_getDetail: url_base+'goods/getGoodDetail',
  goods_getPromotionUrl: url_base+'goods/getGoodPromotionUrl',
  goods_get_share_link:url_base+'goods/share',

  order_getList: url_base+'order/getOrderList',

  member_getUser: url_base+'member/get',
  member_settlement: url_base+"user/settlement/get",
  member_setInviteCode: url_base+"user/inviteCode/get",
  member_getTeamInfo: url_base+"team/get",
  member_getTeamStatistic: url_base+"team/orderStatistics/get",

  pay_fee_get:url_base+'pay/fee/get',
  pay_pay: url_base+'pay/toPay',


};

export default ServiceVar;