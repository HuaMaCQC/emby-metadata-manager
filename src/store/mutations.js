// eslint-disable-next-line import/prefer-default-export
export const receiveToken = (state, messages) => {
  if (!messages.accessToken || typeof messages.accessToken !== 'string') {
    console.log(messages.accessToken);
    console.error('錯誤操作');
    return;
  }

  state.token = {
    accessToken: messages.accessToken,
  };
};

export const receiveAdmin = (state, messages) => {
  if (typeof messages !== 'object') {
    console.error('錯誤操作');
    return;
  }

  state.admin = {
    name: messages.name !== undefined ? messages.name : state.admin.name,
  };
};

export const isLonin = (state, messages) => {
  if (typeof messages !== 'boolean') {
    console.error('錯誤操作');
    return;
  }

  state.isLogin = messages;
};
