<template>
  <div class="index">
    {{ tags }}
  </div>
</template>

<script setup>
import useAjax from '@/utils/useAjax';
import { onMounted, computed } from 'vue';
import { useStore } from 'vuex';

const { get } = useAjax();
const store = useStore();
const tags = computed(() => store.state.tags);

const getTags = async () => {
  const res = await get('/emby/Tags', {
    IncludeItemTypes: 'Series',
    Recursive: 'true',
  });

  if (res && Array.isArray(res.Items)) {
    store.commit('setTags', res.Items);
  }
};

onMounted(() => {
  getTags();
});
</script>

<style lang="scss" scoped>
.index {
  height: 100%;
}
</style>
