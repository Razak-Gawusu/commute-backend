/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS trips(
    id UUID PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id),
    driver_id UUID NOT NULL REFERENCES users(id),
    parent_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
)