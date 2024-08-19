/* Replace with your SQL commands */
/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS users(
    id UUID PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR UNIQUE,
    password VARCHAR NOT NULL,
    role VARCHAR NOT NULL,
    reset_password_code VARCHAR DEFAULT NULL,
    password_changed_at VARCHAR DEFAULT NULL,
    password_reset_expires_at BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
)