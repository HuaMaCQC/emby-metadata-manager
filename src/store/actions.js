// 設定Token
export const setToken = ({ commit }, token) => {
  localStorage.setItem('acctoken', token);

  commit('receiveToken', {
    accessToken: token || '',
  });
};

export const setDeviceId = ({ commit }, id) => {
  localStorage.setItem('deviceId', id);

  commit('deviceId', {
    deviceId: id || '',
  });
};

// 刪除Token
export const delToken = ({ commit }) => {
  localStorage.removeItem('acctoken');

  commit('receiveToken', { accessToken: '' });
};

// 登出
export const logout = () => {};

// 登入
export const login = () => {};
