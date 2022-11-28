<template>
  <div class="anime-meta-data">
    <Button
      v-is-Loading="loading"
      class="p-button-raised btn p-button-plain"
      @click="init"
      >重新整理</Button
    >
    <div class="remind">
      <p>動漫數: {{ total }}</p>
      <p :style="{color:'red', paddingRight: '1px'}"> ** 注意:前端網頁會去除空白及換行 ** </p>
    </div>
    <DataTable
      :value="data"
      responsiveLayout="scroll"
      :resizableColumns="true"
      :autoLayout="true"
      :scrollable="false"
    >
      <Column field="Name" header="類型名稱"></Column>

      <Column header="風格">
        <template #body="slotProps">
          <div class="genres">
            <div v-for="item in slotProps.data.GenreItems" :key="item.Id">
              <Tag severity="info" :rounded="true" :value="item.Name" />
            </div>
            <Button
              icon="pi pi-file-edit"
              class="p-button-sm p-button-rounded"
              @click="() => openEditGenres(slotProps.data)"
            />
          </div>
        </template>
      </Column>

      <Column header="標籤">
        <template #body="slotProps">
          <div class="tag">
            <div v-for="item in slotProps.data.TagItems" :key="item.Id">
              <Tag severity="info" :rounded="true" :value="item.Name" />
            </div>
            <Button
              icon="pi pi-file-edit"
              class="p-button-sm p-button-rounded"
              @click="() => openEditTags(slotProps.data)"
            />
          </div>
        </template>
      </Column>

      <Column header="備註(會在影片解紹上面)">
        <template #body="slotProps">
          <div class="taglines">
            <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
            <Textarea autoResize v-model="slotProps.data.remark" rows="2" cols="25" />
            <Button icon="pi" class="p-button-rounded p-button-success" @click="() => saveTaglines(slotProps.data)">保存</Button>
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog
      :header="editData.header"
      v-model:visible="displayEditModal"
      :breakpoints="{ '960px': '50vw', '640px': '90vw' }"
      :style="{ width: '20vw' }"
      :modal="true"
    >
      <div class="p-inputgroup" :style="{ marginBottom: '10px' }">
        <InputText placeholder="增加風格" v-model="addOptionValue" />
        <Button
          icon="pi pi-check"
          class="p-button-success"
          @click="addOption"
        />
      </div>

      <div
        v-for="option of editData.option"
        :key="option"
        class="field-checkbox"
        :style="{ marginLeft: '10px', paddingTop: '3px' }"
      >
        <Checkbox :value="option" v-model="editData.values" />
        <label :style="{ marginLeft: '7px' }">{{ option }}</label>
      </div>

      <template #footer>
        <Button
          label="取消"
          icon="pi pi-times"
          @click="closeModal"
          class="p-button-text"
        />
        <Button label="儲存" icon="pi pi-check" @click="saveModal" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import useAjax from '@/utils/useAjax';
import { onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import Tag from 'primevue/tag';
import vIsLoading from '@/utils/vIsLoading';
import Dialog from 'primevue/dialog';
import Checkbox from 'primevue/checkbox';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

// eslint-disable-next-line no-unused-vars
const { get, post } = useAjax();
const store = useStore();
const total = ref(0);
const data = ref([]);
const toast = useToast();
const loading = ref(false);
const addOptionValue = ref('');
const editData = ref({
  header: '',
  option: [],
  values: [],
  vId: -1,
});
const user = computed(() => store.state.user);
const displayEditModal = ref(false);
const genresOption = ref([]);
const tagsOption = ref([]);

const getSeries = async () => {
  loading.value = true;

  const ItemsRes = await get('/emby/Items', {
    IncludeItemTypes: 'Series',
    Recursive: 'true',
    Fields: 'Genres,Tags,Taglines',
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

const getGenresOption = async () => {
  const res = await get('/emby/Genres', {
    IncludeItemTypes: 'Series',
    Fields: 'Series',
    Recursive: 'true',
  });

  if (!res || !res.Items) {
    toast.add({
      severity: 'error',
      detail: '載入錯誤 如果發生太多次請通知花媽謝謝!',
      life: 3000,
    });

    return;
  }

  genresOption.value = res.Items.map((g) => g.Name);
};

const getTagsOption = async () => {
  const res = await get('/emby/Tags', {
    IncludeItemTypes: 'Series',
    Fields: 'Series',
    Recursive: 'true',
  });

  if (!res || !res.Items) {
    toast.add({
      severity: 'error',
      detail: '載入錯誤 如果發生太多次請通知花媽謝謝!',
      life: 3000,
    });

    return;
  }

  tagsOption.value = res.Items.map((g) => g.Name);
};

const addOption = () => {
  if (!addOptionValue.value) {
    return;
  }

  if (editData.value.option.indexOf(addOptionValue.value) !== -1) {
    toast.add({
      severity: 'error',
      detail: '載入錯誤 如果發生太多次請通知花媽謝謝!',
      life: 3000,
    });

    return;
  }

  editData.value = {
    ...editData.value,
    option: [...editData.value.option, addOptionValue.value],
  };

  addOptionValue.value = '';
};

const init = async () => {
  await getSeries();
  await getGenresOption();
  await getTagsOption();
};

const closeModal = () => {
  editData.value = {
    header: '',
    option: [],
    values: [],
    vId: -1,
    key: '',
  };

  displayEditModal.value = false;
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
    Tags: res.TagItems.map((t) => t.Name), // 需與 TagItems一樣
    SortName: res.SortName, // 排序時間
    Taglines: res.Taglines, // 品牌理念 用來自訂意訊息
  };
};

const saveModal = async () => {
  const d = await getSeriesItem(editData.value.vId);

  const newData = { ...d, [editData.value.key]: editData.value.values };

  await post(`/emby/Items/${editData.value.vId}`, newData, {
    reqformat: 'json',
  }).then(() => {
    toast.add({
      severity: 'success',
      detail: '儲存成功',
      life: 3000,
    });

    init();
    closeModal();
  });
};

const saveTaglines = async (vData) => {
  console.log(vData);
  const d = await getSeriesItem(vData.Id);
  const newData = { ...d, Taglines: [vData.remark, '669'] };

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

const openEditGenres = async (vData) => {
  editData.value = {
    header: `編輯 ${vData.Name} 的風格`,
    option: genresOption.value,
    values: vData.Genres,
    vId: vData.Id,
    key: 'Genres',
  };

  addOptionValue.value = '';
  displayEditModal.value = true;
};

const openEditTags = async (vData) => {
  console.log(vData);
  editData.value = {
    header: `編輯 ${vData.Name} 的風格`,
    option: tagsOption.value,
    values: vData.TagItems.map((t) => t.Name),
    vId: vData.Id,
    key: 'Tags',
  };

  addOptionValue.value = '';
  displayEditModal.value = true;
};

onMounted(() => {
  init();
});
</script>

  <style lang="scss" scoped>
.anime-meta-data {
  height: 100%;

  ::v-deep(.btn) {
    margin-bottom: 10px;
  }

  .remind{
    display: flex;
    justify-content: space-between;
    padding: 10px;
  }

  ::v-deep(.taglines) {
    display: flex;
    // flex-direction: column;
    align-items: flex-end;

    .p-button {
      margin-left: -18px;
      margin-bottom: -10px;
    }
  }

  ::v-deep(.genres),
  ::v-deep(.tag) {
    display: flex;
    height: 100%;
    flex-wrap: wrap;
    .p-tag {
      size: 10px;
      margin-right: 5px;
      margin-top: 5px;
    }
  }
}
</style>
