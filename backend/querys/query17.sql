CREATE OR REPLACE FUNCTION create_automatic_notification_to_client_reservation_made()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO automatic_notification (notification_client_id, notification_message, notification_is_read)
  VALUES (NEW.client_id, 'You have made a reservation for a field at ' || NEW.initial_time || '. The field name is ' || (SELECT fields.name FROM fields WHERE fields.id = NEW.fields_id) || '.', false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_automatic_notification_to_client_reservation_made_trigger
AFTER INSERT ON reservation
FOR EACH ROW
EXECUTE FUNCTION create_automatic_notification_to_client_reservation_made();