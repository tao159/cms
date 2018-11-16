const md5 = require('md5')
const multer = require('koa-multer')
let tools = {
    md5(str) {
        return md5(str)
    },
    cateToList(data) {
        var firstArr = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].pid == 0) {
                firstArr.push(data[i]);
            }
        }
        for (var i = 0; i < firstArr.length; i++) {
            firstArr[i]['list'] = [];
            for (var j = 0; j < data.length; j++) {
                if (data[j].pid == firstArr[i]._id) {
                    firstArr[i]['list'].push(data[j]);
                }
            }
        }
        return firstArr
    },
    getTime() {
        return new Date();
    },
    multer() {
        var storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, 'public/uploads')
            },
            filename: function(req, file, cb) {
                var fileFormat = (file.originalname).split(".");
                cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
            }
        })
        var upload = multer({
            storage: storage
        });
        return upload
    }
}

module.exports = tools;