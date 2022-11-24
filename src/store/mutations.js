import useUitls from '@/utils/useUtils';

export const receiveToken = (state, messages) => {
  if (!messages.accessToken || typeof messages.accessToken !== 'string') {
    console.error('錯誤操作');

    return;
  }

  state.token = {
    accessToken: messages.accessToken,
  };
};

export const receiveDeviceId = (state, messages) => {
  if (!messages || typeof messages !== 'string') {
    console.error('錯誤操作');

    return;
  }

  state.deviceId = messages;
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

export const setGenres = (state, messages) => {
  if (!Array.isArray(messages)) {
    console.error('錯誤操作');
    return;
  }

  const { deepClone } = useUitls();
  state.genres = deepClone(messages);
};

export const setTags = (state, messages) => {
  if (!Array.isArray(messages)) {
    console.error('錯誤操作');
    return;
  }

  const { deepClone } = useUitls();
  state.tags = deepClone(messages);
};

export const isLonin = (state, messages) => {
  if (typeof messages !== 'boolean') {
    console.error('錯誤操作');
    return;
  }

  state.isLogin = messages;
};
