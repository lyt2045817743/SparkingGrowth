export const PointEventTypeMap = {
  Todo: 1,
  Exchange: 2,
  ExtraPoint: 3
};

export const PointEventTypeLabel = {
  [PointEventTypeMap.Todo]: "完成待办",
  [PointEventTypeMap.Exchange]: "积分兑换",
  [PointEventTypeMap.ExtraPoint]: '补偿积分'
};

export const PageTypeMap = {
  Add: 1,
  Edit: 2,
  View: 3
}

export const PageTypeLabel = {
  [PageTypeMap.Add]: '新增',
  [PageTypeMap.Edit]: '编辑',
  [PageTypeMap.View]: '详情',
}