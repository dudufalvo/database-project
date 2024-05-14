CREATE OR REPLACE FUNCTION prevent_false_available()
RETURNS TRIGGER AS $$
BEGIN
    NEW.available = TRUE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_false_available_trigger
BEFORE INSERT ON fields
FOR EACH ROW
EXECUTE FUNCTION prevent_false_available();