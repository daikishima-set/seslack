export default async function query(sql, statements = []) {
    let rows = [];
    let fields = [];
    let connection = null;

    // console.log(sql);

    try {
        const mysql = require('mysql2/promise');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            socketPath: process.env.DB_SOCKET
        });
        [rows, fields] = await connection.query(sql, statements);
    } catch (e) {
        console.log(e);
    } finally {
        connection.end();
    }

    if (rows.length == 0) {
        rows = null;
    }
    return rows;
}
