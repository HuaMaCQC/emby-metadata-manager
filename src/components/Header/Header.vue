<template>
  <div class="header">
    <div class="flex">
      <Button icon="pi pi-bars" class="p-button-rounded p-button-text p-button-plain" @click="clickMenuFold" />
      <h2 class="title">中繼資料管理</h2>
    </div>
    <div class="flex">
      <p class="title"><i class="pi pi-user user-icon" />{{ name }}</p>
      <Button label="登出" class="p-button-outlined logout" @click="singOut" />
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import Button from 'primevue/button';
// import useAjax from '@/utils/useAjax';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

// const { post } = useAjax();

const router = useRouter();

const store = useStore();

const name = computed(() => store.state.admin.name);

const { clickMenuFold } = inject('menuState');

const singOut = async () => {
  // const res = await post('/api/SignOut');

  // if (res.errCode !== 0) {
  //   return;
  // }

  store.commit('isLonin', false);
  store.dispatch('delToken');
  router.push({ path: '/login' });
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  // 標題
  .title {
    margin: 0 10px;
    white-space: nowrap;
  }

  // 按鈕、標題的區塊
  .flex {
    display: flex;
    align-items: center;

    // 管理員icon
    .user-icon {
      margin: 10px;
    }

    .logout {
      height: 30px;
      margin: 10px;
    }
  }
}
</style>
