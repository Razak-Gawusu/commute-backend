export const schoolQuery = {
  register: `
    INSERT INTO
    schools(id, name, email, phone, password, address_id, certificate_number)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, name
  `,
  getOne: `SELECT * FROM schools WHERE id=$1`,

  getSchools: `
    SELECT id, name, email, phone, address_id, certificate_number
    FROM schools
  `,
  getOneSchool: `
    SELECT * FROM schools
    WHERE id=$1
  `,
  editSchool: `

  `,
  deleteSchool: `
    DELETE FROM schools
    WHERE id=$1
  `,
};
