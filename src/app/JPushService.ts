// import { Injectable } from '@angular/core';
// import { Events } from "ionic-angular";
// import { JPush } from "ionic3-jpush"; //npm install ionic3-jpush --save

// //自定义服务
// import { NativeService } from "./NativeService";
// import { Logger } from "./Logger";
// import { Utils } from "./Utils";
// import { NOTIFY_TYPE } from './Constants';
// import { GlobalData } from "./GlobalData";

// /**
//  * JPush极光推送服务类
//  * cordova plugin add jpush-phonegap-plugin --variable APP_KEY=your_jpush_appkey
//  * npm install ionic3-jpush --save
//  * @export
//  * @class JPushService
//  * Add by JoyoDuan on 2017-10-27
//  */
// @Injectable()
// export class JPushService {

//   //是否是真机（手机）
//   private isMobile: boolean;
//   //是否是android
//   private isAndroid: boolean;
//   //是否是ios
//   private isIos: boolean;

//   constructor(private events: Events, private jpush: JPush, private nativeService: NativeService, private logger: Logger,
//     private globalData: GlobalData){

//     this.isMobile = this.nativeService.isMobile();
//     this.isAndroid = this.nativeService.isAndroid();
//     this.isIos = this.nativeService.isIos();

//   }


//   /**************************************** 极光推送 Start ************************************************ */
//   /**
//    * 初始化极光推送
//    * @returns {void}
//    * @memberof Helper
//    */
//   public initJPush(): void
//   {
//     if(!this.isMobile) return;
//     this.jpush.init().then(result => {
//       //初始化时设置标签(android、ios)
//       // this.setTags();
//       this.logger.info("极光推送初始化", {JPushResult: result});
//     }).catch(error => {
//       this.logger.error("极光推送初始化失败", error);
//     });
//     //极光推送事件监听
//     this.addEventListener();
//   }


//   /**
//    * 极光推送增加监听事件
//    * @private
//    * @memberof Helper
//    */
//   private addEventListener(): void
//   {
//     this.jpush.getUserNotificationSettings().then(result => {
//       if(result == 0)
//         this.logger.info("系统设置中已关闭应用推送", {result: result});
//       if(result > 0)
//         this.logger.info("系统设置中打开了应用推送", {result: result});
//     });

//     //点击通知进入应用程序时会触发的事件，点击通知进入程序
//     document.addEventListener("jpush.openNotification", event => {

//       //  window['plugins'].jPushPlugin.resetBadge();
//       //map需要new Map，否则无法使用
//       let content: Map<string, any> = new Map<string, any>();

//       //android和ios的数据取法不一样，因此if else区分
//       if(this.isAndroid)
//       {
//         content.set('title', event['title']); //推送消息的标题
//         content.set('message', event['alert']); //推送消息的内容

//         //推送消息的其它数据，为json键值对
//         for(let key in event['extras'])
//         {
//           content.set(key, event['extras'][key]);
//         }
//       }
//       else
//       {
//         content.set('title', event['aps'].title);
//         content.set('message', event['aps'].alert);

//         for(let key in event['extras'])
//         {
//           content.set(key, event['extras'][key]);
//         }
//       }
//       //如果通知类型不存在，则设置默认值
//       if( !content.has('type') || Utils.isEmptyStr(content.get('type')) ) content.set('type', NOTIFY_TYPE.MESSAGE);

//       this.logger.info("jpush.openNotification", {content: content});

//       this.events.publish("openNotification", content);
//     }, false);

//     //收到通知时会触发该事件，收到通知
//     document.addEventListener("jpush.receiveNotification", event => {

//       //map需要new Map，否则接收不到值
//       let content: Map<string, any> = new Map<string, any>();
//       //android和ios的数据取法不一样，因此if else区分
//       if(this.isAndroid)
//       {
//         content.set('title', event['title']);
//         content.set('message', event['alert']);
//         for(let key in event['extras'])
//         {
//           content.set(key, event['extras'][key]);
//         }
//       }
//       else
//       {
//         content.set('title', event['aps'].title); //推送消息的标题
//         content.set('message', event['aps'].alert); //推送消息的内容

