export const DateType = {
  Workday: 1,
  Weekday: 2
}

export const ExtraPointLevel = {
  NoLevel: 0,
  First: 1,
  Second: 2,
  Third: 3
}

export const ExtraPointLevelLabel = {
  [ExtraPointLevel.First]: '第一档',
  [ExtraPointLevel.Second]: '第二档',
  [ExtraPointLevel.Third]: '第三档'
}

export const ExtraPointLevelScore = {
  [ExtraPointLevel.First]: 3,
  [ExtraPointLevel.Second]: 6,
  [ExtraPointLevel.Third]: 10
}

export const DateTypePointStandard = {
  [DateType.Workday]: {
    [ExtraPointLevel.First]: 6,
    [ExtraPointLevel.Second]: 10,
    [ExtraPointLevel.Third]: 15
  },
  [DateType.Weekday]: {
    [ExtraPointLevel.First]: 12,
    [ExtraPointLevel.Second]: 16,
    [ExtraPointLevel.Third]: 20
  }
}

function getTableData() {
  const workdayScoreMap = DateTypePointStandard[DateType.Workday];
  const weekdayScoreMap = DateTypePointStandard[DateType.Weekday];
  return Object.keys(ExtraPointLevelLabel).map((level) => {
    return {
      level: +level,
      levelName: ExtraPointLevelLabel[level],
      workdayScore: workdayScoreMap[level],
      weekdayScore: weekdayScoreMap[level],
      pointStandard: ExtraPointLevelScore[level]
    }
  })
}

export const ExtraPointTableData = getTableData();