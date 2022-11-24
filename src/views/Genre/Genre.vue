<template>
  <div class="genre">
    <DataTable :value="data" showGridlines responsiveLayout="scroll" :resizableColumns="true">
      <Column field="Name" header="類型名稱"></Column>
      <Column field="id" header="所屬動漫">
        <template #body="slotProps">
          <div v-for="d in slotProps.item" :key="d.Id">
            <Chip>{{d.Name}}</Chip>
          </div>

        </template>
      </Column>
      <Column field="id" header="操作">
        <template #body="slotProps">
          <Button class="p-button-raised p-button-text p-button-plain p-button-sm" @click="() => delAll(slotProps.data)">全部刪除</Button>
        </template>
      </Column>

      <template #footer>總筆數: {{ total }}</template>
    </DataTable>
  </div>
</template>

<script setup>
import useAjax from '@/utils/useAjax';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
// eslint-disable-next-line no-unused-vars
import Chip from 'primevue/chip';

const { get } = useAjax();
const store = useStore();
const total = ref(0);
const data = ref([]);
const confirm = useConfirm();
const toast = useToast();

const getGenres = async () => {
  const res = await get('/emby/Genres', {
    IncludeItemTypes: 'Series',
    Fields: 'Series',
    Recursive: 'true',
  });

  if (res && Array.isArray(res.Items)) {
    store.commit('setGenres', res.Items);
    total.value = res.TotalRecordCount;
    data.value = res.Items;
  }
};

const getSeries = async () => {
  const res = await get('/emby/Items', {
    IncludeItemTypes: 'Series',
    Recursive: 'true',
    Fields: 'Genres,Tags,BasicSyncInfo',
  });

  if (res && res.Items) {
    data.value.forEach((d, i) => {
      data.value[i].item = [];
      res.Items.forEach((series) => {
        if (series.GenreItems.find((s) => s.Id.toString() === d.Id.toString())) {
          data.value[i].item.push({
            Id: series.Id,
            Name: series.Name,
          });
        }
      });
    });
  }
};

// eslint-disable-next-line no-unused-vars
const remove = async (vid, gid) => {
  console.log(vid, gid);
};

const delAll = async (d) => {
  confirm.require({
    message: `你確定刪除 [ ${d.Name} ] 風格嗎? 刪除後無法恢復喔!`,
    header: '刪除風格',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    accept: () => {
      toast.add({ severity: 'info', summary: 'Confirmed', detail: '此功能還沒有做好抱歉!', life: 3000 });
    },
  });
};

onMounted(() => {
  getGenres().then(() => getSeries());
});
</script>

<style lang="scss" scoped>
.genre {
  height: 100%;
}
</style>
