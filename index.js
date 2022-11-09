const process = require('node:process');
const readline = require('node:readline');
const regexp = require('./rule');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let url;
let fileList = [];
let myRegexp;
let myReplace = (str) => str.replace("[", "第").replace("]", "集");

rl.question('請輸入URL:', (inputUrl) => {
    url = inputUrl;
    if(url.slice(-1) !== '/' && url.slice(-1) !== '\\') {
        url = url + '/';
    }

    fs.readdir(url, 'utf8', (err, f) => {
        fileList = f;
        selectRegexp();
    })
});

const selectRegexp = () => {
    process.stdout.write(`\n目前選項 :` + '\n');
    regexp.forEach((v, i) => {
        process.stdout.write(`[${i + 1}] 適用於 ${v.doc} \n`)
    });

    rl.question('請輸入您要的正則表達式(號碼 or 正則表達式)，也可以按Enter 使用自動模式 \n', (inputRegexp) => {
        const index = Number(inputRegexp);

        if (index === 0) {
            if(getSelectRegexpIndex()) {
                myRegexp = getSelectRegexpIndex().regexp;
                myReplace = getSelectRegexpIndex().replace;
            } else {
                process.stdout.write('自動模式匹配不成功，請增加更多規則 \n');
                process.stdout.write('規則檔案位於: ./rule.js');

                rl.close();
                return;
            }

        } else if(!isNaN(index) && regexp[index]) {
            myRegexp = regexp[index - 1].regexp;
        } else {
            myRegexp = inputRegexp;
        }

        showNewName();
    });
}

const showNewName = () => {
    fileList.forEach(v => {
        process.stdout.write('舊檔名: ' + v + "\n");
        process.stdout.write('新檔名: ' + getNewName(v) + "\n");
        process.stdout.write("\n");
    });

    rename();
};

const rename = () => {
    rl.question('請輸入y 確定更改，如不更改直接按 ctrl + c \n', (input) => {
        if(input === 'y' || input === 'Y') {
            fileList.forEach(v => {
                fs.rename(url + v, url + getNewName(v), () => {
                    rl.close();
                });
            });
        }
    });
};

const getSelectRegexpIndex = () => regexp.find(r =>  fileList.find(fileName => fileName.match(r.regexp)));


const getNewName = (item) => {
    let length = item.split('.').length;
    let type = '.' + item.split('.')[length - 1]; 

    if(item.match(myRegexp)) {
       return myReplace(item.match(myRegexp)[0]) + type;
    }

    return item;
}

// const isError = (error) => {
//     process.stdout.write('錯誤 \n');
//     process.stdout.write(error);

//     rl.close();
// }

// fs.readdir(url, 'utf8', (err, fileList) => {
//     if (err) {
//         console.log(err);
//         return;
//     }

//     fileList.forEach((item) => {
//         let length = item.split('.').length;

//         let type = '.' + item.split('.')[length - 1]; 
//         let oldName = item;

//         const _name = oldName.match(regexp);

//         if(_name != null) {
//             let newName = _name[0];
//             newName = newName.replace("[", "第").replace("]", "集") + type;
//             fs.rename(url + item, url + newName, () => {});
//         }
//     })
// })