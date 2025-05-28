const pool = require('../config/db');

const callProcedure = async (procedure, params = []) => {
  const placeholders = params.map(() => '?').join(',');
  const [rows] = await pool.query(`CALL ${procedure}(${placeholders})`, params);
  return rows;
};

module.exports = { callProcedure };