//         //推送消息的其它数据，为json键值对
//         for(let key in event['extras'])
//         {
//           content.set(key, event['extras'][key]);
//         }
//       }
//       //如果通知类型不存在，则设置默认值:message
//       if( !content.has('type') || Utils.isEmptyStr(content.get('type')) ) content.set('type', NOTIFY_TYPE.MESSAGE);

//       this.logger.info("jpush.receiveNotification", {content: content});
//       this.events.publish("receiveNotification", content);
//     }, false);

//     //收到自定义消息时触发该事件，收到自定义消息
//     document.addEventListener("jpush.receiveMessage", event => {

//       let content: Map<string, any> = new Map<string, any>();
//       //android和ios的数据取法不一样，因此if else区分
//       if(this.isAndroid)
//       {
//         content.set('message', event['message']);
//         for(let key in event['extras'])
//         {
//           content.set(key, event['extras'][key]);
//         }
//       }
//       else
//       {
//         content.set('message', event['content']); //推送消息的内容

//         //推送消息的其它数据，为json键值对
//         for(let key in event['extras'])
//         {
//           content.set(key, event['extras'][key]);
//         }
//       }
//       //如果通知类型不存在，则设置默认值
//       if( !content.has('type') || Utils.isEmptyStr(content.get('type')) ) content.set('type', NOTIFY_TYPE.MESSAGE);

//       this.logger.info("jpush.receiveMessage", {content: content});
//       this.events.publish("receiveMessage", content);
//     }, false);

//     //设置标签/别名时触发，设置标签/别名，2017年10月份后没有setTagsWithAlias方法
//     // document.addEventListener("jpush.setTagsWithAlias", event => {
//     //   let result = "result code:" + event['resultCode'] + " ";
//     //   result += "tags:" + event['tags'] + " ";
//     //   result += "alias:" + event['alias'] + " ";

//     //   this.logger.info("onTagsWithAlias", {result: result});
//     //   this.events.publish("setTagsWithAlias", result);
//     // }, false);
//   }


//   //设置标签，可设置多个
//   public setTags(tags: string[] = []): void
//   {
//     if(!this.isMobile) return;
//     if(this.isAndroid)
//       tags.push("android");
//     if(this.isIos)
//       tags.push("ios");
//     this.jpush.setTags({sequence: Date.now(), tags: tags}).then((res) => {
//       this.logger.info('极光推送设置标签setTags返回信息', {tags: tags, res: res});
//     }).catch(err => {
//       this.logger.error('极光推送设置标签setTags失败', err, {tags: tags});
//     });
//   }


//   //设置别名，建议使用用户ID, userId唯一标识
//   public setAlias(alias: string[] = []): void
//   {
//     if(!this.isMobile) return;

//     alias.push(this.globalData.userId);   //用户Id作为别名

//     this.jpush.setAlias({sequence: Date.now(), alias: alias}).then((res) => {
//       this.logger.info('极光推送设置别名setAlias返回信息', {alias: alias, res: res});
//     }).catch(err => {
//       this.logger.error('极光推送设置别名setAlias失败', err, {alias: alias});
//     });
//   }


//   //设置标签和别名,在ionioc3-jpush 1.2.0中删除了setTagsWithAlias()方法
//   // public setTagsWithAlias(tags: string[] = [], alias: string[] = []): void
//   // {
//   //   if(!this.isMobile) return;
//   //   if(this.isAndroid)
//   //     tags.push("android");
//   //   if(this.isIos)
//   //     tags.push("ios");
//   //   if(!alias || Utils.isEmptyStr(alias))
//   //     alias = this.globalData.userId; //用户Id作为别名
//   //   this.logger.info("极光推送设置标签和别名，setTagsWithAlias", {tags: tags, alias: alias});
//   //   this.jpush.setTagsWithAlias(tags, alias);
//   // }
//   /**************************************** 极光推送 End ************************************************ */
// }