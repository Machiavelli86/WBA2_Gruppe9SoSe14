//Requires
var express = require('express');
var http = require('http');
var faye = require('faye');
var mongoDB = require('mongoskin');

//Verbindung zur DB herstellen
var db = mongoDB.db('mongodb://localhost/appdb?auto_reconnect=true', {save: true});
//Collection "binden"
db.bind('anmeldung');
db.bind('bestellung');


//Collection db. als Objekt speichern
var anmeldung = db.anmeldung;
var bestellung = db.bestellung;

//Express Objekt erstellen
var app = express();
//Server Objekt erstellen
var server = http.createServer(app);

//Node Adapter konfigurieren
var bayeux = new faye.NodeAdapter({
	mount: '/faye',
	timeout: 45
});
//Node Adapter mit HTTP-Server verbinden
bayeux.attach(server);
//PubSub Client erstellen
var pubClient = bayeux.getClient();

// /public zur default folder machen, wo die index.html liegt
app.use(express.static(__dirname + '/public'));
//damit body-parser JSON unterstützt
app.use(express.json());
//damit body-parser urlencoded unterstützt
app.use(express.urlencoded());
//Errorbehandlung
app.use(function(error, req, res, next) {
	console.error(error.stack);
	res.end(error.message);
});

app.get('/anmeldung', function(req, res, next){
	//Daten in der DB suchen
	anmeldung.findItems(function(error, result){
		//Errorbehandlung
		if(error){
			next(error);
		}
		//Collection als JSON-Datei wiedergeben
		else{
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify(result));
		};
	});
});


//Verhalten bei "post" auf /anmeldung
app.post('/anmeldung', function(req, res, next){
         
         if(req.body.user !== undefined && req.body.email != "" && req.body.password != "")
         {
         
    //Daten in anmeldung Collection speichern
	anmeldung.insert(req.body, function(error, anmeldung){
		//Errorbehandlung
		if(error){
			next(error);
		}
		//Ausgabe
		else{
			console.log('User wurde gespeichert!');
		};
                     
	});
	//Unter /anmelding veröffentlichen
	var publication = pubClient.publish('/anmeldung', req.body);
	publication.then(function() {
		res.writeHead(200, 'OK');
		//Ausgabe
		console.log('User wurde veröffentlicht unter "/anmeldung"!');
		res.end();
	//Errorbehandlung
	}, function(error) {
		next(error);
                     });
         }
         else {
         console.log(' Bitte alle Felder ausfühlen"!');
         }
});

app.get('/bestellung', function(req, res, next){
        //Daten in der DB suchen
        bestellung.findItems(function(error, result){
                             //Errorbehandlung
                             if(error){
                             next(error);
                             }
                             //Collection als JSON-Datei wiedergeben
                             else{
                             res.writeHead(200, {
                                           'Content-Type': 'application/json'
                                           });
                             res.end(JSON.stringify(result));
                             };
                             });
        });

//Verhalten bei "post" auf /bestellung
app.post('/bestellung', function(req, res, next){
         
		  if(req.body.mietbegin_datum != "" && req.body.mietbegin_zeit != "" && req.body.rueckgabe_datum != "" && req.body.rueckgabe_zeit != "")
         {
			 
         //Daten in bestellungCollection speichern
         bestellung.insert(req.body, function(error, bestellung){
                          //Errorbehandlung
                          if(error){
                          next(error);
                          }
                          //Ausgabe
                          else{
                          console.log('Bestellung wurde gespeichert!');
                          };
                          
                          });
         //Unter /bestellung veröffentlichen
         var publication = pubClient.publish('/bestellung', req.body);
         publication.then(function() {
                          res.writeHead(200, 'OK');
                          //Ausgabe
                          console.log('Bestellung wurde veröffentlicht unter "/bestellung"!');
                          res.end();
                          //Errorbehandlung
                          }, function(error) {
                          next(error);
                          });
		 } else {
         console.log(' Bitte alle Felder ausfühlen"!');
         }
         });



//HTTP-Server erstellen
server.listen(3000, function(){
	console.log('Server listens on port 3000');
});
