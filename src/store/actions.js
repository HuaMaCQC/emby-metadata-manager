export const setDeviceId = ({ commit }, id) => {
  localStorage.setItem('deviceId', id);

  commit('receiveDeviceId', (id || ''));
};

// 登出
export const logout = ({ commit }) => {
  localStorage.removeItem('acctoken');

  commit('receiveToken', { accessToken: '' });
  commit('isLonin', false);
};

// 登入
export const login = ({ commit }, token) => {
  localStorage.setItem('acctoken', token);

  if (token) {
    commit('receiveToken', { accessToken: token });
    commit('isLonin', true);
  }
};
