// 規則越鬆請放越後面

const basicReplace = (str) => {
    return str.replace("[", "第").replace("]", "集");
}

const replace01 =  (str) => {
    return str.replace("[", "第").replace("_", "集");
}

const rule = [
    { regexp: /\[[0-9][0-9][0-9]\]/, doc: '[xxx][001][xxx].mp4', replace: basicReplace},
    { regexp: /\[[0-9][0-9]\]/, doc: '[xxx][01][xxx].mp4', replace: basicReplace },
    // { regexp: /\[[0-9][0-9]_.*\]/, doc: '[xxx][01_xx][xxx].mp4', replace: basicReplace },
];

//  [SBZ][Inu_X_Boku_SS][02_NCED][BDRIP][1080P][X264-Hi10P_AAC](7BE78B65).mp4
// => 第02_NCED集

module.exports = rule;
