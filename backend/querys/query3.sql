CREATE UNIQUE INDEX unique_superadmin ON client (role) WHERE role = 'superadmin';

CREATE OR REPLACE FUNCTION prevent_superadmin_downgrade()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role = 'superadmin' AND OLD.role = 'superadmin' THEN
        RAISE EXCEPTION 'Cannot downgrade superadmin role';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_superadmin_before_update
BEFORE UPDATE ON client
FOR EACH ROW
EXECUTE FUNCTION prevent_superadmin_downgrade();