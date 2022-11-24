import useUitls from '@/utils/useUtils';

export const receiveDeviceId = (state, messages) => {
  if (!messages || typeof messages !== 'string') {
    console.error('錯誤操作');

    return;
  }

  state.deviceId = messages;
};

export const receiveUser = (state, messages) => {
  console.log(messages?.token, '設定的token');

  state.user = {
    id: messages?.id,
    token: messages?.token,
    name: messages?.name,
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
