import { createStore } from 'vuex';
import * as actions from './actions';
import * as mutations from './mutations';

const state = {
  // 管理員資訊
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {
    token: null,
    id: null,
    name: null,
  },
  deviceId: localStorage.getItem('deviceId') || '',
  isLogin: null,
  genres: [],
  tags: [],
};

export default createStore({
  state,
  actions,
  mutations,
});
