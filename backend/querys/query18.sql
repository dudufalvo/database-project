CREATE OR REPLACE FUNCTION create_reservation_audit_after_update()
RETURNS TRIGGER AS $$
BEGIN
  /* verifies which field was changed */
  IF OLD.initial_time != NEW.initial_time and OLD.fields_id != NEW.fields_id THEN
    INSERT INTO reservation_audit (reservation_id, field, old_value, new_value, change_date)
    VALUES (NEW.id, 'initial_time', OLD.initial_time, NEW.initial_time, NOW());
  END IF;
  IF OLD.initial_time = NEW.initial_time and OLD.fields_id != NEW.fields_id THEN
    INSERT INTO reservation_audit (reservation_id, field, old_value, new_value, change_date)
    VALUES (NEW.id, 'fields_id', OLD.fields_id, NEW.fields_id, NOW());
  END IF;
  IF OLD.initial_time != NEW.initial_time and OLD.fields_id = NEW.fields_id THEN
    INSERT INTO reservation_audit (reservation_id, field, old_value, new_value, change_date)
    VALUES (NEW.id, 'initial_time', OLD.initial_time, NEW.initial_time, NOW());
  END IF;
  IF OLD.cancelled != NEW.cancelled THEN
    INSERT INTO reservation_audit (reservation_id, field, old_value, new_value, change_date)
    VALUES (NEW.id, 'cancelled', OLD.cancelled, NEW.cancelled, NOW());
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reservation_audit_after_update
AFTER UPDATE ON reservation
FOR EACH ROW
EXECUTE FUNCTION create_reservation_audit_after_update();