CREATE OR REPLACE FUNCTION update_old_price()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE price
    SET is_active = false
    WHERE price_type = NEW.price_type;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_old_price_trigger
BEFORE INSERT ON price
FOR EACH ROW
EXECUTE FUNCTION update_old_price();