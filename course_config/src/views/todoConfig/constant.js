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
  Summary: 1,
  Study: 2,
  Read: 3,
  Simple: 6,
  Dev: 7,
  Plan: 8
}

export const TodoTypeLabel = {
  [TodoTypeMap.Undefined]: '未定义',
  [TodoTypeMap.Simple]: '简单待办',
  [TodoTypeMap.Summary]: '总结',
  [TodoTypeMap.Plan]: '计划',
  [TodoTypeMap.Study]: '学习',
  [TodoTypeMap.Read]: '阅读',
  [TodoTypeMap.Dev]: '研发'
}

export const TodoTypeScore = {
  [TodoTypeMap.Simple]: 0.5,
  [TodoTypeMap.Summary]: 2,
  [TodoTypeMap.Plan]: 1,
  [TodoTypeMap.Study]: 5,
  [TodoTypeMap.Read]: 1,
  [TodoTypeMap.Dev]: 2
}

export const PointEventTypeMap = {
  Todo: 1,
  Exchange: 2
}

export const PointEventTypeLabel = {
  [PointEventTypeMap.Todo]: '完成待办',
  [PointEventTypeMap.Exchange]: '积分兑换'
}

function getCascadeOptionsByFilter(filters) {
  return filters.map((key) => ({
    value: key,
    label: TodoTypeLabel[key]
  }));
}

export const TypeCascadeOptions = [
  {
    value: 100,
    label: '随便分类',
    children: getCascadeOptionsByFilter([TodoTypeMap.Undefined, TodoTypeMap.Simple])
  },
  {
    value: 101,
    label: '基础分类',
    children: getCascadeOptionsByFilter([TodoTypeMap.Study, TodoTypeMap.Plan, TodoTypeMap.Summary, TodoTypeMap.Dev, TodoTypeMap.Read])
  }
]