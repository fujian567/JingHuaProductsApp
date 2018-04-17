/**
 * Created by yanxiaojun617@163.com on 07-25.
 */
import {Injectable} from '@angular/core';

/**
 * Utils类存放和业务无关的公共方法
 * @description
 */
@Injectable()
export class Logger {
  constructor() {
  }

  log(err: any, action: string, other = null): void {
    console.log('Logger.log：action-' + action);
    other && console.log(other);
    console.log(err);
  }

}