var http = require("http");
var url = require("url");
var querystring = require("querystring");

var planet = new Array("Merkur", "Venus", "Erde", "Mars", "Jupiter", "Saturn", "Uranus", "Neptun");
//hier evt: var planet = [{name:"Mars",durchmesser:7}]; um Variablen zu verändern -> planet.push({"Venus","Jupiter"});

var abstand = new Array("58", "108", "150", "228", "778", "1433", "2872", "4495");
var durchmesser = new Array("4879", "12103", "12734", "6772", "138346", "114632", "50532", "49105");

var server = http.createServer(function(request, response){
    response.writeHead(200, {"Content-Type": "text/html"});  // 200-Status von http:(OK)

    //Aufgabe 2:
    var pfad = url.parse(request.url).pathname; 
    if (pfad == "/Planeten") {

    //Aufgabe 1:
    response.write("<table cellpadding = '5' border = '1'><tr><th colspan = 3>Planeten</th></tr><tr><th>Planet</th><th>Abstand in Mio km</th><th>Durchmesser, km</th></tr>");
    for (var i = 0; i < planet.length; i++) {
        response.write("<tr><th>" + planet[i] + "</th><th>" + abstand[i] + "</th><th>" + durchmesser[i] + "</th></tr>");
        }
    response.write("</table>");

    //Aufgabe 3:
    response.write("<form method='POST' action='http://localhost:8888/Planeten' style='margin-top:20px;'>");
        response.write("Planet: <input name= 'planet' /></br>Abstand: <input name= 'abstand' /></br>Durchmesser: <input name= 'durchmesser' /></br>");
        response.write("<input type='submit' value='senden'/>");
    response.write("</form>");

    //Aufgabe 4: 
    var body = "";
    request.on('data', function(data){
        body = body + data.toString();
    });
    request.on('end', function(){
        var daten = querystring.parse(body);

        if(typeof daten.planet == "string"){
            planet[planet.length] = daten.planet;
            durchmesser[durchmesser.length] = daten.durchmesser;
            abstand[abstand.length] = daten.abstand;
        }


    });



};
response.end();
});
server.listen(8888);
