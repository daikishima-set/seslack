export default function QueryAsync(sql,statements = [], callback){
    let rows = [];
    let fields = [];
    let connection = null;
    try{
        const mysql = require('mysql2');
        connection = mysql.createConnection({
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });
      
        connection.query(sql, statements, (error, result, fields) => {
            console.log(result);
        });
    }catch(e){
        console.log(e);
    }finally{
        connection.end();
    }
    return rows;
  }
