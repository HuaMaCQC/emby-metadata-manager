季 item post 參數
``` javascript
    CommunityRating: '', // 論壇評分 通常由爬蟲取得
    CriticRating: '', // 評論家評分 通常無資料
    DateCreated: '2022-11-15T07:01:36.000Z', // 創建日期
    DisplayOrder: 'aired',
    EndDate: '2022-11-23T16:00:00.000Z', // 播完時間
    ForcedSortName: '夏目友人帳', // 排序名稱
    Genres: delData.Genres.filter((v) => v !== gName),
    Id: delData.Id,
    LockData: false, // 大鎖
    LockedFields: ['Genres', 'Tags'], // 小鎖
    Name: '夏目友人帳',
    OriginalTitle: '', // 原始標題 爬蟲爬到的標題
    OfficialRating: '', // 官方評級 通常由爬蟲取得
    CustomRating: '', // 自定義分級 通常無資料
    Overview: '', // 介紹
    People: [
      {
        Id: '808',
        Name: 'Mamoru Miyano',
        PrimaryImageTag: 'b82255e14dc143145705bbe732ee3879',
        Role: 'AAA',
        Type: 'Actor',
      },
    ], // 如需編輯 需要取得所有人員
    PreferredMetadataCountryCode: '', // 首選元數據國家代碼
    PreferredMetadataLanguage: '', // 首選元數據語言
    PremiereDate: '2022-11-23T16:00:00.000Z', // 首映日期
    ProductionYear: '', // 生產年份
    ProviderIds: [], // 爬蟲識別碼 建議直接回傳部要更改
    RunTimeTicks: 13800000000, // 運行時間 微秒 不知道幹啥用的
    Status: 'Ended', // 目前狀態
    Studios: [{ Name: 'Bandai Namco Group' }, { Name: 'Shuka' }, { Name: 'TV Tokyo' }], // 製作廠商
    Tags: ['測試', 'AAAAa', 'BBBBB'], // 需與 TagItems一樣
    TagItems: [{ Name: '測試' }, { Name: 'AAAAa' }], // 與Tags 一樣一起發
    SortName: '夏目友人帳', // 排序時間
    Taglines: ['4444'], // 品牌理念 用來自訂意訊息
```

