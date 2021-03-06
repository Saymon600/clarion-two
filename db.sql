CREATE TABLE perverts(
	id varchar (255),
	name varchar (255),
	hentai_level integer NOT NULL,
	hentai_level_total integer NOT NULL,
	hentai_type varchar (255),
	last_roll_date varchar (255) NOT NULL,
	last_roll_1 integer NOT NULL,
	last_roll_2 integer,
	last_roll_3 integer,
	last_roll_4 integer,
	last_roll_5 integer,
	PRIMARY KEY(id, hentai_type)
);

CREATE TABLE bot(
	id SERIAL,
	nickname varchar (255),
	status varchar (255),
	last_playing varchar (255),
	PRIMARY KEY(id)
);

CREATE TABLE whales(
	id varchar(255),
	last_roll_date varchar (255) NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE fgo_servants(
	id int PRIMARY KEY,
	rarity int,
	name varchar(255),
	class varchar(255),
	original varchar(255),
	imageName varchar(255),
	hp int,
	atk int
);

CREATE TABLE gacha_addicts(
	id varchar (255),
	name varchar (255),
	gems int NOT NULL,
	maximum_slot_number int NOT NULL,
	last_roll_date varchar (255) NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE fgo_slots(
	id_addict varchar (255),
	id_servant int,
	slot_number int NOT NULL,
	FOREIGN KEY (id_addict) REFERENCES gacha_addicts (id),
	FOREIGN KEY (id_servant) REFERENCES fgo_servants (id)
);
