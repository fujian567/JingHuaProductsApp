// import { Injectable } from '@angular/core';
// import { Events } from "ionic-angular";
// //import { JPush } from '@jiguang-ionic/jpush';
// import { JPush } from "ionic3-jpush"; //npm install ionic3-jpush --save

// //自定义服务
// import { NativeService } from "./NativeService";
// import { Logger } from "./Logger";

// /**
//  * JPush极光推送服务类
//  * cordova plugin add jpush-phonegap-plugin --variable APP_KEY=your_jpush_appkey
//  * npm install ionic3-jpush --save
//  * @export
//  * @class JPushService
//  * Add by JoyoDuan on 2017-10-27
//  */
// @Injectable()
// export class JPushServe {

//     //是否是真机（手机）
//     private isMobile: boolean;
//     //是否是android
//     private isAndroid: boolean;
//     //是否是ios
//     private isIos: boolean;
//     RegistrationID: any;
//     constructor(
//         private events: Events,
//         private jpush: JPush,
//         private nativeService: NativeService,
//         private logger: Logger,
//     ) {
//         this.isMobile = this.nativeService.isMobile();
//         this.isAndroid = this.nativeService.isAndroid();
//         this.isIos = this.nativeService.isIos();

//     }

//     /**************************************** 极光推送 Start ************************************************ */
//     /**
//      * 初始化极光推送
//      * @returns {void}
//      * @memberof Helper
//      */
//     initJPush() {
//         //this.jpush.setDebugMode(true);
//         document.addEventListener('jpush.receiveRegistrationId', function (event) {
//             console.log(event)
//           }, false)
//         console.log("极光推送初始化开始")
//         if (!this.isMobile) return;
//         console.log("极光推送初始化开始并且是手机端")
//         this.jpush.init().then(result => {
//             console.log("极光推送初始化完成")
//             //初始化时设置标签(android、ios)
//              this.setTags();
//             this.getRegistrationID();
//             console.log("极光推送初始化" + result)
//             //this.logger.info("极光推送初始化", {JPushResult: result});
//         }).catch(error => {
//             console.log("极光推送初始化失败" + error)
//         });
//         //极光推送事件监听
//         this.addEventListener();
//         //this.jpush.setDebugMode(true);
//     }

//     /**
//         * 获取ID
//         */
//     getRegistrationID() {
//         this.jpush.getRegistrationID()
//             .then(res => {
//                 console.log("设备id" + res)
//                 this.RegistrationID = res
//             })
//             .catch(err => {
//                 console.log("出错了" + err)
//             })
//     }
//     /**
//      * 极光推送增加监听事件
//      * @private
//      * @memberof Helper
//      */
//     addEventListener() {
//         this.jpush.getUserNotificationSettings().then(result => {
//             if (result == 0)
//                 console.log("系统设置中已关闭应用推送" + result)
//             //this.logger.info("系统设置中已关闭应用推送", {result: result});
//             if (result > 0)
//                 console.log("系统设置中打开了应用推送" + result)
//             //this.logger.info("系统设置中打开了应用推送", {result: result});
//         });

//         //点击通知进入应用程序时会触发的事件，点击通知进入程序
//         document.addEventListener("jpush.openNotification", event => {

//             //  window['plugins'].jPushPlugin.resetBadge();
//             //map需要new Map，否则无法使用
//             let content: Map<string, any> = new Map<string, any>();

//             //android和ios的数据取法不一样，因此if else区分
//             if (this.isAndroid) {
//                 content.set('title', event['title']); //推送消息的标题
//                 content.set('message', event['alert']); //推送消息的内容

//                 //推送消息的其它数据，为json键值对
//                 for (let key in event['extras']) {
//                     content.set(key, event['extras'][key]);
//                 }
//             }
//             else {
//                 content.set('title', event['aps'].title);
//                 content.set('message', event['aps'].alert);

//                 for (let key in event['extras']) {
//                     content.set(key, event['extras'][key]);
//                 }
//             }
//             //如果通知类型不存在，则设置默认值
//             //if (!content.has('type') || Utils.isEmptyStr(content.get('type'))) content.set('type', NOTIFY_TYPE.MESSAGE);

//             console.log("jpush.openNotification" + content)
//             //this.logger.info("jpush.openNotification", { content: content });

//             this.events.publish("openNotification", content);
//         }, false);

//         //收到通知时会触发该事件，收到通知
//         document.addEventListener("jpush.receiveNotification", event => {

