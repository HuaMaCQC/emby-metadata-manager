// 規則越鬆請放越後面

const basicReplace = (str) => {
    return str.replace("[", "第").replace("]", "集");
}

const rule = [
    { regexp: /\[[0-9][0-9][0-9]\]/, doc: '[xxx][001][xxx].mp4', replace: basicReplace},
    { regexp: /\[[0-9][0-9]\]/, doc: '[xxx][01][xxx].mp4', replace: basicReplace },
];

module.exports = rule;
