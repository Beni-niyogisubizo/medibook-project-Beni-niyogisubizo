const crypto = require("crypto");
const pool = require("./db");

function generateReference() {
  return `MED-${crypto.randomUUID().split("-")[0].toUpperCase()}`;
}

async function findAppointmentById(id, connection = pool) {
  const sql = `
    SELECT
      a.id,
      a.appointment_reference AS appointmentReference,
      a.patient_id AS patientId,
      p.full_name AS patientName,
      a.doctor_id AS doctorId,
      d.full_name AS doctorName,
      a.appointment_datetime AS appointmentDatetime,
      a.amount_paid AS amountPaid,
      a.refund_amount AS refundAmount,
      a.status,
      a.booked_at AS bookedAt,
      a.cancelled_at AS cancelledAt
    FROM appointments a
    INNER JOIN patients p ON p.id = a.patient_id
    INNER JOIN doctors d ON d.id = a.doctor_id
    WHERE a.id = ?
  `;

  const [rows] = await connection.execute(sql, [id]);
  return rows[0] || null;
}

async function findAllAppointments() {
  const sql = `
    SELECT
      a.id,
      a.appointment_reference AS appointmentReference,
      a.patient_id AS patientId,
      p.full_name AS patientName,
      a.doctor_id AS doctorId,
      d.full_name AS doctorName,
      a.appointment_datetime AS appointmentDatetime,
      a.amount_paid AS amountPaid,
      a.refund_amount AS refundAmount,
      a.status,
      a.booked_at AS bookedAt,
      a.cancelled_at AS cancelledAt
    FROM appointments a
    INNER JOIN patients p ON p.id = a.patient_id
    INNER JOIN doctors d ON d.id = a.doctor_id
    ORDER BY a.appointment_datetime ASC
  `;

  const [rows] = await pool.execute(sql);
  return rows;
}

async function createAppointment({
  patientId,
  doctorId,
  appointmentDatetime,
  amountPaid,
}) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [patients] = await connection.execute(
      "SELECT id FROM patients WHERE id = ? FOR UPDATE",
      [patientId]
    );

    if (patients.length === 0) {
      const error = new Error("Patient not found");
      error.statusCode = 404;
      throw error;
    }

    const [doctors] = await connection.execute(
      "SELECT id FROM doctors WHERE id = ? FOR UPDATE",
      [doctorId]
    );

    if (doctors.length === 0) {
      const error = new Error("Doctor not found");
      error.statusCode = 404;
      throw error;
    }

    const [dailyAppointments] = await connection.execute(
      `
        SELECT COUNT(*) AS appointmentCount
        FROM appointments
        WHERE doctor_id = ?
          AND DATE(appointment_datetime) = DATE(?)
          AND status = 'booked'
        FOR UPDATE
      `,
      [doctorId, appointmentDatetime]
    );

    if (dailyAppointments[0].appointmentCount >= 12) {
      const error = new Error(
        "Doctor has reached the daily limit of 12 appointments"
      );
      error.statusCode = 409;
      throw error;
    }

    const appointmentReference = generateReference();

    const [result] = await connection.execute(
      `
        INSERT INTO appointments (
          appointment_reference,
          patient_id,
          doctor_id,
          appointment_datetime,
          amount_paid
        )
        VALUES (?, ?, ?, ?, ?)
      `,
      [
        appointmentReference,
        patientId,
        doctorId,
        appointmentDatetime,
        amountPaid,
      ]
    );

    const appointment = await findAppointmentById(
      result.insertId,
      connection
    );

    await connection.commit();

    return appointment;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  createAppointment,
  findAllAppointments,
  findAppointmentById,
};
