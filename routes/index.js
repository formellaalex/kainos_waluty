var express = require('express');
var router = express.Router();
var wynik;
var parseString = require('xml2js').parseString;
var http = require('http');
var from,to;
function minTwoDigits(n) {
  return (n < 10 ? '0' : '') + n;
}

router.get('/', function(req, res) {
	connection.query("SELECT name, waluty.code, max(rate) as max_rate, min(rate) as min_rate, avg(rate) as avg_rate FROM waluty, kursy WHERE waluty.code = kursy.code GROUP BY code ORDER BY name ASC;", function(err, waluty){
		if(waluty.length == 0){
			var nr = 22;
			var path;
			var numbers = [];
			var cnt = 0;
			getVariablesNBP(function(result){
				while(result.substring(cnt*13, cnt*13+13)[7] != 7){
					cnt++;
				}
				for(var i=0;i<=7;i++){
					for(var j=1;j<=12;j++){
						while(result.substring(cnt*13, cnt*13+13).substring(8,10) != minTwoDigits(j)){
							cnt++;
						}
						if(result.substring((cnt-1)*13, (cnt-1)*13+13).substring(1,2) == "b"){
							numbers.push(result.substring((cnt-2)*13, (cnt-2)*13+13));
						}
						else{
							numbers.push(result.substring((cnt-1)*13, (cnt-1)*13+13));
						}
						cnt++;
					}
				}
				while(result.substring(cnt*13, cnt*13+13).substring(8,10) != '01'){
					cnt++;
				}
				numbers.push(result.substring((cnt-2)*13, (cnt-2)*13+13));
				for(var i=1;i<numbers.length-1;i++){
					getCurrency('/kursy/xml/a'+ numbers[i].substring(2,12) +'.xml',function(result){
						
						var insert = 'INSERT INTO kursy VALUES';
						for(var j=0;j<result.tabela_kursow.pozycja.length;j++){
							var kurs = result.tabela_kursow.pozycja[j].kurs_sredni.toString();
							kurs = kurs.replace(',', '.');
							insert += "('" + result.tabela_kursow.pozycja[j].kod_waluty + "'," + kurs + ",'" + result.tabela_kursow.data_publikacji + "'),";
							if(result.tabela_kursow.pozycja[j].kod_waluty == "LVL"){
								console.log(result.tabela_kursow.pozycja[j].kod_waluty);

							}
						}
						connection.query( insert.substring(0,insert.length-1), function(err,result){
							if(err) console.log(err);
						});
						
					});
				}
				
			});
		res.redirect("/");
		}
		else{
			if(err) console.log(err);
			res.render('index.html',{waluty:waluty});
		}
		
	});
});

router.get('/currency/:currencyCode', function(req,res){

	if(req.query.from == null || req.query.to == null){
		from = '2007-01-31';
		to = '2014-12-31';
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
			connection.query("SELECT publication_date, rate FROM kursy WHERE kursy.code = '" + req.params.currencyCode + "' AND publication_date between '" + from + "' AND '" + to + "' ;", function(err, kursy){
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
        var wynik = '';
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
