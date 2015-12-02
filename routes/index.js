var express = require('express');
var router = express.Router();
var parseString = require('xml2js').parseString;
var http = require('http');
var from,to;

router.get('/', function(req, response) {

	connection.query("SELECT name, waluty.code, max(rate) as max_rate, min(rate) as min_rate, avg(rate) as avg_rate FROM waluty, kursy WHERE waluty.code = kursy.code GROUP BY code ORDER BY name ASC;", function(err, waluty){
		if(waluty.length == 0){
			var numbers = [];
			getVariablesNBP(function(result){
				for(var i=0;i<result.length;i++){
					if(result[i][0] == "b"){
						var temp = "";
						for(var j=i;j<i+11;j++){
							temp += result[j];
						}
						numbers.push(temp);
						i += 10;
					}
			}

			console.log(numbers.length);
			takeNumbers(0,numbers,response);
	
		});
	}
	else{
		response.render('index.html',{waluty: waluty});
	}
	});
});

router.get('/currency/:currencyCode', function(req,res){

	if(req.query.from == null || req.query.to == null || req.query.to == "" || req.query.to == ""){
		from = '2007-01-31';
		to = new Date().toJSON().slice(0,10);
	}
	else{
		from =req.query.from;
		to = req.query.to;
	}
	connection.query("SELECT name,code FROM waluty where code='" + req.params.currencyCode + "';",function(err,nazwa){
		if(err){
			console.log(err);
			res.redirect("/");
		}
		else{
			connection.query("SELECT publication_date, rate FROM kursy WHERE kursy.code = '" + req.params.currencyCode + "' AND publication_date between '" + from + "' AND '" + to + "' ORDER BY publication_date DESC;", function(err, kursy){
				if(err){
					console.log(err);
					res.redirect("/");
				}
				else{
					console.log(req.query.from);
					res.render("rate.html", {kursy: kursy, nazwa: nazwa, from: from, to: to});
				}
			});
		}
	});
});


function takeNumbers(i, numbers,response){
	if(i < numbers.length){
		getCurrency('/kursy/xml/'+ numbers[i] +'.xml',function(kursy){

			saver(0,kursy.tabela_kursow);
			

		});
		takeNumbers(i+1, numbers,response)
	}
	else{
		console.log("END OF NUMBERS" + "  " + numbers.length);
		// connection.query("SELECT name, waluty.code, max(rate) as max_rate, min(rate) as min_rate, avg(rate) as avg_rate FROM waluty, kursy WHERE waluty.code = kursy.code GROUP BY code ORDER BY name ASC;", function(err, waluty){
		// 	response.render('index.html',{waluty: waluty});
		// });
	}
}


function saver(i, kursy) {
  if( i < kursy.pozycja.length ) {
	insertCurrency(kursy.pozycja[i].kod_waluty,kursy.pozycja[i].nazwa_waluty, function(err,res){
		if (err) console.log("Error when inserting rates;");
	});
	var kurs = kursy.pozycja[i].kurs_sredni.toString();
	kurs = kurs.replace(',', '.');
	console.log(i);
	connection.query("INSERT INTO KURSY VALUES("+connection.escape(kursy.pozycja[i].kod_waluty) + "," + connection.escape(kurs) + "," + connection.escape(kursy.data_publikacji)+ ");", function(err,res){
		if(err) console.log("Błąd przy insercie kursu: " + err);
	});
	saver(i+1,kursy);
  }
}


function insertCurrency(code, name,callback){
	connection.query("INSERT INTO waluty VALUES(" + connection.escape(code) + "," + connection.escape(name) + ");",function(err,res){
		return callback(res);
	});
}


function checkCurrency(code, name){
	connection.query("SELECT code from waluty where code='" + connection.escape(code) + "';", function(err, result){
		if(err){
			console.log(err);
		}
		else{
			if(result == 0){
				insertCurrency(code,name);
			} 
		}
	});
}

function getCurrency(_path,callback) {

    http.get({
        host: 'www.nbp.pl',
        path: _path,
        
    }, function(response) {
        // Continuously update stream with data
        var xml = '';
        response.on('data', function(pozycje) {
            xml += pozycje;
        });
        response.on('end', function() {

            // Data reception is done, do whatever with it!
           	parseString(xml, function (err, result) {
           		if(err) return null;
           		
    			return callback(result);
			});
            
        });

        response.on('error', function(){
        	console.log("Błąd przy pobieraniu xml");
        });
    });

}

function getVariablesNBP(callback){
	http.get({
        host: 'www.nbp.pl',
        path: '/kursy/xml/dir.txt',
        
    }, function(response) {
        // Continuously update stream with data
        var wynik = "";
        response.on('data', function(pozycje) {
            wynik += pozycje;

        });
        response.on('end', function() {
            return callback(wynik);
            
        });

        response.on('error', function(){
        	console.log("Błąd przy pobieraniu xml");
        });
    })
}

module.exports = router;
