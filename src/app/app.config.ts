import { AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';

export class AppStaticConfig {
    //正则手机号
    public static verifyMobile(mobile: string) {
        let verifyCode = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        return verifyCode.test(mobile);
    }
    public static verifyPassword(password: string) {
        let verifyCode = /^(?=.*\d)(?=.*[a-z]).{8,16}$/;
        return verifyCode.test(password);
    }
    public static newGuid() {
        let guid = "";
        for (let i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += "-";
        }
        return guid;
    }
    public static hideMobile(mobile: string) {
        let part1 = "";
        let part2 = "";
        part1 = mobile.substr(0, 3);
        part2 = mobile.substr(7, 4);
        return `${part1}****${part2}`;
    }
    public static addRegionData(dataItem: any) {
        let options: Array<any> = [];
        for (let i = 0; i < dataItem.length; i++) {
            let optionsitem = {
                text: '',
                value: '',
                parentVal: ''
            }
            optionsitem.text = dataItem[i].Name;
            optionsitem.value = dataItem[i].ItemID;
            if (dataItem[i].ParentID != '') {
                optionsitem.parentVal = dataItem[i].ParentID;
            }
            options.push(optionsitem);
        }
        return options
    }
    //格式化支付宝返回签名
    public static unescapeHTML(a) {
        let aNew = "" + a;
        return aNew.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/\+/g, "%20");
    }
    //输入内容格式化
    public static clearHTML(a) {
        let aNew = "" + a;
        return aNew.replace(/</g, "").replace(/>/g, "").replace(/&/g, "").replace(/script/g, '').replace(/div/g, "").replace(/src/g, "");
    }
}
@Injectable()
export class AppConfig {
    constructor(private loadingCtrl: LoadingController, private alertCtrl: AlertController, private toastCtrl: ToastController, ) { }
    popAlertView(message: string) {
        this.alertCtrl.create({
            cssClass: 'alert-bg',
            message: message,
            buttons: ['我知道了']
        }).present();
    }
    popToastView(message: string) {
        this.toastCtrl.create({
            message: message,
            position: 'bottom',
            duration: 1500
        }).present();
    }
    popAlertConfirmLoadingView(message: string, lmessage: string, timenum: number, callback: any) {
        this.alertCtrl.create({
            title: '提示信息',
            subTitle: message,
            buttons: ['我要修改', {
                text: '不修改了',
                handler: () => {
                    this.popLoadingView(timenum, lmessage, callback)
                }
            }]
        }).present();
    }
    popLoadingView(timenum: number, lmessage: string, callback: any) {
        let loading = this.loadingCtrl.create({
            content: lmessage
        });
        loading.present();
        callback;
        loading.dismiss();
    }
    popPromptView(title: string, cssClass: string, message: string, name: string, placeholder: string, callback: any) {
        let prompt = this.alertCtrl.create({
            title: title,
            cssClass: cssClass,
            message: message,
            inputs: [
                {
                    name: name,
                    placeholder: placeholder
                },
            ],
            buttons: [
                // {
                //     text: '取消',
                //     handler: data => {
                //         callback(data)
                //     }
                // },
                {
                    text: '保存',
                    handler: data => {
                        callback(data)
                    }
                }
            ]
        });
        prompt.present();
    }
    popAlertConfirmView(message: string, cancelText: string, doneText: string, callback: any) {
        this.alertCtrl.create({
            title: '提示信息',
            message: message,
            cssClass: 'alerClass',
            buttons: [{
                text: cancelText,
                handler: () => {
                    console.log('Cancel clicked');
                }
            },
            {
                text: doneText,
                handler: () => {
                    callback()
                }
            }]
        }).present();
    }
    popAlertConfirmViewExit(message: string, cancelText: string, doneText: string, callback: any) {
        this.alertCtrl.create({
            title: '提示信息',
            message: message,
            cssClass: 'alerClass',
            buttons: [{
                text: cancelText,
                handler: () => {
                    callback('exit')
                }
            },
            {
                text: doneText,
                handler: () => {
                    callback()
                }
            }]
        }).present();
    }
    popToast(message: string, position: any) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: position
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }
    popPromptNumView(title: string, cssClass: string, message: string, name: string, value: string, callback: any) {
        let prompt = this.alertCtrl.create({
            title: title,
            cssClass: cssClass,
            message: message,
            inputs: [
                {
                    name: name,
                    type: 'number',
                    value: value
                },
            ],
            buttons: [
                {
                    text: '取消',
                    handler: data => {
                        // callback(data)
                    }
                },
                {
                    text: '确定',
                    handler: data => {
                        callback(data)
                    }
                }
            ]
        });
        prompt.present();
    }
    popPromptViewA(title: string, cssClass: string, message: string, name: string, placeholder: string, callback: any) {
        let prompt = this.alertCtrl.create({
            title: title,
            cssClass: cssClass,
            message: message,
            inputs: [
                {
                    name: name,
                    placeholder: placeholder
                },
            ],
            buttons: [
                {
                    text: '取消',
                    handler: data => {
                        //callback(data)
                    }
                },
                {
                    text: '确定',
                    handler: data => {
                        callback(data)
                    }
                }
            ]
        });
        prompt.present();
    }
    //popRadioView() {
    popRadioView(title: string, cssClass: string, inputItem: Array<any>, callback: any) {
        let alert = this.alertCtrl.create();
        alert.setTitle(title);
        alert.setCssClass(cssClass);
        for (let i = 0; i < inputItem.length; i++) {
            alert.addInput({
                type: 'radio',
                label: inputItem[i].salesmanName_ERP,
                value: `${inputItem[i].salesmanCode_ERP},${inputItem[i].salesmanName_ERP},${inputItem[i].userID_ERP},${inputItem[i].eaCode_ERP}`,
                checked: false
            });
        }
        alert.addButton('取消');
        alert.addButton({
            text: '确定',
            handler: data => {
                callback(data);
            }
        });
        alert.present();
    }
    popRadioOnlyView(title: string, cssClass: string, inputItem: Array<any>, callback: any) {
        let alert = this.alertCtrl.create();
        alert.setTitle(title);
        alert.setCssClass(cssClass);
        for (let i = 0; i < inputItem.length; i++) {
            alert.addInput({
                type: 'radio',
                label: inputItem[i].enterpriseNatureName,
                value: `${inputItem[i].enterpriseNatureId},${inputItem[i].enterpriseNatureName}`,
                checked: false
            });
        }
        alert.addButton('取消');
        alert.addButton({
            text: '确定',
            handler: data => {
                callback(data);
            }
        });
        alert.present();
    }
}
