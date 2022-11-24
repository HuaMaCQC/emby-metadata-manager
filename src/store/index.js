import { createStore } from 'vuex';
import * as actions from './actions';
import * as mutations from './mutations';

const state = {
  token: {
    accessToken: localStorage.getItem('acctoken') || '',
  },
  // 管理員資訊
  admin: {
    name: null,
  },
  isLogin: null,
  deviceId: localStorage.getItem('deviceId') || '',
  genres: [],
  tags: [],
};

export default createStore({
  state,
  actions,
  mutations,
});
