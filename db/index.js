const mysql = require('mysql')


const db = mysql.createPool({
    host: '129.204.252.121',
    user: 'mac_suren5111',
    password: '123456',
    database: 'Test',
})

// 测试数据库连接
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to the database successfully!');
    // 释放连接
    connection.release();
});

module.exports = db

