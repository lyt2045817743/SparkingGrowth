export const projectName = 'course_config';

export const getOptionsByLabelMap = (labelMap) => {
  return Object.keys(labelMap).map((key) => ({
    label: labelMap[key],
    value: key
  }))
}

export const getMapByOptions = (options) => {
  const map = {};
  options.forEach((item) => map[item.value] = item.label);
  return map;
}