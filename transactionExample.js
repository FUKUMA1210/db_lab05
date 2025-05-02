// transactionExample.js
const pool = require('./db'); 

async function doTransaction(studentId, newDept) {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction(); // 開始交易

    // 1. 檢查學號是否存在
    const checkRows = await conn.query(
      'SELECT Student_ID FROM STUDENT WHERE Student_ID = ?',
      [studentId]
    );
    if (checkRows.length === 0) {
      throw new Error(`無此學號：${studentId}`);
    }

    // 2. 更新 STUDENT 表的 Department_ID
    await conn.query(
      'UPDATE STUDENT SET Department_ID = ? WHERE Student_ID = ?',
      [newDept, studentId]
    );

    // 3. 更新 ENROLLMENT 表的 Status
    await conn.query(
      'UPDATE ENROLLMENT SET Status = ? WHERE Student_ID = ?',
      ['轉系', studentId]
    );

    // 4. 查詢修改後的系所
    const deptRows = await conn.query(
      'SELECT Department_ID FROM STUDENT WHERE Student_ID = ?',
      [studentId]
    );

     // 如果以上操作都成功，則提交交易
    await conn.commit();
    console.log('交易成功，已提交');
    console.log(
      `學生 ${studentId} 目前所在系所：${deptRows[0].Department_ID}`
    );
  } catch (err) {
    // 若有任何錯誤，回滾所有操作
    if (conn) await conn.rollback();
    console.error('交易失敗，已回滾：', err);
  } finally {
    if (conn) conn.release();
  }
}

doTransaction('S10810005', 'EE001');
