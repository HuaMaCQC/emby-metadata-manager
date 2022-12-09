<template>
  <div class="episodes">
    <DataTable
      :value="data"
      dataKey="id"
      @row-dblclick="onDblclick"
      responsiveLayout="scroll"
    >
    <Column field="Name" header="類型名稱"></Column>
      <!-- <Column field="code" header="Code"></Column>
      <Column field="name" header="Name"></Column>
      <Column field="category" header="Category"></Column>
      <Column field="quantity" header="Quantity"></Column> -->
    </DataTable>
  </div>
</template>

<script setup>
import DataTable from 'primevue/datatable';
import { onMounted, ref } from 'vue';
import useAjax from '@/utils/useAjax';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';

// eslint-disable-next-line no-unused-vars
const { get, post } = useAjax();
// const loading = ref(false);
const toast = useToast();

const data = ref([]);

const getSeries = async () => {
  const ItemsRes = await get('/emby/Items', {
    IncludeItemTypes: 'Series',
    Recursive: 'true',
  });

  if (!ItemsRes || !ItemsRes.Items) {
    toast.add({ severity: 'error', summary: '載入錯誤', detail: '如果發生太多次請通知花媽謝謝!', life: 3000 });

    return;
  }

  console.log(ItemsRes);

  data.value = ItemsRes.Items;
};

onMounted(() => {
  getSeries();
});
const onDblclick = () => {
  console.log('點了');
};
</script>
<style lang="scss" scoped>
.episodes {
  height: 100%;
}
</style>
