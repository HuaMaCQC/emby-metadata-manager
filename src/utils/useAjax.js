import axios from 'axios';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const useAjax = () => {
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.put['Content-Type'] = 'application/json';
  axios.defaults.timeout = '45000';
  const store = useStore();
  const toast = useToast();
  const router = useRouter();

  // 加上Token
  axios.interceptors.request.use((config) => {
    const req = config;

    if (store.state.token.accessToken) {
      // req.headers.common.Authorization = ;
    }

    return req;
  }, (error) => Promise.reject(error));

  // 處理錯誤
  const responseError = (error) => {
    const { status, statusText } = error.response;
    if (status === 401) {
      router.push({ path: '/login' });
      toast.add({ severity: 'error', detail: '帳號密碼錯誤', life: 3000 });

      return;
    }

    router.push({ path: '/login' });
    toast.add({ severity: 'error', detail: `伺服器錯誤! 請將錯誤資訊回報給管理員 (狀態碼: ${status} - ${statusText})`, life: 3000 });
    Promise.reject(error);
  };

  /**
   * ajax post
   *
   * @param {string} api api
   * @param {*} req 查詢資料
   * @returns 回傳資料
   */
  const post = (api, req) => axios
    .post(api, { ...req })
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
   * @returns 回傳資料
   */
  const put = (api, req) => axios
    .put(api, { ...req })
    .then((d) => Promise.resolve(d.data))
    .catch((err) => {
      responseError(err);
    });

  return {
    get, post, put,
  };
};

export default useAjax;
