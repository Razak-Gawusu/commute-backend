/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS schools(
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    certificate_number VARCHAR DEFAULT NULL,
    address_id UUID NOT NULL REFERENCES address(id) 
)
