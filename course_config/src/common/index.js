const CourseTypeMap = {
  WebDoc: 1,
  Book: 2,
  Course: 3
}

const CourseTitleMap = {
  [CourseTypeMap.WebDoc]: '在线文档',
  [CourseTypeMap.Book]: '书籍',
  [CourseTypeMap.Course]: '课程'
}

export {
  CourseTypeMap,
  CourseTitleMap
}