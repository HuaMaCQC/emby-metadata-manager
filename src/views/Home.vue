<template>
  <div>
    <Header class="header" :class="menuFold && 'menu-fold'" />
    <Menu class="menu" :class="menuFold && 'menu-fold'" @clickMenuFold="clickMenuFold" />
    <router-view class="content" :class="menuFold && 'menu-fold'" />
    <template>
      <Toast />
    </template>
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { provide, ref, onMounted } from 'vue';
import Menu from '@/components/Menu/Menu.vue';
import Header from '@/components/Header/Header.vue';
import Toast from 'primevue/toast';
import useAjax from '@/utils/useAjax';
import { useStore } from 'vuex';
import ConfirmDialog from 'primevue/confirmdialog';

/** menu是否縮小 */
const menuFold = ref(false);

/** menu縮小 */
const clickMenuFold = () => {
  menuFold.value = !menuFold.value;
};

const { get } = useAjax();
const store = useStore();

provide('menuState', {
  clickMenuFold,
});

const getGenres = async () => {
  const res = await get('/emby/Genres', {
    IncludeItemTypes: 'Series',
    Recursive: 'true',
  });

  if (res && Array.isArray(res.Items)) {
    store.commit('setGenres', res.Items);
  }
};

const getTag = async () => {
  const res = await get('/emby/Tags', {
    IncludeItemTypes: 'Series',
    Recursive: 'true',
  });

  if (res && Array.isArray(res.Items)) {
    if (res && Array.isArray(res.Items)) {
      store.commit('setTags', res.Items);
    }
  }
};

onMounted(() => {
  getGenres();
  getTag();
});
</script>

<style lang="scss" scoped>
// 上方列
.header {
  position: fixed !important;
  top: 0;
  z-index: 98;
  width: calc(100% - 230px);
  height: 56px;
  background-color: #f0fafb;
  box-shadow: 10px 0 10px 0 #3d5488;
  margin-left: 230px;
  padding: 15px;

  @media (max-width: 1040px) {
    width: calc(100% - 56px);
    margin-left: 56px;
  }

  &.menu-fold {
    margin-left: 56px;
    width: calc(100% - 56px);
  }
}

// 左側欄
.menu {
  position: fixed !important;
  width: 230px;
  height: 100%;
  z-index: 99;
  overflow: auto;
  background-color: #3d5488;

  &.menu-fold:not(:hover) {
    width: 56px;
  }
}

// 內容頁
.content {
  display: block;
  background-color: #cce9f7;
  margin-left: 230px;
  width: calc(100% - 230px);
  min-height: 100vh;
  height: 100%;
  padding: 65px 20px;

  @media (max-width: 1040px) {
    margin-left: 56px;
    width: calc(100% - 56px);
  }

  &.menu-fold {
    margin-left: 56px;
    width: calc(100% - 56px);
  }
}
</style>
