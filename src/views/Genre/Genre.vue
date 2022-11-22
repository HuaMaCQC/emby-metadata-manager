<template>
  <div class="index"></div>
</template>

<script setup>
import useAjax from '@/utils/useAjax';
import { onMounted } from 'vue';

const { post } = useAjax();

const getTag = async () => {
  // eslint-disable-next-line no-unused-vars
  const res = await post();
};

onMounted(() => {
  getTag();
});
</script>

<style lang="scss" scoped>
.index {
  height: 100%;
}
</style>
