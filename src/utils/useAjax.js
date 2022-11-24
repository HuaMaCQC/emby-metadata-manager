/* eslint-disable no-unused-vars */
import axios from 'axios';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import useUtils from '@/utils/useUtils';
import config from '@/config';
import { computed } from 'vue';

const useAjax = () => {
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.put['Content-Type'] = 'application/json';
  axios.defaults.timeout = '45000';
  const store = useStore();
  const toast = useToast();
  const router = useRouter();

  const { getUuid } = useUtils();
  const deviceId = computed(() => store.state.deviceId);
  const accessToken = computed(() => store.state.token.accessToken);
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

  // 加上Token
  axios.interceptors.request.use((_config) => {
    const req = _config;

    if (!deviceId.value) {
      store.dispatch('setDeviceId', getUuid());
    }

    req.params = {
      'X-Emby-Device-Id': deviceId.value,
      'X-Emby-Client-Version': config.Client_Version,
      'X-Emby-Client': config.Client,
      'X-Emby-Device-Name': userAgent.value,
      ...req.params,
    };

    if (accessToken.value) {
      req.params['X-Emby-Token'] = accessToken.value;
    }

    return req;
  }, (error) => Promise.reject(error));

  // 處理錯誤
  const responseError = (error) => {
    // const { status, statusText } = error.response;

    // if (status === 401) {
    //   router.push({ path: '/login' });
    //   toast.add({ severity: 'error', detail: '帳號密碼錯誤', life: 3000 });

    //   return;
    // }

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
  const post = (api, req, params = {}) => axios
    .post(api, { ...req }, { params })
    .then((d) => Promise.resolve(d.data))
    .catch((err) => {
      responseError(err);
    });

  /**
   * ajax get
   *
   * @param {string} api api
   * @returns 回傳資料
   */
  const get = (api, req) => axios.get(api, { params: { ...req } })
    .then((d) => Promise.resolve(d.data))
    .catch((err) => {
      responseError(err);
    });

  /**
   * ajax put
   *
   * @param {string} api api
   * @param {*} req 查詢資料
   * @param {*} params params
   * @returns 回傳資料
   */
  const put = (api, req, params = {}) => axios
    .put(api, { ...req }, { params })
    .then((d) => Promise.resolve(d.data))
    .catch((err) => {
      responseError(err);
    });

  return {
    get, post, put,
  };
};

export default useAjax;
