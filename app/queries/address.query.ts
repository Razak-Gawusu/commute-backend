export const addressQuery = {
  createAddress: `
    INSERT INTO address(id, country, state, city, digital_address)
    VALUES($1, $2, $3, $4, $5)
    RETURNING id
  `,
};
