// grandsonNumArr[i] 表示 第i章有（grandsonNumArr[i]）节
const PartArr = [
  {
    id: 1,
    grandsonNumArr: [4, 18, 6, 8, 12, 11, 2, 4, 7, 2, 8, 2, 3, 6],
    parentId: 0
  },
  {
    id: 2,
    grandsonNumArr: [11, 5, 6, 4, 3, 3],
    parentId: 0
  },
  {
    id: 3,
    grandsonNumArr: [3, 4, 12, 3, 3, 7, 17],
    parentId: 0
  }
]

// 循环PartArr对象，生成与其相似结构的对象数组。遍历到的某一项叫生成项，其生成的项叫被生成项，被生成项的结构要求如下：1. 生成grandsonNumArr长度个对象。2. title暂时为空串。3. id为生成项的id*1000+当前grandsonNumArr下标。4. grandsonNumArr为[grandsonNumArr[当前grandsonNumArr下标]]。5. parentId为生成项的id
function generateSectionArr(partArr) {
  const result = [];
  for (let i = 0; i < partArr.length; i++) {
    const item = partArr[i];
    const grandsonNumArr = item.grandsonNumArr;
    const parentId = item.id;
    for (let j = 0; j < grandsonNumArr.length; j++) {
      const id = parentId * 1000 + j + 1;
      const grandsonItem = {
        id,
        grandsonNumArr: [grandsonNumArr[j]],
        parentId
      };
      result.push(grandsonItem);
    }
  }
  return result;
}

// 写一个函数，要求：1. 传参有一个sectionNumArr二维数组。2. 遍历sectionNumArr，生成一个长度为sectionNumArr同等长度的对象数组，要求每个对象包括id、grandsonNumArr、parentId三个属性。3. id从1开始，每个对象的id为当前最大的对象id + 1。4. grandsonNumArr为数组，值为遍历项。5. parentId为0
function generateCourseArr(sectionNumArr) {
  let objArr = [];
  let maxId = 0;
  for (let i = 0; i < sectionNumArr.length; i++) {
    let obj = {
      id: maxId + 1,
      grandsonNumArr: sectionNumArr[i],
      parentId: 0
    };
    objArr.push(obj);
    maxId++;
  }
  return objArr;
}


export {
  PartArr,
  generateSectionArr,
  generateCourseArr
}