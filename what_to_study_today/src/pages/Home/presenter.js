import { getStudyLogListById } from './server';

class StudyLogManager {
  constructor(titleMap, courseId) {
    this.titleMap = titleMap;
    this.currentCourseId = courseId;
  }

  async getStudyLogMap() {
    let studyLogList = await getStudyLogListById(this.currentCourseId);
    const studyLogMap = {};
    studyLogList.forEach((item) => {
      const { date, titleKey } = item;
      const allTitle = this.getAllTitle(titleKey);
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