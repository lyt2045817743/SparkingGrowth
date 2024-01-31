const course = [{
  id: 0,
  name: '现代 JavaScript 教程',
  url: 'https://zh.javascript.info/',
  type: 11,
  partInfoList: [
    {
      id: 1,
      sectionNumPerChapterList: [4, 18, 6, 8, 12, 11, 2, 4, 7, 2, 8, 2, 3, 6]
    },
    {
      id: 2,
      sectionNumPerChapterList: [11, 5, 6, 4, 3, 3]
    },
    {
      id: 3,
      sectionNumPerChapterList: [3, 4, 12, 3, 3, 7, 17]
    }
  ],
  titleMap: { 
    "Part2": "浏览器：文档、事件、界面",
    "Part2.1": "文档",
    "Part2.1.2":"DOM树",
    "Part2.6": "杂项",
    "Part2.6.3":"事件循环",
    "Part3": "附加文章",
    "Part3.3": "网络请求",
    "Part3.3.6": "获取API",
    "Part3.6": "Web components",
    "Part3.6.7": "shadow DOM和事件",
    "Part3.4": "在浏览器中存储数据",
    "Part3.4.3": "IndexedDB",
    "Part1": "JavaScript 语言",
    "Part1.3": "代码质量",
    "Part1.3.5": "使用Mocha进行自动化测试",
    "Part2.3": "用户界面事件",
    "Part2.3.6": "滚动",
    "Part1.11": "承诺、异步/等待",
    "Part1.11.4": "使用Promise处理错误",
    "Part1.7": "对象属性配置",
    "Part1.7.1": "属性标志和描述符",
    "Part3.5": "动画",
    "Part1.5": "数据类型",
    "Part1.5.6": "字符串",
    "Part3.7": "正则表达式",
    "Part3.7.5": "锚点^$的多行模式，修饰符",
    "Part1.13": "模块",
    "Part1.13.1": "模块简介",
    "Part3.6.2": "Custom elements",
    "Part3.5.3": "JavaScript 动画",
    "Part2.4.2": "聚焦：focus/blur",
    "Part2.4": "表单，控件",
    "Part1.1": "简介",
    "Part1.1.2": "手册与规范",
    "Part2.5": "加载文档和其他资源",
    "Part2.5.2": "脚本：async，defer",
    "Part2.6.1": "MutationObserver",
    "Part3.1": "Frame 和 window",
    "Part3.1.2": "跨窗口通信",
    "Part2.4.3": "事件：change，input，cut，copy，paste",
    "Part2.3.5": "键盘：keydown 和 keyup"
  }
}]

const config = [{
  key: 'currentCourseId',
  value: course[0].id
}]

const activity = [
  {
    id: 1,
    score: 5,
    name: '学习',
    level: 1,
    type: 'system',
    resourceType: 'course',
    createTime: Date.now()
  },
  {
    id: 2,
    score: 4,
    name: '阅读',
    level: 1,
    type: 'system',
    resourceType: 'book',
    createTime: Date.now()
  },
  {
    id: 3,
    parentId: 1,
    score: 5,
    name: '视频学习',
    level: 2,
    resourceType: 'course',
    createTime: Date.now(),
  },
  {
    id: 4,
    score: 5,
    parentId: 1,
    name: '书籍学习',
    level: 2,
    resourceType: 'course',
    createTime: Date.now(),
  },
  {
    id: 5,
    score: 4,
    parentId: 2,
    resourceType: 'book',
    name: '传记',
    level: 2,
    createTime: Date.now(),
  },
  {
    id: 6,
    score: 4,
    parentId: 2,
    resourceType: 'book',
    name: '历史',
    level: 2,
    createTime: Date.now(),
  },
  {
    id: 7,
    score: 4,
    parentId: 2,
    resourceType: 'book',
    name: '小说',
    level: 2,
    createTime: Date.now(),
  },
  {
    id: 8,
    score: 2,
    name: '娱乐',
    level: 1,
    createTime: Date.now(),
  },
  {
    id: 9,
    score: 3,
    parentId: 8,
    name: '看电影',
    level: 2,
    createTime: Date.now(),
  },
  {
    id: 10,
    score: 0.5,
    parentId: 8,
    name: '刷短视频',
    level: 2,
    createTime: Date.now(),
  },
  {
    id: 11,
    score: 5,
    parentId: 1,
    name: '在线教程',
    level: 2,
    resourceType: 'course',
    createTime: Date.now(),
  },
]

export {
  course,
  config,
  activity
};