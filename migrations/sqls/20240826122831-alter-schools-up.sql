/* Replace with your SQL commands */
ALTER TABLE schools
ADD COLUMN owner_id UUID REFERENCES users(id);