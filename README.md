# kainos_waluty

## Skrypty SQL:

### Tabele zostały utworzone przy użyciu MySQLWorkbench.

####Tworzenie tabeli "waluty":

	create table waluty(id int auto_increment NOT NULL, code varchar(3) NOT NULL, name varchar(20) NOT NULL,PRIMARY KEY(code))ENGINE=InnoDB;

####Tworzenie tabeli "kursy":

	create table kursy(code varchar(3) NOT NULL, rate DECIMAL (5,4), publication_date DATE, FOREIGN KEY(code) REFERENCES waluty(code))ENGINE=InnoDB;

####Kodowanie:

	set NAMES 'utf8';

####Umieszczanie danych dotyczących walut:
	insert into waluty values ('THB', 'bat (Tajlandia)');
	insert into waluty values ('CAD', 'dolar kanadyjski');
	insert into waluty values ('NZD', 'dolar nowozelandzki');
	insert into waluty values ('SGD', 'dolar singapurski');
	insert into waluty values ('EUR', 'euro');
	insert into waluty values ('HUF', 'forint (Węgry)');
	insert into waluty values ('GBP', 'funt szterling');
	insert into waluty values ('UAH', 'hrywna (Ukraina)');
	insert into waluty values ('JPY', 'jen (Japonia)');
	insert into waluty values ('LVL', 'łat łotewski');
	insert into waluty values ('LTL', 'lit litewski');
	insert into waluty values ('CZK', 'korona czeska');
	insert into waluty values ('DKK', 'korona duńska');
	insert into waluty values ('ISK', 'korona islandzka');
	insert into waluty values ('NOK', 'korona norweska');
	insert into waluty values ('SEK', 'korona szwedzka');
	insert into waluty values ('HRK', 'kuna (Chorwacja)');
	insert into waluty values ('RON', 'lej rumuński');
	insert into waluty values ('BGN', 'lew (Bułgaria)');
	insert into waluty values ('MTL', 'lira maltańska');
	insert into waluty values ('TRY', 'lira turecka');
	insert into waluty values ('ILS', 'nowy izraelski szekel');
	insert into waluty values ('CLP', 'peso chilijskie');
	insert into waluty values ('PHP', 'peso filipińskie');
	insert into waluty values ('MXN', 'peso meksykańskie');
	insert into waluty values ('ZAR', 'rand (Republika Południowej Afryki');
	insert into waluty values ('BRL', 'real (Brazylia)');
	insert into waluty values ('MYR', 'ringgit (Malezja)');
	insert into waluty values ('RUB', 'rubel rosyjski');
	insert into waluty values ('IDR', 'rupia indonezyjska');
	insert into waluty values ('INR', 'rupia indyjska');
	insert into waluty values ('KRW', 'won południowokoreański');
	insert into waluty values ('CNY', 'yuan renminbi (Chiny)');
	insert into waluty values ('XDR', 'SDR (MFW)');
