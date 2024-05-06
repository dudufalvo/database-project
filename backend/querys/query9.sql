CREATE OR REPLACE FUNCTION change_role_to_regular(user_id INT)
RETURNS VOID AS $$
DECLARE
    z_current_role VARCHAR(255);
BEGIN
    SELECT role INTO z_current_role FROM client WHERE id = user_id;
    IF z_current_role = 'admin' THEN
        UPDATE client SET role = 'regular' WHERE id = user_id;
    ELSE
        RAISE EXCEPTION 'User is not a admin user';
    END IF;
END;
$$ LANGUAGE plpgsql;