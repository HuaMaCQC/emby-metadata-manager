<template>
  <div class="anime-meta-data">
    <div class="tool">
      <Button v-is-Loading="loading" class="p-button-raised btn p-button-plain" @click="init">重新整理</Button>

      <div class="show-all">
        <h5>顯示全部標籤</h5>
        <InputSwitch v-model="showAll" />
      </div>

      <div class="remind">
        <p>動漫數: {{ total }}</p>
      </div>
    </div>

    <DataTable :value="data" responsiveLayout="scroll" :resizableColumns="true" :autoLayout="true" :scrollable="false">
      <Column field="Name" header="動漫名稱"></Column>

      <Column header="風格">
        <template #body="slotProps">
          <div class="data-setting">
            <div v-if="!showAll" class="genres-sm">
              <div v-for="item in slotProps.data.GenreItems" :key="item.Id">
                <Tag severity="info" :rounded="true" :value="item.Name" />
              </div>
            </div>

            <div v-if="showAll" class="genres">
              <div v-for="option of genresOption" :key="option" class="field-checkbox" :style="{ marginLeft: '10px', paddingTop: '3px' }">
                <Checkbox :value="option" v-model="slotProps.data.Genres" @click="() => clickCheckbox(slotProps)" />
                <label :style="{ marginLeft: '7px' }">{{ option }}</label>
              </div>
            </div>
            <Button icon="pi pi-plus" class="p-button-sm p-button-rounded" @click="() => openEditGenres(slotProps.data)" />
          </div>
        </template>
      </Column>

      <Column header="標籤">
        <template #body="slotProps">
          <div class="data-setting">
            <div v-if="!showAll" class="tag-sm">
              <div v-for="item in slotProps.data.TagItems" :key="item.Id">
                <Tag severity="info" :rounded="true" :value="item.Name" />
              </div>
            </div>

            <div v-if="showAll" class="tag">
              <div v-for="option of tagsOption" :key="option" class="field-checkbox" :style="{ marginLeft: '10px', paddingTop: '3px' }">
                <Checkbox :value="option" v-model="slotProps.data.Tags" @click="() => clickCheckbox(slotProps)" />
                <label :style="{ marginLeft: '7px' }">{{ option }}</label>
              </div>
            </div>

            <Button icon="pi pi-plus" class="p-button-sm p-button-rounded" @click="() => openEditTags(slotProps.data)" />
          </div>
        </template>
      </Column>

      <Column header="操作">
        <template #body="slotProps">
          <Button
            icon="pi"
            class="p-button-rounded p-button-success"
            :disabled="slotProps.data.saveBtnDisabled"
            @click="() => save(slotProps.data, slotProps.index)"
          >
            保存
          </Button>
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
        <InputText placeholder="增加" v-model="addOptionValue" />
        <Button icon="pi pi-check" class="p-button-success" @click="addOption" />
      </div>

      <div v-for="option of editData.option" :key="option" class="field-checkbox" :style="{ marginLeft: '10px', paddingTop: '3px' }">
        <Checkbox :value="option" v-model="editData.values" />
        <label :style="{ marginLeft: '7px' }">{{ option }}</label>
      </div>

      <template #footer>
        <Button label="取消" icon="pi pi-times" @click="closeModal" class="p-button-text" />
        <Button label="儲存" icon="pi pi-check" @click="() => saveModal(editData.vId)" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import useAjax from '@/utils/useAjax';
import { onMounted, ref, watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import Tag from 'primevue/tag';
import vIsLoading from '@/utils/vIsLoading';
import Dialog from 'primevue/dialog';
import Checkbox from 'primevue/checkbox';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import { useStore } from 'vuex';

const { get, post, getSeriesItem } = useAjax();
const store = useStore();
const showAll = ref(!!store.state.setting?.genreTagMetadataShowAll);
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
const displayEditModal = ref(false);
const genresOption = ref([]);
const tagsOption = ref([]);

const getSeries = async () => {
  loading.value = true;

  const ItemsRes = await get('/emby/Items', {
    IncludeItemTypes: 'Series',
    Recursive: 'true',
    Fields: 'Genres,Tags',
  });

  if (!ItemsRes || !ItemsRes.Items) {
    toast.add({
      severity: 'error',
      detail: '載入錯誤 如果發生太多次請通知花媽謝謝!',
      life: 3000,
    });

    return;
  }

  data.value = ItemsRes.Items.map((v) => ({ ...v, Tags: v.TagItems.map((t) => t.Name), saveBtnDisabled: true }));
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

const clickCheckbox = (d) => {
  data.value[d.index].saveBtnDisabled = false;
};

const addOption = () => {
  if (!addOptionValue.value) {
    return;
  }

  if (editData.value.option.indexOf(addOptionValue.value) !== -1) {
    toast.add({
      severity: 'error',
      detail: '項目重複',
      life: 3000,
    });

    editData.value.values = [...editData.value.values, addOptionValue.value];
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

const saveModal = async (id) => {
  const d = await getSeriesItem(id);

  const newData = { ...d, [editData.value.key]: editData.value.values };

  await post(`/emby/Items/${id}`, newData, {
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

const save = async (vData, index) => {
  const d = await getSeriesItem(vData.Id);
  const newData = { ...d, Tags: vData.Tags, Genres: vData.Genres };

  await post(`/emby/Items/${vData.Id}`, newData, {
    reqformat: 'json',
  }).then(() => {
    data.value[index].saveBtnDisabled = true;

    toast.add({
      severity: 'success',
      detail: '儲存成功`',
      life: 3000,
    });
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
  editData.value = {
    header: `編輯 ${vData.Name} 的標籤`,
    option: tagsOption.value,
    values: vData.TagItems.map((t) => t.Name),
    vId: vData.Id,
    key: 'Tags',
  };

  addOptionValue.value = '';
  displayEditModal.value = true;
};

watch(showAll, () => {
  store.dispatch('changeSetting', {
    genreTagMetadataShowAll: showAll.value,
  });
});

onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped>
.anime-meta-data {
  height: 100%;

  .tool {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .show-all {
      display: flex;
      justify-content: space-between;
      align-items: center;

      ::v-deep(.p-inputswitch) {
        margin-left: 5px;
      }
    }
    .remind {
      display: flex;
      justify-content: space-between;
      padding: 10px;
    }
  }

  .data-setting{
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    ::v-deep(.p-button){
      margin-left: 10px;
    }
  }

  .genres-sm,
  .tag-sm {
    display: flex;
    height: 100%;
    flex-wrap: wrap;
    .p-tag {
      size: 10px;
      margin-right: 5px;
      margin-top: 5px;
    }
  }

  ::v-deep(.genres),
  ::v-deep(.tag) {
    display: flex;
    height: 100%;
    flex-wrap: wrap;
  }
}
</style>
