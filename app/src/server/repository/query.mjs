import mariadb from "mariadb";
const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "fieryvoid",
  connectionLimit: 5
});

export default async (query, payload = []) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const response = await conn.query(query, payload);
    conn.end();
    return response;
  } catch (err) {
    if (conn) {
      conn.end();
    }
    throw err;
  }
};
