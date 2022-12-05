<template>
  <template>
    <div class="info">
      <div>
        <Button v-is-Loading="loading" class="p-button-raised btn p-button-plain" @click="init">重新整理</Button>
      </div>

      <div class="remind">
        <p>動漫數: {{ total }}</p>
        <p :style="{ color: 'red', paddingRight: '1px' }">** 注意:前端網頁會去除空白及換行 **</p>
      </div>

      <DataTable :value="data" responsiveLayout="scroll" :resizableColumns="true" :autoLayout="true" :scrollable="false">
        <Column field="Name" header="類型名稱"></Column>
        <Column header="備註(會在影片介紹上面)">
          <template #body="slotProps">
            <div class="taglines">
              <InputText placeholder="打空白會被濾掉" v-model="slotProps.data.remark" />
            </div>
          </template>
        </Column>
        <Column header="介紹">
          <template #body="slotProps">
            <div class="taglines">
              <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
              <Textarea autoResize v-model="slotProps.data.Overview" rows="4" cols="60" />
            </div>
          </template>
        </Column>
        <Column header="儲存">
          <template #body="slotProps">
            <Button class="p-button-success" @click="() => save(slotProps.data)"> 保存 </Button>
          </template>
        </Column>
      </DataTable>

    </div>
  </template>
</template>

<script setup>
import useAjax from '@/utils/useAjax';
import { onMounted, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import vIsLoading from '@/utils/vIsLoading';

const { get, post, getSeriesItem } = useAjax();

const total = ref(0);
const data = ref([]);
const toast = useToast();
const loading = ref(false);

const getSeries = async () => {
  loading.value = true;

  const ItemsRes = await get('/emby/Items', {
    IncludeItemTypes: 'Series',
    Recursive: 'true',
    Fields: 'Overview,Taglines',
  });

  if (!ItemsRes || !ItemsRes.Items) {
    toast.add({
      severity: 'error',
      detail: '載入錯誤 如果發生太多次請通知花媽謝謝!',
      life: 3000,
    });

    return;
  }

  data.value = ItemsRes.Items.map((d) => ({ ...d, remark: d.Taglines[0] }));
  total.value = ItemsRes.TotalRecordCount;
  loading.value = false;
};

const init = async () => {
  await getSeries();
};

const save = async (vData) => {
  const d = await getSeriesItem(vData.Id);
  const newData = { ...d, Overview: vData.Overview, Taglines: [vData.remark] };

  await post(`/emby/Items/${vData.Id}`, newData, {
    reqformat: 'json',
  }).then(() => {
    toast.add({
      severity: 'success',
      detail: '儲存成功',
      life: 3000,
    });

    init();
  });
};

onMounted(() => {
  init();
});

</script>

<style lang="scss" scoped>
.index {
  height: 100%;
}
</style>
