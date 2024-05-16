CREATE OR REPLACE FUNCTION generate_waitlist_automatic_message()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO automatic_notification (notification_client_id, notification_message, notification_is_read)
    VALUES (NEW.client_id, 'You have been added to the waitlist for a field at ' || NEW.interested_time || '. You will be notified if a spot opens up.', false);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_waitlist_automatic_message_trigger
BEFORE INSERT ON waitlist
FOR EACH ROW
EXECUTE FUNCTION generate_waitlist_automatic_message();