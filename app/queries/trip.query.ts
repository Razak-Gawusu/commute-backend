export const tripQuery = {
  create: `
        INSERT INTO trips(id, parent_id, driver_id, school_id, status)
        VALUES($1,$2,$3,$4,$5)
        RETURNING id
    `,

  getOne: `SELECT * FROM trips WHERE id=$1`,

  getTrips: `
    SELECT * FROM trips
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
