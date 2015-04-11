# kainos_waluty

h1 Skrypty SQL:

Tworzenie tabeli "waluty":
create table waluty(id int auto_increment NOT NULL, code varchar(3) NOT NULL, name varchar(20) NOT NULL, conversion smallint NOT NULL, PRIMARY KEY(code))ENGINE=InnoDB;
