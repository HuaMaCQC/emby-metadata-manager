<!-- 登入 -->
<template>
  <div class="login">
    <div class="dialog">
      <div class="logo"><img alt="" src="@/assets/image/login-logo.jpg" /></div>

      <form class="content">
        <h2>爆ぜろリアル！弾けろシナプス</h2>
        <div class="input">
          <span class="p-input-icon-right item">
            <i class="pi pi-user" />
            <InputText type="text" v-model="account" placeholder="帳號" />
          </span>

          <span class="p-input-icon-right item">
            <i class="pi pi-lock" />
            <InputText type="password" autocomplete="on" v-model="password" placeholder="密碼" :maxlength="16" />
          </span>

          <Button class="item" label="登入" @click="clickLogin" v-is-Loading="loading" :disabled="disabledSubmit" />
        </div>
        <h2>使用公共電腦，請用無痕模式登入!並請一定要登出</h2>
        <Toast />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import InputText from 'primevue/inputtext';
import useAjax from '@/utils/useAjax';
import Button from 'primevue/button';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import vIsLoading from '@/utils/vIsLoading';
import validator from 'validator';

const toast = useToast();
const { post } = useAjax();
const store = useStore();
const router = useRouter();

/** 是否加載中 */
const loading = ref(false);
const account = ref('');
const password = ref('');

/** 錯誤提示 */
const errorState = (code, msg) => {
  toast.add({ severity: 'error', detail: msg, life: 3000 });
};

/** 登入按鈕禁用 */
const disabledSubmit = computed(
  () => !(validator.isLength(password.value, { min: 3, max: undefined }) || validator.isLength(password.value, { min: 3, max: undefined })),
);

const clickLogin = async () => {
  loading.value = true;

  const res = await post(
    '/emby/Users/authenticatebyname',
    {
      Username: account.value,
      Pw: password.value,
    },
  );

  loading.value = false;

  if (!res || !res.AccessToken) {
    errorState(0, '登入失敗，如果有問題不要一直登 找花媽謝謝!');

    return;
  }

  // store.commit('receiveAdmin', { name: res.loginResult.admin.name });
  store.dispatch('login', res.AccessToken);
  router.push({ path: '/' });
};
</script>

<style lang="scss" scoped>
.login {
  background-color: #c2e0f3;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      height: 200px;
    }
  }

  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .input {
      display: flex;
      flex-direction: column;

      .item {
        margin-top: 10px;
      }
    }
  }
}
</style>
