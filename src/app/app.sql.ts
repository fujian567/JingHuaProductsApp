import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { Injectable } from '@angular/core';


@Injectable()
export class DataProvider {
    myAppDatabase: SQLiteObject;
    constructor(private sqlite: SQLite) {
        //this.initDatabase()
    }
    initDatabase() {
        this.sqlite.create({
            name: 'jhAppSqlite.db',
            location: 'default'
        }).then((database: SQLiteObject) => {
            database.executeSql(
                'create table if not exists region(RegionID varchar(20) PRIMARY KEY,Name nvarchar(200) NOT NULL,ParentID varchar(20) NULL,isSingleCity varchar(20) NULL)', {}).
                then(() => console.log('初始化数据库成功！')).catch(e => console.log(e));
            this.myAppDatabase = database;
        })
    }
}