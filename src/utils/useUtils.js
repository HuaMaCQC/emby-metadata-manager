const useUtils = () => {
  /**
   * 將null值得key刪除
   *
   * @param {Object} data 原始資料
   * @param {Array} filterValue 要刪除的值 預設null and undefined
   */
  const filterObj = (data, filterValue = []) => {
    if (typeof data !== 'object') {
      return data;
    }

    const fv = [...filterValue, null, undefined];
    const d = Object.entries(data).reduce((acc, [key, value]) => {
      if (!fv.some((v) => value === v)) {
        acc[key] = value;
      }

      return acc;
    }, {});

    return d;
  };

  const getUuid = () => {
    let d = Date.now();

    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); // use high-precision timer if available
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // eslint-disable-next-line no-bitwise
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      // eslint-disable-next-line no-bitwise, no-mixed-operators
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  };

  return { filterObj, getUuid };
};

export default useUtils;
