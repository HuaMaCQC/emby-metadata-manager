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
    label: '中繼資料管理',
    icon: 'pi pi-database',
    to: '/',
  },
  {
    key: '2',
    label: '風格設定',
    icon: 'pi pi-hashtag',
    disabled: true,
  },
  {
    key: '3',
    label: '標籤設定',
    icon: 'pi pi-tag',
    disabled: true,
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
      overflow-x: hidden;
      overflow-y: hidden;
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
  width: 230px;

  ::v-deep(.p-panelmenu .p-panelmenu-panel) {
    box-shadow: none;
  }

  // 標題預設
  ::v-deep(.p-panelmenu .p-panelmenu-header > a) {
    background-color: rgb(0, 0, 0, 0);
    color: #b8c7ce;
    padding: 0.9rem 1.2rem;
  }

  // 標題移入
  ::v-deep(.p-panelmenu .p-panelmenu-header:not(.p-highlight):not(.p-disabled) > a:hover) {
    background-color: #1C1F26;
    color: #fff;
  }

  // 展開細項後移入標題
  ::v-deep(.p-panelmenu .p-panelmenu-header.p-highlight:not(.p-disabled) > a:hover) {
    background-color: #31343D;
    color: #fff;
  }

  // 標題焦點
  ::v-deep(.p-panelmenu .p-panelmenu-panel .p-panelmenu-header .p-panelmenu-header-link:focus) {
    background-color: #1C1F26;
    color: #fff;
  }

  // 細項
  ::v-deep(.p-panelmenu .p-panelmenu-content) {
    padding: 0px;
    background-color: #3D5488;
  }

  // 細項容器
  ::v-deep(.p-panelmenu .p-panelmenu-content .p-menuitem .p-menuitem-link) {
    padding: 0.9rem 2.2rem;
  }

  // 細項移入
  ::v-deep(.p-menuitem .p-menuitem-link:not(.p-disabled):hover) {
    background-color: #1e282c;
  }

  // 細項文字
  ::v-deep(.p-menuitem .p-menuitem-link .p-menuitem-text) {
    color: #b8c7ce;
  }

  // 細項文字移入
  ::v-deep(.p-menuitem-link:not(.p-disabled):hover .p-menuitem-text) {
    color: #fff !important;
  }
}
</style>
