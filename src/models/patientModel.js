const pool = require("./db");

async function createPatient({ fullName, email, phone }) {
  const sql = `
    INSERT INTO patients (full_name, email, phone)
    VALUES (?, ?, ?)
  `;

  const [result] = await pool.execute(sql, [
    fullName,
    email,
    phone || null,
  ]);

  return findPatientById(result.insertId);
}

async function findAllPatients() {
  const sql = `
    SELECT
      id,
      full_name AS fullName,
      email,
      phone,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM patients
    ORDER BY id ASC
  `;

  const [rows] = await pool.execute(sql);
  return rows;
}

async function findPatientById(id) {
  const sql = `
    SELECT
      id,
      full_name AS fullName,
      email,
      phone,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM patients
    WHERE id = ?
  `;

  const [rows] = await pool.execute(sql, [id]);

  return rows[0] || null;
}

async function updatePatient(id, { fullName, email, phone }) {
  const sql = `
    UPDATE patients
    SET full_name = ?, email = ?, phone = ?
    WHERE id = ?
  `;

  const [result] = await pool.execute(sql, [
    fullName,
    email,
    phone || null,
    id,
  ]);

  if (result.affectedRows === 0) {
    return null;
  }

  return findPatientById(id);
}

async function deletePatient(id) {
  const sql = `
    DELETE FROM patients
    WHERE id = ?
  `;

  const [result] = await pool.execute(sql, [id]);

  return result.affectedRows > 0;
}

module.exports = {
  createPatient,
  findAllPatients,
  findPatientById,
  updatePatient,
  deletePatient,
};
