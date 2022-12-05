import axios from 'axios';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import useUtils from '@/utils/useUtils';
import config from '@/config';
import { computed } from 'vue';

const useAjax = () => {
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.put['Content-Type'] = 'application/json';
  axios.defaults.timeout = '45000';
  const store = useStore();
  const toast = useToast();

  const { getUuid } = useUtils();
  const deviceId = computed(() => store.state.deviceId);
  const user = computed(() => store.state.user);

  const userAgent = computed(() => {
    let agent = '';

    switch (true) {
      case (navigator.userAgent.indexOf('Chrome') !== -1):
        agent += 'Google%20Chrome';
        break;
      case (navigator.userAgent.indexOf('Firefox') !== -1):
        agent += 'Firefox';
        break;
      case (navigator.userAgent.indexOf('Seamonkey') !== -1):
        agent += 'Seamonkey';
        break;
      case (navigator.userAgent.indexOf('Chromium') !== -1):
        agent += 'Chromium';
        break;
      case (navigator.userAgent.indexOf('Safari') !== -1):
        agent += 'Safari';
        break;
      case (navigator.userAgent.indexOf('Opera') !== -1):
        agent += 'Opera';
        break;

      case (navigator.userAgent.indexOf('MSIE') !== -1):
        agent += 'Internet Explorer';
        break;
      default:
        break;
    }

    switch (true) {
      case (navigator.userAgent.indexOf('Linux') !== -1):
        agent += '%20Linux';
        break;
      case (navigator.userAgent.indexOf('X11') !== -1):
        agent += '%20Unix';
        break;
      case (navigator.userAgent.indexOf('Mac') !== -1):
        agent += '%20Mac';
        break;

      case (navigator.userAgent.indexOf('Windows') !== -1):
        agent += '%20Windows';
        break;
      case (navigator.userAgent.indexOf('Mobi') !== -1):
        agent += '%20Mobi';
        break;
      case (navigator.userAgent.indexOf('Android') !== -1):
        agent += '%20Android';
        break;
      case (navigator.userAgent.indexOf('iPhone') !== -1):
        agent += '%20iPhone';
        break;
      default:
        if (navigator.userAgentData.mobile) {
          agent += '%20mobile';
        } else {
          agent += '%20Other';
        }
        break;
    }

    return agent;
  });

  // 處理錯誤
  const responseError = (error) => {
    toast.add({ severity: 'error', detail: '您帳密錯誤或伺服器錯誤! 如果持續錯誤請告訴花媽 不要一直玩!', life: 3000 });
    Promise.reject(error);
  };

  /**
   * ajax post
   *
   * @param {string} api api
   * @param {*} req 查詢資料
   * @param {*} params params
   * @returns 回傳資料
   */
  const post = (api, req, _params = {}) => {
    if (!deviceId.value) {
      store.dispatch('setDeviceId', getUuid());
    }

    const params = {
      'X-Emby-Device-Id': deviceId.value,
      'X-Emby-Client-Version': config.Client_Version,
      'X-Emby-Client': config.Client,
      'X-Emby-Device-Name': userAgent.value,
      ..._params,
    };

    if (user.value && user.value.token) {
      params['X-Emby-Token'] = user.value.token;
    }

    return axios
      .post(api, { ...req }, { params })
      .then((d) => Promise.resolve(d.data))
      .catch((err) => {
        responseError(err);
      });
  };

  /**
   * ajax get
   *
   * @param {string} api api
   * @returns 回傳資料
   */
  const get = (api, req) => {
    if (!deviceId.value) {
      store.dispatch('setDeviceId', getUuid());
    }

    const params = {
      'X-Emby-Device-Id': deviceId.value,
      'X-Emby-Client-Version': config.Client_Version,
      'X-Emby-Client': config.Client,
      'X-Emby-Device-Name': userAgent.value,
      ...req,
    };

    if (user.value && user.value.token) {
      params['X-Emby-Token'] = user.value.token;
    }

    return axios.get(api, { params })
      .then((d) => Promise.resolve(d.data))
      .catch((err) => {
        responseError(err);
      });
  };

  const getSeriesItem = async (id) => {
    const res = await get(`/emby/Users/${user.value.id}/Items/${id}`);

    return {
      CommunityRating: res.CommunityRating, // 論壇評分 通常由爬蟲取得
      CriticRating: res.CriticRating, // 評論家評分 通常無資料
      DateCreated: res.DateCreated, // 創建日期
      DisplayOrder: res.DisplayOrder,
      EndDate: res.EndDate, // 播完時間
      ForcedSortName: res.ForcedSortName, // 排序名稱
      Genres: res.Genres,
      Id: res.Id,
      LockData: res.LockData, // 大鎖
      LockedFields: res.LockedFields, // 小鎖
      Name: res.Name,
      OriginalTitle: res.OriginalTitle, // 原始標題 爬蟲爬到的標題
      OfficialRating: res.OfficialRating, // 官方評級 通常由爬蟲取得
      CustomRating: res.CustomRating, // 自定義分級 通常無資料
      Overview: res.Overview, // 介紹
      People: res.People,
      PreferredMetadataCountryCode: res.PreferredMetadataCountryCode || '', // 首選元數據國家代碼
      PreferredMetadataLanguage: res.PreferredMetadataLanguage || '', // 首選元數據語言
      PremiereDate: res.PremiereDate, // 首映日期
      ProductionYear: res.ProductionYear, // 生產年份
      ProviderIds: res.ProviderIds, // 爬蟲識別碼 建議直接回傳部要更改
      RunTimeTicks: res.RunTimeTicks, // 運行時間 微秒 不知道幹啥用的
      Status: res.Status, // 目前狀態
      Studios: res.Studios, // 製作廠商
      Tags: res.TagItems.map((t) => t.Name), // 需與 TagItems一樣
      SortName: res.SortName, // 排序時間
      Taglines: res.Taglines, // 品牌理念 用來自訂意訊息
    };
  };

  return {
    get, post, getSeriesItem,
  };
};

export default useAjax;
