declare var Wechat: any;  // 此处声明plugin.xml中clobbers对应的值
export interface WechatPayParam {
  appid: string;
  partnerid: string;//商户号
  prepayid: string;//预支付交易会话ID(微信返回的支付交易会话ID)
  package: string;
  noncestr: string;//随机字符串
  timestamp: string;//时间戳 
  sign: string;//签名
}

export class WechatPlugin {
  public static isInstalled() {
    return new Promise((resolve, reject) => {
      Wechat.isInstalled(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public static sendPaymentRequest(params: WechatPayParam) {
    console.log(params)
    return new Promise((resolve, reject) => {
      Wechat.sendPaymentRequest(params, result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }
}