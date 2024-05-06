CREATE OR REPLACE FUNCTION enforce_regular_role_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role <> 'regular' THEN
        RAISE EXCEPTION 'New clients must be created with the role "regular"';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_role_before_insert
BEFORE INSERT ON client
FOR EACH ROW
EXECUTE FUNCTION enforce_regular_role_on_insert();