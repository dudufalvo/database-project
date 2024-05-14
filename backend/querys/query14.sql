CREATE OR REPLACE FUNCTION set_cancelled_default()
RETURNS TRIGGER AS $$
BEGIN
    NEW.cancelled := false;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_cancelled_default_trigger
BEFORE INSERT ON reservation
FOR EACH ROW
EXECUTE FUNCTION set_cancelled_default();