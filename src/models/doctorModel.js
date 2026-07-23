const pool = require("./db");

async function createDoctor({
  fullName,
  specialty,
  consultationFee,
  roomNumber,
}) {
  const sql = `
    INSERT INTO doctors (
      full_name,
      specialty,
      consultation_fee,
      room_number
    )
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await pool.execute(sql, [
    fullName,
    specialty,
    consultationFee,
    roomNumber || null,
  ]);

  return findDoctorById(result.insertId);
}

async function findAllDoctors() {
  const sql = `
    SELECT
      id,
      full_name AS fullName,
      specialty,
      consultation_fee AS consultationFee,
      room_number AS roomNumber,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM doctors
    ORDER BY id ASC
  `;

  const [rows] = await pool.execute(sql);
  return rows;
}

async function findDoctorById(id) {
  const sql = `
    SELECT
      id,
      full_name AS fullName,
      specialty,
      consultation_fee AS consultationFee,
      room_number AS roomNumber,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM doctors
    WHERE id = ?
  `;

  const [rows] = await pool.execute(sql, [id]);
  return rows[0] || null;
}

async function updateDoctor(
  id,
  {
    fullName,
    specialty,
    consultationFee,
    roomNumber,
  }
) {
  const sql = `
    UPDATE doctors
    SET
      full_name = ?,
      specialty = ?,
      consultation_fee = ?,
      room_number = ?
    WHERE id = ?
  `;

  const [result] = await pool.execute(sql, [
    fullName,
    specialty,
    consultationFee,
    roomNumber || null,
    id,
  ]);

  if (result.affectedRows === 0) {
    return null;
  }

  return findDoctorById(id);
}

async function deleteDoctor(id) {
  const sql = `
    DELETE FROM doctors
    WHERE id = ?
  `;

  const [result] = await pool.execute(sql, [id]);
  return result.affectedRows > 0;
}

module.exports = {
  createDoctor,
  findAllDoctors,
  findDoctorById,
  updateDoctor,
  deleteDoctor,
};
