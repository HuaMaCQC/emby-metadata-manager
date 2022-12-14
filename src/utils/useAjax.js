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

  // ????????????
  const responseError = (error) => {
    toast.add({ severity: 'error', detail: '?????????????????????????????????! ????????????????????????????????? ???????????????!', life: 3000 });
    Promise.reject(error);
  };

  /**
   * ajax post
   *
   * @param {string} api api
   * @param {*} req ????????????
   * @param {*} params params
   * @returns ????????????
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
   * @returns ????????????
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
      CommunityRating: res.CommunityRating, // ???????????? ?????????????????????
      CriticRating: res.CriticRating, // ??????????????? ???????????????
      DateCreated: res.DateCreated, // ????????????
      DisplayOrder: res.DisplayOrder,
      EndDate: res.EndDate, // ????????????
      ForcedSortName: res.ForcedSortName, // ????????????
      Genres: res.Genres,
      Id: res.Id,
      LockData: res.LockData, // ??????
      LockedFields: res.LockedFields, // ??????
      Name: res.Name,
      OriginalTitle: res.OriginalTitle, // ???????????? ?????????????????????
      OfficialRating: res.OfficialRating, // ???????????? ?????????????????????
      CustomRating: res.CustomRating, // ??????????????? ???????????????
      Overview: res.Overview, // ??????
      People: res.People,
      PreferredMetadataCountryCode: res.PreferredMetadataCountryCode || '', // ???????????????????????????
      PreferredMetadataLanguage: res.PreferredMetadataLanguage || '', // ?????????????????????
      PremiereDate: res.PremiereDate, // ????????????
      ProductionYear: res.ProductionYear, // ????????????
      ProviderIds: res.ProviderIds, // ??????????????? ??????????????????????????????
      RunTimeTicks: res.RunTimeTicks, // ???????????? ?????? ?????????????????????
      Status: res.Status, // ????????????
      Studios: res.Studios, // ????????????
      Tags: res.TagItems.map((t) => t.Name), // ?????? TagItems??????
      SortName: res.SortName, // ????????????
      Taglines: res.Taglines, // ???????????? ?????????????????????
    };
  };

  return {
    get, post, getSeriesItem,
  };
};

export default useAjax;
