/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS students(
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    parent_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
)