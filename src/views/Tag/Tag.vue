<template>
  <div class="tag">
    <Button
      v-is-Loading="loading"
      class="btn p-button-raised p-button-plain"
      :disabled="loading"
      @click="getTags">重新整理</Button>
    <DataTable :value="data" responsiveLayout="scroll" :resizableColumns="true" :autoLayout="true" :scrollable="false">
      <Column field="name" header="名稱"></Column>
      <Column field="id" header="包含動漫">
        <template #body="slotProps">
          <div class="series-tiems">
            <div v-for="item in slotProps.data.seriesTiems" :key="item.id">
              <Chip v-is-Loading="loading"
              :removable="!loading"
              @remove="() => remove(item.id, slotProps.data.name, { showToast : true})">
              {{ item.name }}</Chip>
            </div>
          </div>
        </template>
      </Column>
      <Column field="id" header="操作">
        <template #body="slotProps">
          <Button
            v-is-Loading="loading"
            class="p-button-raised p-button-text p-button-plain p-button-sm"
            :disabled="loading"
            @click="() => delAll(slotProps.data)">全部刪除</Button>
        </template>
      </Column>
      <template #footer>
        <div class="footer">總筆數: {{ total }}</div>
      </template>
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
import Chip from 'primevue/chip';
import vIsLoading from '@/utils/vIsLoading';

const { get, post, getSeriesItem } = useAjax();
const store = useStore();
const total = ref(0);
const data = ref([]);
const confirm = useConfirm();
const toast = useToast();
const loading = ref(false);
const mySeriesTiems = ref([]);

const getTags = async () => {
  loading.value = true;
  const ItemsRes = await get('/emby/Items', {
    IncludeItemTypes: 'Series',
    Recursive: 'true',
    Fields: 'Tags,BasicSyncInfo',
  });

  if (!ItemsRes || !ItemsRes.Items) {
    toast.add({ severity: 'error', summary: '載入錯誤', detail: '如果發生太多次請通知花媽謝謝!', life: 3000 });

    return;
  }

  mySeriesTiems.value = ItemsRes.Items;

  const res = await get('/emby/Tags', {
    IncludeItemTypes: 'Series',
    Fields: 'Series',
    Recursive: 'true',
  });

  loading.value = false;

  if (res && Array.isArray(res.Items)) {
    store.commit('setTags', res.Items);
    total.value = res.TotalRecordCount;
    const items = ItemsRes.Items;

    data.value = res.Items.map((g) => {
      const seriesTiems = items
        .filter((item) => item.TagItems.find((s) => s.Id.toString() === g.Id.toString()))
        .map((item) => ({ id: item.Id, name: item.Name }));

      return { name: g.Name, id: g.Id, seriesTiems };
    });
  }
};

const remove = async (vid, gName, options) => {
  const { showLoading, showToast } = {
    showLoading: true,
    showToast: true,
    ...options,
  };

  if (showLoading) {
    loading.value = true;
  }

  let newData = await getSeriesItem(vid);

  newData = {
    ...newData,
    Tags: newData.Tags.filter((v) => v !== gName),
  };

  await post(`/emby/Items/${vid}`, newData, { reqformat: 'json' })
    .then(() => {
      if (showToast) {
        toast.add({ severity: 'success', summary: '刪除完成', detail: '請按一下重整! 確認一下!', life: 1000 });
      }
    })
    .catch(() => {
      if (showToast) {
        toast.add({ severity: 'error', summary: '刪除失敗!', detail: '請重整後再次確認', life: 3000 });
      }
    });

  if (showLoading) {
    loading.value = false;
  }
};

const delAll = async (d) => {
  confirm.require({
    message: `你確定刪除 [ ${d.name} ] 風格嗎? 刪除後無法恢復喔!`,
    header: '刪除風格',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    accept: () => {
      loading.value = true;
      const myRemoves = [];
      for (let i = 0; i < d.seriesTiems.length; i += 1) {
        myRemoves.push(remove(d.seriesTiems[i].id, d.name, { showToast: false, setLoading: false }));
      }

      Promise.all(myRemoves).then(async () => {
        await getTags();
        toast.add({ severity: 'success', summary: '刪除完畢', life: 3000 });
      }).catch(() => {
        toast.add({ severity: 'error', summary: '刪除失敗', detail: '請重整後再次確認', life: 3000 });
      }).finally(() => {
        loading.value = false;
      });
    },
  });
};

onMounted(() => {
  getTags();
});
</script>

<style lang="scss" scoped>
.tag {
  height: 100%;

  ::v-deep(.btn) {
    margin-bottom: 10px;
  }

  ::v-deep(.series-tiems) {
    display: flex;
    height: 100%;
    flex-wrap: wrap;
    .p-chip {
      margin-right: 10px;
      margin-top: 10px;
    }
  }

  .footer {
    text-align: center;
  }
}
</style>