//             //map需要new Map，否则接收不到值
//             let content: Map<string, any> = new Map<string, any>();
//             //android和ios的数据取法不一样，因此if else区分
//             if (this.isAndroid) {
//                 content.set('title', event['title']);
//                 content.set('message', event['alert']);
//                 for (let key in event['extras']) {
//                     content.set(key, event['extras'][key]);
//                 }
//             }
//             else {
//                 content.set('title', event['aps'].title); //推送消息的标题
//                 content.set('message', event['aps'].alert); //推送消息的内容

//                 //推送消息的其它数据，为json键值对
//                 for (let key in event['extras']) {
//                     content.set(key, event['extras'][key]);
//                 }
//             }
//             //如果通知类型不存在，则设置默认值:message
//             //if (!content.has('type') || Utils.isEmptyStr(content.get('type'))) content.set('type', NOTIFY_TYPE.MESSAGE);
//             console.log("jpush.receiveNotification" + content)
//             //this.logger.info("jpush.receiveNotification", { content: content });
//             this.events.publish("receiveNotification", content);
//         }, false);

//         //收到自定义消息时触发该事件，收到自定义消息
//         document.addEventListener("jpush.receiveMessage", event => {

//             let content: Map<string, any> = new Map<string, any>();
//             //android和ios的数据取法不一样，因此if else区分
//             if (this.isAndroid) {
//                 content.set('message', event['message']);
//                 for (let key in event['extras']) {
//                     content.set(key, event['extras'][key]);
//                 }
//             }
//             else {
//                 content.set('message', event['content']); //推送消息的内容

//                 //推送消息的其它数据，为json键值对
//                 for (let key in event['extras']) {
//                     content.set(key, event['extras'][key]);
//                 }
//             }
//             //如果通知类型不存在，则设置默认值
//             //if (!content.has('type') || Utils.isEmptyStr(content.get('type'))) content.set('type', NOTIFY_TYPE.MESSAGE);
//             console.log("jpush.receiveMessage" + content)
//             //this.logger.info("jpush.receiveMessage", { content: content });
//             this.events.publish("receiveMessage", content);
//         }, false);

//         //设置标签/别名时触发，设置标签/别名，2017年10月份后没有setTagsWithAlias方法
//         // document.addEventListener("jpush.setTagsWithAlias", event => {
//         //   let result = "result code:" + event['resultCode'] + " ";
//         //   result += "tags:" + event['tags'] + " ";
//         //   result += "alias:" + event['alias'] + " ";

//         //   this.logger.info("onTagsWithAlias", {result: result});
//         //   this.events.publish("setTagsWithAlias", result);
//         // }, false);
//     }


//     //设置标签，可设置多个
//     setTags(tags: string[] = []) {
//         // if (!this.isMobile) return;
//         // if (this.isAndroid)
//         //     tags.push("android");
//         // if (this.isIos)
//         //     tags.push("ios");
//         // this.jpush.setTags({ sequence: Date.now(), tags: tags }).then((res) => {
//         //     console.log("极光推送设置标签setTags返回信息:" + tags + ':' + res)
//         //     //this.logger.info('极光推送设置标签setTags返回信息', { tags: tags, res: res });
//         // }).catch(err => {
//         //     console.log("极光推送设置标签setTags失败:" + tags)
//         //     //this.logger.error('极光推送设置标签setTags失败', err, { tags: tags });
//         // });
//     }


//     //设置别名，建议使用用户ID, userId唯一标识
//     setAlias(alias: any) {
//         if (!this.isMobile) return;
//         let userId = '1111111'
//         alias.push(userId);
//         //alias.push(this.globalData.userId);   //用户Id作为别名

//         // this.jpush.setAlias( alias: alias ).then((res) => {
//         //     console.log("极光推送设置别名setAlias返回信息:" + alias + ':' + res)
//         //     //this.logger.info('极光推送设置别名setAlias返回信息', { alias: alias, res: res });
//         // }).catch(err => {
//         //     console.log("极光推送设置别名setAlias失败:" + alias + ':' + err)
//         //     //this.logger.error('极光推送设置别名setAlias失败', err, { alias: alias });
//         // });
//     }

//     //设置标签和别名,在ionioc3-jpush 1.2.0中删除了setTagsWithAlias()方法
//     // public setTagsWithAlias(tags: string[] = [], alias: string[] = [])
//     // {
//     //   if(!this.isMobile) return;
//     //   if(this.isAndroid)
//     //     tags.push("android");
//     //   if(this.isIos)
//     //     tags.push("ios");
//     //   if(!alias || Utils.isEmptyStr(alias))
//     //     alias = this.globalData.userId; //用户Id作为别名
//     //   this.logger.info("极光推送设置标签和别名，setTagsWithAlias", {tags: tags, alias: alias});
//     //   this.jpush.setTagsWithAlias(tags, alias);
//     // }
//     /**************************************** 极光推送 End ************************************************ */
// }
