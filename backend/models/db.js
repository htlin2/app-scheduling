const Pool = require("pg").Pool;

const pool = new Pool({
  client: "pg",
  user: "my_app_dev",
  password: "my_app_dev",
  host: "postgres",
  port: 5432,
  database: "my_app_dev",
});

module.exports = pool;
