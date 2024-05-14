CREATE OR REPLACE FUNCTION set_price_defaults()
RETURNS TRIGGER AS $$
BEGIN
    NEW.start_time := NOW();
    NEW.is_active := true;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_price_defaults_trigger
BEFORE INSERT ON price
FOR EACH ROW
EXECUTE FUNCTION set_price_defaults();