# kainos_waluty

## Skrypty SQL:

### Tabele zostały utworzone przy użyciu MySQLWorkBench.

####Tworzenie tabeli "waluty":
create table waluty(id int auto_increment NOT NULL, code varchar(3) NOT NULL, name varchar(20) NOT NULL, conversion smallint NOT NULL, PRIMARY KEY(code))ENGINE=InnoDB;

####Tworzenie tabeli "kursy":
create table kursy(code varchar(3) NOT NULL, currency DECIMAL (5,4), publication_date DATE, FOREIGN KEY(code) REFERENCES waluty(code))ENGINE=InnoDB;
