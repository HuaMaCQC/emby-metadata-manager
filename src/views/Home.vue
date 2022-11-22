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
import { provide, ref } from 'vue';
import Menu from '@/components/Menu/Menu.vue';
import Header from '@/components/Header/Header.vue';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';

/** menu是否縮小 */
const menuFold = ref(false);

/** menu縮小 */
const clickMenuFold = () => {
  menuFold.value = !menuFold.value;
};

provide('menuState', {
  clickMenuFold,
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
  background-color: #F0FAFB;
  box-shadow: 10px 0 10px 0 #3D5488;
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
  background-color: #3D5488;

  &.menu-fold:not(:hover) {
    width: 56px;
  }
}

// 內容頁
.content {
  display: block;
  background-color: #CCE9F7;
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
