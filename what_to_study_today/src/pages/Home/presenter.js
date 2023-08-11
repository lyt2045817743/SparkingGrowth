import { getStudyLogList } from './server';

class StudyLogManager {
  constructor(titleMap) {
    this.titleMap = titleMap;
  }

  async getStudyLogMap() {
    const studyLogList = await getStudyLogList();
    const studyLogMap = {};
    studyLogList.forEach((item) => {
      const { date, title } = item;
      const allTitle = this.getAllTitle(title);
      if (studyLogMap[date]) {
        studyLogMap[date].push(allTitle);
      } else {
        studyLogMap[date] = [allTitle];
      }
    })
    return Promise.resolve(studyLogMap);
  }
  
  getAllTitle(thirdTitleKey) {
    const titleKeyArr = thirdTitleKey.split('.');
    const firstTitleKey = titleKeyArr[0];
    const secondTitleKey = titleKeyArr.slice(0, 2).join('.');
    const [firstTitle, secondTitle, thirdTitle] = [this.titleMap[firstTitleKey], this.titleMap[secondTitleKey], this.titleMap[thirdTitleKey]];
    if([firstTitle, secondTitle, thirdTitle] .includes(undefined)) return '';
    return `${thirdTitleKey}：【${firstTitle}】.【${secondTitle}】.【${thirdTitle}】`
  }
}

export {
  StudyLogManager
}