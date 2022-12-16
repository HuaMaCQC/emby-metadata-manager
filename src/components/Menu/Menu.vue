<template>
  <div class="menu" :class="menuFold && 'menu-fold'">
    <div class="logo">
      <img alt="" src="../../assets/image/logo.png" />
    </div>
    <div class="logo-sm">
      <img alt="" class="img" src="../../assets/image/logo-sm.png" />
    </div>
    <div class="list">
      <PanelMenu :model="items" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, toRefs } from 'vue';
import PanelMenu from 'primevue/panelmenu';

const props = defineProps({ menuFold: Boolean });
const { menuFold } = toRefs(props);

const items = ref([
  {
    key: '0',
    label: '首頁',
    icon: 'pi pi-home',
    to: '/',
  },
  {
    key: '1',
    label: '動漫設定 - 標籤與風格',
    icon: 'pi pi-database',
    to: 'genre-tag-metadata',
  },
  {
    key: '2',
    label: '動漫設定 - 簡介',
    icon: 'pi pi-database',
    to: 'info',
  },
  {
    key: '3',
    label: '動漫設定 - 聲優',
    icon: 'pi pi-database',
    disabled: true,
    // to: 'genre-tag-metadata',
  },
  {
    key: '4',
    label: '動漫設定 - 製作組',
    icon: 'pi pi-database',
    disabled: true,
    // to: 'genre-tag-metadata',
  },
  {
    key: '5',
    label: '風格管理',
    icon: 'pi pi-hashtag',
    to: 'genre',
  },
  {
    key: '6',
    label: '標籤管理',
    icon: 'pi pi-tag',
    to: 'tag',
  },
  {
    key: '7',
    label: '動漫單集管理',
    icon: 'pi pi-vimeo',
    to: 'episodes',
  },
  // { //目前先不要用細項 因為項目不多
  //   key: '4',
  //   label: '後臺帳號管理',
  //   icon: 'pi pi-cog',
  //   items: [
  //     {
  //       key: '4_0',
  //       label: '帳號列表',
  //       to: 'admin_list',
  //     },
  //     {
  //       key: '4_1',
  //       label: '操作紀錄',
  //       to: 'operation_record',
  //     },
  //   ],
  // },
]);
</script>

<style lang="scss" scoped>
.menu {
  @media (max-width: 1040px) {
    &:not(:hover) {
      overflow: hidden;
      width: 56px;

      .logo {
        display: none;
      }

      .logo-sm {
        display: flex;
        justify-content: center;

        // 圖示logo
        .img {
          width: 30px;
          height: 30px;
          margin: 10px;
        }
      }

      // 隱藏文字
      ::v-deep(.p-menuitem-text) {
        display: none;
      }
    }
  }

  // menu縮排
  .menu-fold:not(:hover) {
    overflow-x: hidden;

    .logo {
      display: none;
    }

    .logo-sm {
      display: flex;
      justify-content: center;

      // 圖示logo
      .img {
        width: 30px;
        height: 30px;
        margin: 10px;
      }
    }

    // 隱藏文字
    ::v-deep(.p-menuitem-text) {
      display: none;
    }
  }

  // 文字logo
  .logo {
    display: flex;
    justify-content: center;
    margin: 20px;

    img {
      height: 60px;
    }
  }

  // 圖示logo
  .logo-sm {
    display: none;
  }

  .list {

    // ::v-deep(.p-panelmenu .p-panelmenu-panel) {
    //   box-shadow: none;
    // }
    ::v-deep(.p-panelmenu .p-panelmenu-header .p-panelmenu-header-content) {
      background-color: #3D5488;
      box-shadow: none;
      border: none;
      border-radius: 0px;

      &:hover{
        background-color: #253252;

      }

      // 標題預設
      .p-panelmenu-header-action {
        background-color: rgb(0, 0, 0, 0);
        color: #b8c7ce;
        padding: 0.9rem 1.2rem;
      }
    }

    ::v-deep(.p-panelmenu .p-panelmenu-header.p-highlight .p-panelmenu-header-content){
      background-color: #253252;
    }
  }
}
</style>
