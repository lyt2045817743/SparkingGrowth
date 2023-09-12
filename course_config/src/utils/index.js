export const projectName = 'course_config';

export const getOptionsByLabelMap = (labelMap) => {
  return Object.keys(labelMap).map((key) => ({
    label: labelMap[key],
    value: key
  }))
}