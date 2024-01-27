import { db } from '../../utils/globalState';

export const BookStoreName = 'book';

async function getBookList() {
  const list = await db.getAll(BookStoreName);
  return Promise.resolve(list);
}

async function addBook(bookInfo) {
  const book = JSON.parse(JSON.stringify(bookInfo));
  const bookId = await db.add(BookStoreName, book);
  return Promise.resolve(bookId);
}

async function getBookById(key) {
  const book = db.get(BookStoreName, key);
  return Promise.resolve(book);
}

async function updateBook(id, info) {
  const book = await db.get(BookStoreName, id);
  Object.keys(info).forEach((key) => {
    book[key] = info[key];
  })
  await db.put(BookStoreName, book);
}

export {
  getBookList,
  addBook,
  getBookById,
  updateBook
}