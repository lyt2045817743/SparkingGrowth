import { getOptionsByLabelMap } from '../../utils'

export const BooksTypeOptions = [
  {
    label: '杂志',
    value: 1
  }
]

export const BooksStatusMap = {
  Want: 1,
  Reading: 2,
  Done: 3,
  Abandon: 4
}

export const BooksStatusLabel = {
  [BooksStatusMap.Want]: '想读',
  [BooksStatusMap.Reading]: '阅读中',
  [BooksStatusMap.Done]: '已读完',
  [BooksStatusMap.Abandon]: '已弃读'
}

export const BooksStatusOptions = getOptionsByLabelMap(BooksStatusLabel);