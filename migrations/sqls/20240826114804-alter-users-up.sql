/* Replace with your SQL commands */
ALTER TABLE users
ADD COLUMN school_id UUID REFERENCES schools(id);