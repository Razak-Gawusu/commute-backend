export default {
  getUsers: `SELECT * FROM users`,

  getUser: `SELECT * FROM users WHERE email=$1`,

  createUser: `
    INSERT INTO 
    users(id, first_name, last_name, email, password, role) 
    VALUES($1,$2,$3,$4,$5,$6) 
    RETURNING id, first_name, last_name, email, role`,

  deleteUser: `DELETE FROM users WHERE email=$1`,

  getUserByResetCode: `
      SELECT *
      FROM users
      WHERE users.reset_password_code=$1 AND users.password_reset_expires_at > $2
    `,

  getUserByEmailAndResetCode: `
      SELECT *
      FROM users
      WHERE users.email=$1 AND users.reset_password_code=$2
    `,

  updatePassword: `
      UPDATE users
      SET password=$2, password_changed_at=$3, reset_password_code=null
      WHERE users.email=$1
      RETURNING users.id, users.email
    `,

  updateUserPasswordResetCode: `
      UPDATE users
      SET reset_password_code=$2, password_reset_expires_at=$3
      WHERE users.email=$1
    `,
};
