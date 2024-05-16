CREATE TABLE client (
	id		 BIGSERIAL,
	first_name	 VARCHAR(255),
	last_name	 VARCHAR(255),
	email	 VARCHAR(255),
	password	 VARCHAR(255),
	nif		 BIGINT,
	phone_number BIGINT,
	role VARCHAR(255) CHECK (role IN ('regular', 'admin', 'superadmin')),
	PRIMARY KEY(id)
);

CREATE TABLE fields (
	id	 BIGSERIAL,
	name	 VARCHAR(255),
	available BOOL,
	PRIMARY KEY(id)
);

CREATE TABLE reservation (
	id		 BIGSERIAL,
	initial_time TIMESTAMP,
	end_time	 TIMESTAMP,
	cancelled	 BOOL,
	price_id	 BIGINT NOT NULL,
	fields_id	 BIGINT NOT NULL,
	client_id	 BIGINT NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE waitlist (
	id		 BIGSERIAL,
	interested_time TIMESTAMP,
	silence	 BOOL,
	client_id	 BIGINT NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE manual_notification (
	client_id		 BIGINT NOT NULL,
	notification_id	 BIGSERIAL,
	notification_message	 VARCHAR(255),
	notification_is_read	 BOOL,
	notification_client_id BIGINT NOT NULL,
	PRIMARY KEY(notification_id)
);

CREATE TABLE automatic_notification (
	notification_id	 BIGSERIAL,
	notification_message	 VARCHAR(255),
	notification_is_read	 BOOL,
	notification_client_id BIGINT NOT NULL,
	PRIMARY KEY(notification_id)
);

CREATE TABLE price (
	id		 BIGSERIAL,
	price_value NUMERIC(8,2),
	start_time	 TIMESTAMP,
	price_type	 VARCHAR(255),
	is_active	 BOOL,
	PRIMARY KEY(id)
);

CREATE TABLE client_audit (
	id		 BIGSERIAL,
	field	 VARCHAR(255),
	old_value	 VARCHAR(255),
	change_date TIMESTAMP,
	client_id	 BIGINT NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE waitlist_audit (
	id		 BIGSERIAL,
	field	 VARCHAR(255),
	old_value	 VARCHAR(255),
	change_date TIMESTAMP,
	waitlist_id BIGINT NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE reservation_audit (
	id		 BIGSERIAL,
	field		 VARCHAR(255),
	old_value	 VARCHAR(255),
	new_value	 VARCHAR(255),
	change_date	 TIMESTAMP,
	reservation_id BIGINT NOT NULL,
	PRIMARY KEY(id)
);

ALTER TABLE client ADD UNIQUE (email, nif, phone_number);
ALTER TABLE reservation ADD CONSTRAINT reservation_fk1 FOREIGN KEY (price_id) REFERENCES price(id);
ALTER TABLE reservation ADD CONSTRAINT reservation_fk2 FOREIGN KEY (fields_id) REFERENCES fields(id);
ALTER TABLE reservation ADD CONSTRAINT reservation_fk3 FOREIGN KEY (client_id) REFERENCES client(id);
ALTER TABLE waitlist ADD CONSTRAINT waitlist_fk1 FOREIGN KEY (client_id) REFERENCES client(id);
ALTER TABLE manual_notification ADD CONSTRAINT manual_notification_fk1 FOREIGN KEY (client_id) REFERENCES client(id);
ALTER TABLE manual_notification ADD CONSTRAINT manual_notification_fk2 FOREIGN KEY (notification_client_id) REFERENCES client(id);
ALTER TABLE automatic_notification ADD CONSTRAINT automatic_notification_fk1 FOREIGN KEY (notification_client_id) REFERENCES client(id);
ALTER TABLE client_audit ADD CONSTRAINT client_audit_fk1 FOREIGN KEY (client_id) REFERENCES client(id);
ALTER TABLE waitlist_audit ADD CONSTRAINT waitlist_audit_fk1 FOREIGN KEY (waitlist_id) REFERENCES waitlist(id);
ALTER TABLE reservation_audit ADD CONSTRAINT reservation_audit_fk1 FOREIGN KEY (reservation_id) REFERENCES reservation(id);

