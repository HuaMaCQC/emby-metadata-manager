const fs = require('fs');
const path = require('path');

const url = path.join('C:/Users/yisiang.chen/Downloads/test01/');

fs.readdir(url, 'utf8', (err, fileList) => {
    if (err) {
        throw err;
    };

    fileList.forEach((item, index) => {
        let length = item.split('.').length;

        // 获取文件后缀名
        let type = '.' + item.split('.')[length - 1]; 
       
        let oldName = item;

        const regexp = /\[[0-9][0-9]\]/;
        let newName = oldName.match(regexp)[0];
        newName = newName.replace("[", "第").replace("]", "集") + type;
        console.log(newName);
        console.log(url + item);
        // let newName = index + '.jpg';

        fs.rename(url + item, url + newName, (err) => {
            console.log(err);
            throw err;
        });
    })
})