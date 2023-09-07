export const TodoStatusMap = {
  Undo: 0,
  Done: 1,
  Overdue: 2,
  DoneButOverdue: 3,
};

export const TodoStatusLabel = {
  [TodoStatusMap.Undo]: "未完成",
  [TodoStatusMap.Done]: "已完成",
  [TodoStatusMap.Overdue]: "已逾期",
  [TodoStatusMap.DoneButOverdue]: "逾期完成",
};

export const TodoStatusTagConfig = Object.keys(TodoStatusLabel).map((key) => ({
  text: TodoStatusLabel[key],
  value: key,
}));

export const TodoStatusTagType = {
  [TodoStatusMap.Undo]: "info",
  [TodoStatusMap.Done]: "success",
  [TodoStatusMap.Overdue]: "danger",
  [TodoStatusMap.DoneButOverdue]: "warning",
};

export const TodoTypeMap = {
  Undefined: 0,
  Summary: 1,
  StudyByVideo: 2,
  Read: 3,
  Idea: 4,
  StudyByRead: 5,
  Simple: 6,
  Dev: 7,
  Schedule: 8,
  StudyByBlog: 9,
  StudyByOfficial: 10,
  StudyByOtherSite: 11,
  Note: 12,
};

export const TodoTypeLabel = {
  [TodoTypeMap.Undefined]: "未定义",
  [TodoTypeMap.Simple]: "简单待办",
  [TodoTypeMap.Summary]: "写总结",
  [TodoTypeMap.Schedule]: "定计划",
  [TodoTypeMap.StudyByVideo]: "视频学习",
  [TodoTypeMap.StudyByBlog]: "博客学习",
  [TodoTypeMap.StudyByRead]: "书籍学习",
  [TodoTypeMap.StudyByOfficial]: "官网学习",
  [TodoTypeMap.StudyByOtherSite]: "其他权威网站",
  [TodoTypeMap.Dev]: "研发",
  [TodoTypeMap.Read]: "阅读",
  [TodoTypeMap.Idea]: "思考时间",
  [TodoTypeMap.Note]: "记笔记",
};

export const TodoTypeScore = {
  [TodoTypeMap.Simple]: 0.5,
  [TodoTypeMap.Summary]: 2,
  [TodoTypeMap.Schedule]: 1,
  [TodoTypeMap.StudyByVideo]: 5,
  [TodoTypeMap.StudyByBlog]: 2,
  [TodoTypeMap.StudyByRead]: 5,
  [TodoTypeMap.StudyByOfficial]: 5,
  [TodoTypeMap.StudyByOtherSite]: 3,
  [TodoTypeMap.Dev]: 2,
  [TodoTypeMap.Read]: 1,
  [TodoTypeMap.Idea]: 1,
  [TodoTypeMap.Note]: 2,
};

export const PointEventTypeMap = {
  Todo: 1,
  Exchange: 2,
};

export const PointEventTypeLabel = {
  [PointEventTypeMap.Todo]: "完成待办",
  [PointEventTypeMap.Exchange]: "积分兑换",
};

function getCascadeOptionsByFilter(filters) {
  return filters.map((key) => ({
    value: key,
    label: TodoTypeLabel[key],
  }));
}

export const TypeCascadeOptions = [
  {
    value: 100,
    label: "简单分类",
    children: getCascadeOptionsByFilter([
      TodoTypeMap.Undefined,
      TodoTypeMap.Simple,
    ]),
  },
  {
    value: 101,
    label: "学习分类",
    children: getCascadeOptionsByFilter([
      TodoTypeMap.StudyByVideo,
      TodoTypeMap.StudyByRead,
      TodoTypeMap.StudyByOfficial,
      TodoTypeMap.StudyByOtherSite,
      TodoTypeMap.StudyByBlog,
      TodoTypeMap.Dev,
      TodoTypeMap.Note
    ]),
  },
  {
    value: 101,
    label: "其他分类",
    children: getCascadeOptionsByFilter([
      TodoTypeMap.Schedule,
      TodoTypeMap.Summary,
      TodoTypeMap.Read,
      TodoTypeMap.Idea,
    ]),
  },
];
