import { LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()

export class AppGlobal {
    //缓存key的配置
    static cache: any = {
        slides: "_dress_slides",
        categories: "_dress_categories",
        products: "_dress_products",
        Test: "_dress_test"
    }
    //接口基地址
    static domain = 'https://www.jhzyapp.com'
    static domainimage = 'https://www.jhzyapp.com'

    //static domain = 'http://125.74.9.49:7768'
    //static domainimage = 'http://125.74.9.49:7769'
    //static domainimage = 'http://www.jhzyapp.com:7769/'
    static domainvideo = 'http://125.74.9.49:7769/'

    static APK_DOWNLOAD = '/apk/jhzy_jhzxb2b.apk';// 下载地址
    static APK_ADMIN_DOWNLOAD = '/apk/android-jhzx-admin.apk';// 下载地址
    static APP_DOWNLOAD = 'itms-apps://itunes.apple.com/lookup?id=1329918420';//苹果地址
    //接口地址
    static API: any = {
        getAccountStatus: '/api/customer/account/state/',//获取账户状态
        getSystemRegional: '/api/resources/system/regional/',//管-获取地区
        postVerification: '/api/customer/verify/post',//客-发送验证码
        postRegister: '/api/customer/register/post/',//客-注册
        postIsMobile: '/api/customer/ismobile/post/',//客-手机号是否已存在
        postlogin: '/api/customer/login/post/',//客-登录
        postClientInfo: '/api/enterprise/fbenterprise/post/',//客-首营提交
        postClientRestPwd: '/api/customer/findPwd/post/',//客-重置密码
        postFindRestPwd: '/api/customer/findpwdany/post/',//客-找回密码
        getfbenterprise: '/api/enterprise/registeenterprise/info',//客-首营信息获取
        getfbenterpriseStatus: '/api/enterprise/fbenterprise/stateinfo/',//客-首营状态
        getGoodsClassInfoC: '/api/products/rclass/info',//客-获取商品分类
        postGoodsListInfoC: '/api/products/productlist/info/',//客- 根据分类获取商品
        postGoodsDetailInfoC: '/api/products/productdetail/info/',//客- 根据分类获取商品详情
        postDelivery: '/api/customer/delivery/post/',//客-提交收货地址
        postShoppingCartInfo: '/api/shoppingcart/post/info/',//客-添加商品到购物车
        getShoppingCartAll: '/api/shoppingcart/get/allinfo/',//获取购物车信息
        postShoppingCartGoodsNum: '/api/shoppingcart/updata/info/',//获取购物车数量添加
        postShoppingCartDel: '/api/shoppingcart/bulkdelete/info/',//获取购物车数量删除
        postShoppingCartOrder: '/api/shoppingcart/select/info/',//购物车商品加入订单
        postShoppingCartOrderAll: '/api/shoppingcart/bulkselect/info/',//购物车商品加入订单批量
        getOederinfo: '/api/order/prepare/info/',//获取客户订单
        getPayMethod: '/api/order/paymethod/info/',//获取支付方式
        getDistribution: '/api/order/distribution/info/',//获取支付方式
        getDeliveryDef: '/api/customer/delivery/default/',//获取默认收货地址
        getDeliveryAll: '/api/customer/delivery/info/',//获取收货地址
        postDeliveDefault: '/api/customer/delivery/updatascdefault/',//设置默认地址
        postDeliveDel: '/api/customer/delivery/deleteinfo/',//删除收货地址
        postDeliveUpdate: '/api/customer/delivery/updatainfo/',//修改收货地址
        getInvoiceType: '/api/order/invoicetype/info/',//获取发票类型
        getInvoiceNInfo: '/api/order/normalinvoice/info/',//获取发票类型
        getInvoiceEInfo: '/api/order/electronicinvoice/info/',//获取发票类型
        postOrderInfo: '/api/order/remittancemthod/postinfo/',//提交订单
        postOrderInfoByAccount: '/api/order/byaccountid/info/',//获取前台订单根据账户
        postOrderInfoByStatus: '/api/order/bystateid/info/',//获取前台订单根据状态
        postOrderInfoAfterSale: '/api/order/byorderefund/info/',//获取可以售后的订单
        postOrderInfoByID: '/api/order/byorderid/info/',//获取前台订单根据状态
        postOrderConfirm: '/api/order/receipt/postinfo/', //确认收货
        postOrderComment: '/api/order/commassessment/postinfo/', //提交订单评价
        postOrderCommentInfo: '/api/order/commassessment/postinfo/', //获取订单评价
        postExpressInfo: '/api/order/delivery/logisticsinfo/', //获取快递单号
        posLogisticsInfo: '/api/order/courier/info/', //获取快递变化
        postReturnApply: '/api/order/refund/postinfo/', //退货申请
        getMyPointInfo: '/api/customer/integralrecords/info/', //获取积分
        postGoodsSQ: '/api/products/upc/Info/', //获取二维码商品
        postGoodsComment: '/api/order/commassessment/info/', //获取商品评价
        postUserAppTag: '/api/customer/apptag/post/', //提交用户极光推送的id
        getUserAppTag: '/api/customer/apptag/isinfo/', //判断用户是否极光推送id
        getUserMessage: '/api/customer/msginfo/post/', //获取用户消息
        getMessageCount: '/api/customer/msgcount/post/', //获取用户未读消息总数(false)
        setMessageRead: '/api/customer/msgread/post/',//设置信息已读
        deteleMessag: '/api/customer/msgdel/post/',//删除信息
        getUserInfo: '/api/customer/avatar/info/',//获取用户图像
        postUserImg: '/api/customer/avatar/postinfo/',//上传用户图像
        getSystemVersion: '/api/resources/systemversion/postinfo',//获取软件版本
        getHomePageType: '/api/pages/pagestype/info',//获取首页页面类型
        getHomePageClass: '/api/pages/pagescategory/info',//获取首页页面分类页
        getHomePageInfo: '/api/pages/pagesall/info',//获取首页页面信息_所有
        getHomePageByClassID: '/api/pages/pagesbycategoryId/info',//获取首页页面信息_分类ID
        postOrderByAliPay: '/api/order/paymentalipay/getinfo',//获取首页页面信息_分类ID
        postOrderInfoByLine: '/api/order/ordersubmit/postinfo/',//提交订单线上支付
        getpostOrderInfoAlipay: '/api/order/paymentalipay/getinfo/',//根据订单id获取订单信息（支付宝）

        postUeserlogin: '/api/users/login/post/',//管-登录
        getFbenterpriseWait: '/api/enterprise/fbenterprise/minfo/',//管-首营审核
        postEnterpriseInfo: '/api/enterprise/enterprise/minfo',//管- 获取全部首营过的企业
        postFbenterpriseSubmit: '/api/enterprise/fbenterprise/audit/',//管-首营审核提交
        getDataCompletionInfo: '/api/enterprise/datacompletion/info//',//管- 资料补全
        postDataCompletionSubmit: '/api/enterprise/datacompletion/post',//管-资料补全提交
        getDataCompanyProperty: '/api/enterprise/enterprise/natureinfo',//管-获取企业性质
        postCompanyDataSaveSubmit: '/api/enterprise/fbeenterprise/saveinfo/',//管-保存企业资料
        getGoodsClassInfo: '/api/products/class/info',//管-获取商品分类
        postGoodsClassSubimt: '/api/products/class/post/',//管-提交商品分类
        postGoodsClassModify: '/api/products/class/updatainfo/',//管- 修改商品分类
        postGoodsList: '/api/products/base/info/',//管- 商品基本信息
        postGoodsBaseInfo: '/api/products/base/post/',//管- 商品基本信息提交
        postGoodsBaseInfoEdit: '/api/products/base/updatainfo/',//管- 商品基本信息修改
        postGoodsBaseInfoDet: '/api/products/base/deleteinfo/',//管- 商品基本信息删除
        postGoodsBaseParmasInfo: '/api/products/product/info/',//管- 商品参数获取
        postGoodsBaseParmas: '/api/products/product/post/',//管- 商品参数提交
        postGoodsBaseParmasDel: '/api/products/product/deleteinfo/',//管- 商品参数删除
        postGoodsPublishInfo: '/api/products/publish/background/',//管- 获取发布商品
        postGoodsPublishParmas: '/api/products/publishparam/background/',//管- 获取发布商品
        postGoodsPublish: '/api/products/publish/post/',//管- 发布/取消发布商品（true发布，false取消）
        postGoodsPublishModify: '/api/products/publish/updateinfo/',//管- 发布商品修改
        postGoodsShelvesInfo: '/api/products/shelves/info/',//管- 获取商品上下架（true上架，false下架）
        postGoodsShelves: '/api/products/shelves/post/',//管- 商品上下架（true上架，false下架）
        getGoodsPrice: '/api/products/price/type/',//管- 获取商品价格分类信息
        postGoodsPriceInfo: '/api/products/price/info/',//管- 获取商品区域价格信息
        postGoodsPrice: '/api/products/pricelist/post/',//管- 商品区域价格信息提交
        postGoodsPriceModify: '/api/products/price/postinfo/',//管- 商品区域价格信息修改
        getGoodsPriceDet: '/api/products/price/postdel/',//管- 商品区域价格信息删除
        postWorkTabStatus: '/api/worktable/workswaittransact/allinfo/',//获取所有待办任务信息
        getWaitAuditOrder: '/api/order/waitaudit/recordsinfo/', //获取待审核的订单
        postAuditOrder: '/api/order/audit/postinfo/', //审核订单
        getWaitDeliveryOrder: '/api/order/waitdelivery/info/', //获取待发货的订单
        postDeliveryOrder: '/api/order/delivery/postinfo/', //订单发货
        getRefundWaitAuditOrder: '/api/order/refundwaitaudit/info/', //获取待审核退货的订单
        getRefundWaitAuditOrderInfo: '/api/order/refundwaitaudit/detailinfo/', //获取待审核退货的订单详情
        postCustomerMsgjpush: '/api/customer/msgjpush/post/', //极光推送消息
        getSaleManInfo: '/api/users/salesman/info/', //获取业务员信息
        postOrderByStatus: '/api/order/bystateid/manageinfo/', //获取订单根据状态
        postRegionalinfo:'/api/Resources/systemversion/regionalinfo' ,//获取区域


        getAppVersion: '/api/AppVersion/fbenterprise/wait/',
        getAppUpdate: '/api/AppUpdate/fbenterprise/info/',
        test: '/api/values',
        test1: '/api/values/5',
        apk_download: '/images/apk/',// 下载地址
        testapi:'/api/erp/erplogin'
    };
    static systemPhone: any = {
        servicePhone: '09318568744', //客服电话
    }
}
@Injectable()
export class AppService {
    constructor(
        public http: Http,
        public loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
    ) {
    }

    // 对参数进行编码
    encode(params) {
        var str = '';
        if (params) {
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var value = params[key];
                    str += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
                }
            }
            str = '?' + str.substring(0, str.length - 1);
        }
        return str;
    }

    httpGet(url, params, callback, loader: boolean = false) {
        let loading = this.loadingCtrl.create({});
        let headers = new Headers();
        if (loader) {
            loading.present();
        }
        this.http.get(AppGlobal.domain + url + this.encode(params), new RequestOptions({ headers: headers }))
            .toPromise()
            .then(res => {
                var d = res.json();
                if (loader) {
                    loading.dismiss();
                }
                callback(d == null ? "[]" : d);
            })
            .catch(error => {
                if (loader) {
                    loading.dismiss();
                }
                callback(error);
                this.handleError(error);
            });
    }
    httpGet_token(url, token, params, callback, loader: boolean = false) {
        let loading = this.loadingCtrl.create({});
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);
        if (loader) {
            loading.present();
        }
        this.http.get(AppGlobal.domain + url + this.encode(params), new RequestOptions({ headers: headers }))
            .toPromise()
            .then(res => {
                var d = res.json();
                if (loader) {
                    loading.dismiss();
                }
                callback(d == null ? "[]" : d);
            })
            .catch(error => {
                if (loader) {
                    loading.dismiss();
                }
                callback(error)
                this.handleError(error);
            });
    }
    httpGet_token_noparams(url, token, callback, loader: boolean = false) {
        let loading = this.loadingCtrl.create({});
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);
        if (loader) {
            loading.present();
        }
        this.http.get(AppGlobal.domain + url, new RequestOptions({ headers: headers }))
            .toPromise()
            .then(res => {
                var d = res.json();
                if (loader) {
                    loading.dismiss();
                }
                callback(d == null ? "[]" : d);
            })
            .catch(error => {
                if (loader) {
                    loading.dismiss();
                }
                callback(error)
                this.handleError(error);
            });
    }
    httpPost(url, params, callback, loader: boolean = false) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let loading = this.loadingCtrl.create();
        if (loader) {
            loading.present();
        }
        this.http.post(AppGlobal.domain + url, params, new RequestOptions({ headers: headers }))
            .toPromise()
            .then(res => {
                let d = res.json();
                if (loader) {
                    loading.dismiss();
                }
                callback(d == null ? "[]" : d);
            }).catch(error => {
                if (loader) {
                    loading.dismiss();
                }
                callback(error);
                this.handleError(error);
            });
    }
    httpPostlogin(url, params, callback, loader: boolean = false) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let loading = this.loadingCtrl.create();
        if (loader) {
            loading.present();
        }
        this.http.post(AppGlobal.domain + url, params, new RequestOptions({ headers: headers }))
            .toPromise()
            .then(res => {
                var d = res.json();
                if (loader) {
                    loading.dismiss();
                }
                callback(d == null ? "[]" : d);
            }).catch(error => {
                if (loader) {
                    loading.dismiss();
                }
                this.handleError(error);
            });
    }
    httpPost_token(url, token, params, callback, loader: boolean = false) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('authorization', token);
        let loading = this.loadingCtrl.create();
        if (loader) {
            loading.present();
        }
        this.http.post(AppGlobal.domain + url, params, new RequestOptions({ headers: headers }))
            .toPromise()
            .then(res => {
                var d = res.json();
                if (loader) {
                    loading.dismiss();
                }
                callback(d == null ? "[]" : d);
            }).catch(error => {
                if (loader) {
                    loading.dismiss();
                }
                callback(error);
                this.handleError(error);
            });
    }
    httpPost_token_fade(url, token, params, callback, loader: boolean = false) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('authorization', token);
        let loading = this.loadingCtrl.create({ cssClass: 'fadeloading' });
        if (loader) {
            loading.present();
        }
        this.http.post(AppGlobal.domain + url, params, new RequestOptions({ headers: headers }))
            .toPromise()
            .then(res => {
                var d = res.json();
                if (loader) {
                    loading.dismiss();
                }
                callback(d == null ? "[]" : d);
            }).catch(error => {
                if (loader) {
                    loading.dismiss();
                }
                callback(error);
                this.handleError(error);
            });
    }
    httpPost_token_more(url, token, params, callback, loader: boolean = false) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('authorization', token);
        let loading = this.loadingCtrl.create();
        if (loader) {
            loading.present();
        }
        this.http.post(AppGlobal.domain + url, params, new RequestOptions({ headers: headers }))
            .toPromise()
            .then(res => {
                var d = res.json();
                if (loader) {
                    loading.dismiss();
                }
                callback(d == null ? "[]" : d);
            }).catch(error => {
                if (loader) {
                    loading.dismiss();
                }
                callback(error);
                this.handleError(error);
            });
    }
    httpPost_Img_token(url, token, params, callback, loader: boolean = false) {
        let headers = new Headers();
        headers.append('authorization', token);
        let loading = this.loadingCtrl.create();
        if (loader) {
            loading.present();
        }
        this.http.post(AppGlobal.domain + url, params, new RequestOptions({ headers: headers }))
            .toPromise()
            .then(res => {
                var d = res.json();
                if (loader) {
                    loading.dismiss();
                }
                callback(d == null ? "[]" : d);
            }).catch(error => {
                if (loader) {
                    loading.dismiss();
                }
                callback(error);
                this.handleError(error);
            });
    }
    private handleError(error: Response | any) {
        let msg = '';
        if (error.status == 400) {
            msg = '请求无效(code：400)';
            console.log('请检查参数类型是否匹配');
        }
        if (error.status == 404) {
            msg = '无法连接到网络，请检查您的手机状态';
            //msg = '请求资源不存在(code：404)';
            console.error(msg + '，请检查路径是否正确');
        }
        if (error.status == 500) {
            msg = '服务器发生错误(code：500)';
            console.error(msg + '，请检查路径是否正确');
        }
        // if (error.status == 401) {
        //     msg = '无法连接到网络，请重新登录(code：401)';
        //     console.error(msg );
        // }
        // if (error.status == 403) {
        //     msg = '无法连接到网络，请重新登录(code：403)';
        //     console.error(msg );
        // }
        // if (error.status == 0) {
        //     msg = '服务器正在维护，请稍后重试！';
        //     console.error(msg);
        // }
        //console.log(error);
        if (msg != '') {
            this.toast(msg);
        }
    }

    alert(message, callback?) {
        if (callback) {
            let alert = this.alertCtrl.create({
                title: '提示',
                message: message,
                buttons: [{
                    text: "确定",
                    handler: data => {
                        callback();
                    }
                }]
            });
            alert.present();
        } else {
            let alert = this.alertCtrl.create({
                title: '提示',
                message: message,
                buttons: ["确定"]
            });
            alert.present();
        }
    }

    toast(message, callback?) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            dismissOnPageChange: true,
        });
        toast.present();
        if (callback) {
            callback();
        }
    }

    setItem(key: string, obj: any) {
        try {
            var json = JSON.stringify(obj);
            window.localStorage[key] = json;
        }
        catch (e) {
            console.error("window.localStorage error:" + e);
        }
    }
    getItem(key: string, callback) {
        try {
            var json = window.localStorage[key];
            var obj = JSON.parse(json);
            callback(obj);
        }
        catch (e) {
            console.error("window.localStorage error:" + e);
        }
    }
    // 本地json文件请求
    getRegionContact() {
        return this.http.get("assets/json/region.json")
    }
    // 本地json文件请求
    geteExpressContact() {
        return this.http.get("assets/json/express.json")
    }
    // 本地图片文件请求
    geteImgContact() {
        return this.http.get("assets/imgs/userImg.jpg");
    }
}