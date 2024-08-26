export const tripQuery = {
  create: `
        INSERT INTO trips(id, parent_id, driver_id, school_id, status)
        VALUES($1,$2,$3,$4,$5)
        RETURNING id
    `,

  getOne: `SELECT * FROM trips WHERE id=$1`,

  getTrips: `
    SELECT 
    t.*,
    s.name AS school_name,
    CONCAT(p.first_name, ' ', p.last_name) AS parent_name,
    CONCAT(d.first_name, ' ', d.last_name) AS driver_name
    FROM trips t
    INNER JOIN schools s ON t.school_id = s.id
    INNER JOIN users p ON t.parent_id = p.id
    INNER JOIN users d ON t.driver_id = d.id;
  `,

  getOneTrip: `
        SELECT * FROM trips 
        WHERE id=$1
    `,

  deleteTrip: `
        DELETE FROM trips 
        WHERE id=$1
    `,
};
