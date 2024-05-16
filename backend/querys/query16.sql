CREATE OR REPLACE FUNCTION create_automatic_notification_to_client_registered_in_waitlist()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.cancelled = true and OLD.cancelled = false THEN
    /* get users that were waitlisted for the same time of that reservation and send them a message */
    INSERT INTO automatic_notification (notification_client_id, notification_message, notification_is_read)
    SELECT client_id, 'A spot has opened up for a field at ' || NEW.initial_time || '. The field name is ' || (SELECT fields.name FROM fields WHERE fields.id = NEW.fields_id) || '. You have been removed from the waitlist.', false
    FROM waitlist
    WHERE interested_time = NEW.initial_time and silence = false;

    /* set that waitlist row as silence=true */
    UPDATE waitlist
    SET silence = true
    WHERE interested_time = NEW.initial_time;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_automatic_notification_to_client_registered_in_waitlist_trigger
AFTER UPDATE ON reservation
FOR EACH ROW
EXECUTE FUNCTION create_automatic_notification_to_client_registered_in_waitlist();