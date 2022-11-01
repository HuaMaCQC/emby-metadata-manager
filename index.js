const fs = require('fs');
const path = require('path');

// 修改路徑
const url = path.join('C:/Users/yisiang.chen/Downloads/test01/');
// 留下的名稱規則
const regexp = /\[[0-9][0-9]\]/;

fs.readdir(url, 'utf8', (err, fileList) => {
    if (err) {
        console.log(err);
        return;
    };

    fileList.forEach((item) => {
        let length = item.split('.').length;

        let type = '.' + item.split('.')[length - 1]; 
        let oldName = item;

        const _name = oldName.match(regexp);

        if(_name != null) {
            let newName = _name[0];
            newName = newName.replace("[", "第").replace("]", "集") + type;
            fs.rename(url + item, url + newName, () => {});
        }
    })
})