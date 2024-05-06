ALTER TABLE client
ADD CONSTRAINT check_role CHECK (role IN ('regular', 'admin', 'superadmin'));