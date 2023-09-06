export const TodoStatusMap = {
  Undo: 0,
  Done: 1,
  Overdue: 2,
  DoneButOverdue: 3
}

export const TodoStatusLabel = {
  [TodoStatusMap.Undo]: '未完成',
  [TodoStatusMap.Done]: '已完成',
  [TodoStatusMap.Overdue]: '已逾期',
  [TodoStatusMap.DoneButOverdue]: '逾期完成'
}

export const TodoStatusTagConfig = Object.keys(TodoStatusLabel).map((key) => ({ text: TodoStatusLabel[key], value: key }));

export const TodoStatusTagType = {
  [TodoStatusMap.Undo]: 'info',
  [TodoStatusMap.Done]: 'success',
  [TodoStatusMap.Overdue]: 'danger',
  [TodoStatusMap.DoneButOverdue]: 'warning'
}

export const TodoTypeMap = {
  Undefined: 0,
  PlanAndSummary: 1,
  Study: 2,
  Read: 3,
  CycleByWeek: 4,
  CycleByMonth: 5
}

export const TodoTypeLabel = {
  [TodoTypeMap.Undefined]: '未定义',
  [TodoTypeMap.PlanAndSummary]: '计划与总结',
  [TodoTypeMap.Study]: '学习',
  [TodoTypeMap.Read]: '阅读',
  [TodoTypeMap.CycleByWeek]: '周循环',
  [TodoTypeMap.CycleByMonth]: '月循环'
}

function getCascadeOptionsByFilter(filters) {
  return filters.map((key) => ({
    value: key,
    label: TodoTypeLabel[key]
  }));
}

export const TypeCascadeOptions = [
  {
    value: TodoTypeMap.Undefined,
    label: TodoTypeLabel[TodoTypeMap.Undefined]
  },
  {
    value: 100,
    label: '基础分类',
    children: getCascadeOptionsByFilter([TodoTypeMap.PlanAndSummary, TodoTypeMap.Study, TodoTypeMap.Read])
  },
  {
    value: 101,
    label: '循环分类',
    children: getCascadeOptionsByFilter([TodoTypeMap.CycleByWeek, TodoTypeMap.CycleByMonth])
  }
]