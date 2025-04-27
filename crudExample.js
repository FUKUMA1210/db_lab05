const pool = require('./db');

async function basicCrud() {
  let conn;
  try {
    conn = await pool.getConnection();

    const studentId = 'S10810001';

// 1. INSERT 新增
let sql = 'SELECT Student_ID FROM STUDENT WHERE Student_ID = ?';
let rows = await conn.query(sql, [studentId]);
if (rows.length > 0) {
  console.log('新增失敗：學號已存在');
} else {
  sql = 'INSERT INTO STUDENT (Student_ID, Name, Gender, Email, Department_ID) VALUES (?, ?, ?, ?, ?)';
  await conn.query(sql, ['S10810001', '王曉明', 'M', 'wang@example.com', 'CS001']);
  console.log('已新增一筆學生資料');
}

// 2. SELECT 查詢
const deptId = 'CS001';
sql = 'SELECT * FROM STUDENT WHERE Department_ID = ?';
rows = await conn.query(sql, [deptId]);
if (rows.length === 0) {
  console.log('查無系所CS001的學生資料');
} else {
  console.log('查詢結果：', rows);
}

// 3. UPDATE 更新
const newName = '王小明';
sql = 'SELECT Student_ID FROM STUDENT WHERE Student_ID = ?';
rows = await conn.query(sql, [studentId]);
if (rows.length === 0) {
  console.log('更新失敗：查無學號S10810001');
} else {
  sql = 'UPDATE STUDENT SET Name = ? WHERE Student_ID = ?';
  const result = await conn.query(sql, [newName, studentId]);
  console.log('已更新學生名稱');
}

// 4. DELETE 刪除
sql = 'SELECT Student_ID FROM STUDENT WHERE Student_ID = ?';
rows = await conn.query(sql, [studentId]);
if (rows.length === 0) {
  console.log('刪除失敗：查無學號S10810001');
} else {
  sql = 'DELETE FROM STUDENT WHERE Student_ID = ?';
  await conn.query(sql, [studentId]);
  console.log('已刪除該學生');
}

  } catch (err) {
    console.error('操作失敗：', err);
  } finally {
    if (conn) conn.release();
  }
}

basicCrud();
