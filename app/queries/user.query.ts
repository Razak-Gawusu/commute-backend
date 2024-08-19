export default {
  getUsers: `SELECT * FROM users`,

  getUser: `SELECT id, username, email, password FROM users WHERE email=$1`,

  createUser: `
    INSERT INTO 
    users(id, username, email, password, role) 
    VALUES($1,$2,$3,$4,$5) 
    RETURNING id,username, email, role`,

  deleteUser: `DELETE FROM users WHERE email=$1`,

  getUserByResetToken: `
      SELECT id 
      FROM users
      WHERE users.password_reset_token=$1 AND users.password_reset_expires_at < $2
    `,

  updatePassword: `
      UPDATE users
      SET password=$2, password_changed_at=$3
      WHERE users.email=$1
      RETURNING users.id, users.username, users.email
    `,

  updateUserPasswordResetToken: `
      UPDATE users
      SET password_reset_token=$2, password_reset_expires_at=$3
      WHERE users.email=$1
    `,
};
