//Requires
var express = require('express');
var http = require('http');
var faye = require('faye');
var mongoDB = require('mongoskin');

//Verbindung zur DB herstellen
var db = mongoDB.db('mongodb://localhost/planetendb?auto_reconnect=true', {save: true});
//Collection planeten "binden"
db.bind('planeten');
//Collection db.planeten als Objekt planeten speichern
var planeten = db.planeten;

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

//Verhalten bei "get" auf /planeten
app.get('/planeten', function(req, res, next){
	//Daten in der DB suchen
	planeten.findItems(function(error, result){
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

//Verhalten bei "post" auf /planeten
app.post('/planeten', function(req, res, next){
	//Daten in planetenCollection speichern
	planeten.insert(req.body, function(error, planeten){
		//Errorbehandlung
		if(error){
			next(error);
		}
		//Ausgabe
		else{
			console.log(req.body.Name + ' wurde gespeichert!');
		};
	});
	//Unter /planeten veröffentlichen
	var publication = pubClient.publish('/planeten', req.body);
	publication.then(function() {
		res.writeHead(200, 'OK');
		//Ausgabe
		console.log(req.body.Name + ' veröffentlicht unter "/planeten"!');
		res.end();
	//Errorbehandlung
	}, function(error) {
		next(error);
	});
});

//HTTP-Server erstellen
server.listen(3000, function(){
	console.log('Server listens on port 3000');
});
