<template>
  <div class="genre">
    <Button
      v-is-Loading="loading"
      class="p-button-raised btn p-button-plain"
      :disabled="loading"
      @click="getGenres">重新整理</Button>
    <DataTable :value="data" responsiveLayout="scroll" :resizableColumns="true" :autoLayout="true" :scrollable="false">
      <Column field="name" header="名稱"></Column>
      <Column field="id" header="包含動漫">
        <template #body="slotProps">
          <div class="series-tiems">
            <div v-for="item in slotProps.data.seriesTiems" :key="item.id">
              <Chip v-is-Loading="loading"
              :removable="!loading"
              @remove="() => remove(item.id, slotProps.data.name)">
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
import { onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import Chip from 'primevue/chip';
import vIsLoading from '@/utils/vIsLoading';

const { get, post } = useAjax();
const store = useStore();
const total = ref(0);
const data = ref([]);
const confirm = useConfirm();
const toast = useToast();
const loading = ref(false);
const mySeriesTiems = ref([]);
const user = computed(() => store.state.user);

const getGenres = async () => {
  loading.value = true;
  const ItemsRes = await get('/emby/Items', {
    IncludeItemTypes: 'Series',
    Recursive: 'true',
    Fields: 'Genres,Tags,BasicSyncInfo',
  });

  if (!ItemsRes || !ItemsRes.Items) {
    toast.add({ severity: 'error', summary: '載入錯誤', detail: '如果發生太多次請通知花媽謝謝!', life: 3000 });

    return;
  }

  mySeriesTiems.value = ItemsRes.Items;

  const res = await get('/emby/Genres', {
    IncludeItemTypes: 'Series',
    Fields: 'Series',
    Recursive: 'true',
  });

  loading.value = false;

  if (res && Array.isArray(res.Items)) {
    store.commit('setGenres', res.Items);
    total.value = res.TotalRecordCount;
    const items = ItemsRes.Items;

    data.value = res.Items.map((g) => {
      const seriesTiems = items
        .filter((item) => item.GenreItems.find((s) => s.Id.toString() === g.Id.toString()))
        .map((item) => ({ id: item.Id, name: item.Name }));

      return { name: g.Name, id: g.Id, seriesTiems };
    });
  }
};

const getSeriesItem = async (id) => {
  const res = await get(`/emby/Users/${user.value.id}/Items/${id}`);

  return {
    CommunityRating: res.CommunityRating, // 論壇評分 通常由爬蟲取得
    CriticRating: res.CriticRating, // 評論家評分 通常無資料
    DateCreated: res.DateCreated, // 創建日期
    DisplayOrder: res.DisplayOrder,
    EndDate: res.EndDate, // 播完時間
    ForcedSortName: res.ForcedSortName, // 排序名稱
    Genres: res.Genres,
    Id: res.Id,
    LockData: res.LockData, // 大鎖
    LockedFields: res.LockedFields, // 小鎖
    Name: res.Name,
    OriginalTitle: res.OriginalTitle, // 原始標題 爬蟲爬到的標題
    OfficialRating: res.OfficialRating, // 官方評級 通常由爬蟲取得
    CustomRating: res.CustomRating, // 自定義分級 通常無資料
    Overview: res.Overview, // 介紹
    People: res.People,
    PreferredMetadataCountryCode: res.PreferredMetadataCountryCode || '', // 首選元數據國家代碼
    PreferredMetadataLanguage: res.PreferredMetadataLanguage || '', // 首選元數據語言
    PremiereDate: res.PremiereDate, // 首映日期
    ProductionYear: res.ProductionYear, // 生產年份
    ProviderIds: res.ProviderIds, // 爬蟲識別碼 建議直接回傳部要更改
    RunTimeTicks: res.RunTimeTicks, // 運行時間 微秒 不知道幹啥用的
    Status: res.Status, // 目前狀態
    Studios: res.Studios, // 製作廠商
    Tags: res.Tags, // 需與 TagItems一樣
    TagItems: res.TagItems.map((v) => ({ Name: v.Name })), // 與Tags 一樣一起發
    SortName: res.SortName, // 排序時間
    Taglines: res.Taglines, // 品牌理念 用來自訂意訊息
  };
};

const remove = async (vid, gName, { showToast = true, setLoading = true }) => {
  if (setLoading) {
    loading.value = true;
  }

  let newData = await getSeriesItem(vid);

  newData = {
    ...newData,
    Genres: newData.Genres.filter((v) => v !== gName),
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

  if (setLoading) {
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
        await getGenres();
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
  getGenres();
});
</script>

<style lang="scss" scoped>
.genre {
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
