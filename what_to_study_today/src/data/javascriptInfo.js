// grandsonNumArr[i] 表示 第i章有（grandsonNumArr[i]）节
const PartArr = [
  {
    id: 1,
    grandsonNumArr: [4, 18, 6, 8, 12, 11, 2, 4, 7, 2, 8, 2, 3, 6],
    title: 'JavaScript语言',
    parentId: 0
  },
  {
    id: 2,
    title: '浏览器：文档、事件、界面',
    grandsonNumArr: [11, 5, 6, 4, 3, 3],
    parentId: 0
  },
  {
    id: 3,
    title: '附加文章',
    grandsonNumArr: [3, 4, 12, 3, 7, 17],
    parentId: 0
  }
]

export {
  PartArr
}