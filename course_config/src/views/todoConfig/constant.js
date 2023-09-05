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
  Undefined: 0
}

export const TodoTypeLabel = {
  [TodoTypeMap.Undefined]: '未定义'
}
