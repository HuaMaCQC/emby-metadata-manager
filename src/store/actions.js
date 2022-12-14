export const setDeviceId = ({ commit }, id) => {
  localStorage.setItem('deviceId', id);

  commit('receiveDeviceId', (id || ''));
};

// 登出
export const logout = ({ commit }) => {
  localStorage.removeItem('user');

  commit('receiveUser', { id: null, name: null, token: null });
};

export const changeSetting = ({ commit, state }, setting) => {
  const newSetting = {
    ...state.setting,
    ...setting,
  };

  console.log(newSetting);

  localStorage.setItem('setting', JSON.stringify(newSetting));
  commit('receiveSetting', newSetting);
};

// 登入
export const login = ({ commit }, { token, user }) => {
  const json = JSON.stringify({
    token,
    id: user.Id,
    name: user.Name,
  });

  localStorage.setItem('user', json);

  if (token) {
    commit('receiveUser', {
      id: user.Id,
      name: user.Name,
      token,
    });
  }
};
