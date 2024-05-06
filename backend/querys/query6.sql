CREATE OR REPLACE FUNCTION change_role_to_admin(user_id INT)
RETURNS VOID AS $$
DECLARE
    v_current_role VARCHAR(255);
BEGIN
    SELECT role INTO v_current_role FROM client WHERE id = user_id;
    IF v_current_role = 'regular' THEN
        UPDATE client SET role = 'admin' WHERE id = user_id;
    ELSE
        RAISE EXCEPTION 'User is not a regular user';
    END IF;
END;
$$ LANGUAGE plpgsql;