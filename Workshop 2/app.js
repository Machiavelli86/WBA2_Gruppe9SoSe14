var http = require("http");
var express = require("express");

var planeten =  [{ "name": "Merkur", "durchmesser": 4879, "abstand": 58 },
                 { "name": "Venus", "durchmesser": 12103, "abstand": 108 },
                 { "name": "Erde", "durchmesser": 12734, "abstand": 150 },
                 { "name": "Mars", "durchmesser": 6772, "abstand": 150 },
                 { "name": "Jupiter", "durchmesser": 138346, "abstand": 220 },
                 { "name": "Saturn", "durchmesser": 114632, "abstand": 778 },
                 { "name": "Uranus", "durchmesser": 50532, "abstand": 1433 },
                 { "name": "Neptun", "durchmesser": 49105, "abstand": 4495 }];

// var planeten = require("./planeten.json"); - oder Array als externe Datei

var app = express(); // Anlegen eines Webservers

// Konfiguration des Webservers
app.configure(function(){
    app.use(express.static(__dirname + "/public"));
    app.use(express.json());
    app.use(express.urlencoded());
    
              app.use(function(err, req, response, next) {
       console.error(err.stack);
       response.end(err.status + " " + err.messages);
    });
});

// Routing einer GET Methode auf die Ressource "planeten"
    app.get("/planeten", function (req, response){
        response.writeHead(200,{"Content-Type" : "text/html"});
        response.write("<html><head><title>Planeten - Gruppe 1 - Team 9</title></head><body>");
        
        response.write("<table cellpadding = '5' border = '1'><tr><th colspan = 3>Planeten</th></tr><tr><th>Planet</th><th>Abstand in Mio km</th><th>Durchmesser, km</th></tr>");
              
        planeten.forEach(function(planet) {
            response.write("<tr><td>" + planet.name + "</td><td>" + planet.durchmesser + "</td><td>" + planet.abstand + "</td></tr>");
        });
        response.write("</table>");
            response.write("<br /><a href='./' style='color:#0000FF;'>Planet hinzuf&uuml;gen</a>");
        response.write("</body></html>");
        response.end();
    });

// Routing einer POST Methode auf die Ressource "planeten" - Veränderungen an Daten
   app.post("/planeten", function (req, response){
        response.writeHead(200,{"Content-Type" : "text/html"});
        planeten.push(req.body);
        response.end();
   });

app.listen(3000);