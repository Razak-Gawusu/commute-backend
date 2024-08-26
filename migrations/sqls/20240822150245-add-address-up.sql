/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS address(
    id UUID PRIMARY KEY,
    country VARCHAR DEFAULT NULL,
    state VARCHAR DEFAULT NULL,
    city VARCHAR DEFAULT NULL,
    digital_address VARCHAR DEFAULT NULL
)
