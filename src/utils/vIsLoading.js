/** 載入中 */
const vIsLoading = () => ({
  mounted(el) {
    const loadEl = document.createElement('i');
    loadEl.className = 'pi pi-spin pi-spinner v-is-loading';
    loadEl.style = 'display: none;';

    el.appendChild(loadEl);
  },
  updated(el, binding) {
    const loadEl = el.querySelector('.v-is-loading');

    if (binding.value && loadEl) {
      el.setAttribute('disabled', true);
      loadEl.style = 'display: block; margin-left: 5px;';
    }

    if (!binding.value && loadEl) {
      el.removeAttribute('disabled');
      loadEl.style = 'display: none;';
    }
  },
});

export default vIsLoading();
