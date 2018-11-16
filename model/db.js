const Config = require('./config.js');
/**这样封装可以解决两个问题
 * 1.数据库多次连接问题
 * 2.使用单例可以解决多次实例化，实例不共享问题
 */
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const client = new MongoClient(Config.dbUrl);
class Db {
    static getInstance() { //单例
        if (!Db.instance) {
            Db.instance = new Db()
        }
        return Db.instance
    }
    constructor() {
        this.dbClient = '' //属性，放db对象
        this.connect() //初始化的时候连接数据库
    }

    connect() {
        let _this = this;
        return new Promise((resolve, reject) => {
            if (!_this.dbClient) { /** 解决数据库多次连接的问题*/
                client.connect(function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        _this.dbClient = client.db(Config.dbName);
                        resolve(_this.dbClient);
                    }
                })
            } else {
                resolve(_this.dbClient);
            }

        })
    }
    update(collectionName, json1, json2) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).updateOne(json1, { $set: json2 }, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }


    /**
     * 
     * javascript中实参数量和形参数量允许不一样
     * 用arguments来判断实参数量 
     *  
     */
    find(collectionName, json1, json2, json3) {
        console.log(arguments)
        if (arguments.length == 1) {
            json1 = {};
            var attr = {};
            var slipNum = 0;
            var pageSize = 0;
        } else if (arguments.length == 2) {
            var attr = '';
            var slipNum = 0;
            var pageSize = 0;

        } else if (arguments.length == 3) {
            var attr = json2;
            var slipNum = 0;
            var pageSize = 0;

        } else if (arguments.length == 4) {
            var attr = json2;
            var page = json3.page || 1;
            var slipNum = (page - 1) * json3.size;
            var pageSize = json3.size || 20;
            if (json3.sortJson) {
                var sortJson = json3.sortJson;
            } else {
                var sortJson = {}
            }
        } else {
            console.log('传入的参数不对');
        }
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                var result = db.collection(collectionName).find(json1, {
                    fields: attr
                }).skip(slipNum).limit(pageSize).sort(sortJson);
                console.log(result);
                result.toArray((err, docs) => {
                    if (err) {
                        reject(err);
                        return
                    }
                    resolve(docs);
                })
            })
        })
    }
    insert(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).insertOne(json, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }
    remove(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).removeOne(json, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }
    getObjectID(id) { //mongodb里面查询_id把字符串转换成对象
        return new ObjectID(id);
    }
    count(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                var result = db.collection(collectionName).count(json);
                result.then((data) => {
                    resolve(data);
                })
            })
        })
    }
}
module.exports = Db.getInstance();