<template>
  <div>
    <router-view />
  </div>

  <Message style="position: fixed; z-index: 1002; bottom: 0px">
    目前未完成帳密登入程序，如果要在公用電腦使用請用無痕模式! 請勿留下網址位置。
  </Message>
</template>
<script setup>
import { useRouter } from 'vue-router';
import Message from 'primevue/message';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { usePrimeVue } from 'primevue/config';
import zh from '@/locale/primeVue.zh-tw.json';

const router = useRouter();
const store = useStore();
const user = computed(() => store.state.user);
const primevue = usePrimeVue();

const getLoginData = async () => {
  if (user.value && user.value.token && user.value.id) {
    store.commit('isLonin', true);

    return;
  }

  store.commit('isLonin', false);
  router.push('/login');
};

onMounted(() => {
  primevue.config.locale = zh;
  getLoginData();
});
</script>
<style lang="scss">
body {
  overflow: overlay;

  &::-webkit-scrollbar-button {
    background: transparent;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track-piece {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgb(0, 0, 0, 0.2);
  }
  &::-webkit-scrollbar-track {
    box-shadow: transparent;
  }
}
</style>
