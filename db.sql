CREATE TABLE perverts(
	id varchar (255),
	hentai_level integer NOT NULL,
	hentai_type varchar (255),
	last_roll_date varchar (255) NOT NULL,
	last_roll_1 integer NOT NULL,
	last_roll_2 integer,
	last_roll_3 integer,
	last_roll_4 integer,
	last_roll_5 integer,
	PRIMARY KEY(id, hentai_type)
);