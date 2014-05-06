$(document).ready(function() {
                  //PubSub Client erstellen
                  var client = new Faye.Client('/faye');
                  
                  var subscription = client.subscribe('/bestellung', function(message) {
                                                      addTableRow(message);
                                                      });

//Definiert, was nach dem Absenden des Formulars passiert
                  $('#bestellung').submit(function(event) {
                                         var formURL = $(this).attr('action');
                                         // content wird in data als JSON gespeichert
                                         var data = {
										 cityrad: $('#cityrad').val(),
										 cityrad_farbe: $('#cityrad_farbe').val(),
                                         mountainbike: $('#mountainbike').val(),
										 mountainbike_farbe: $('#mountainbike_farbe').val(),
                                         trekkingrad: $('#trekkingrad').val(),
                                         trekkingrad_farbe: $('#trekkingrad_farbe').val(),
                                         mietbegin_datum: $('#mietbegin_datum').val(),
										 mietbegin_zeit: $('#mietbegin_zeit').val(),
										 rueckgabe_datum: $('#rueckgabe_datum').val(),
										 rueckgabe_zeit: $('#rueckgabe_zeit').val()
                                         };
                                         
                                         //Spezifiziert das Verhalten bei "post"
                                         var ajaxPost = $.ajax({
                                                               url: formURL,
                                                               type: 'POST',
                                                               data: JSON.stringify(data),
                                                               contentType: 'application/json'
                                                               });
                                         // Pop-up und Formular leeren
                                         ajaxPost.done(function() {
                                                       alert('Danke für Ihre Betsellung! Sie bekommen in kurzen eine Nachricht. Sie können dieses Fenster schliessen!');
                                                       $('#bestellung')[0].reset();
                                                       });
                                         // Popup mit Error
                                         ajaxPost.fail(function(e) {
                                                       alert(data.modul + ' nicht hinzugefügt (' + JSON.stringify(e) + ')');
                                                       });
                                         // Prevent Default des Formulars
                                         event.preventDefault();
                                         });
                  
                  //Spezifiziert das Verhalten bei "get" auf /bestellung
                  var request = $.ajax({
                                       url: '/bestellung',
                                       type: 'GET',
                                       contentType: 'application/json'
                                       });
                  //Erweitert die Tabelle
                  request.done(function(data) {
                               data.forEach(function(bestellung) {
                                            addTableRow(bestellung);
                                            });
                               });
                  //Popup mit Error
                  request.fail(function(e) {
                               alert('ups, das haette nicht passieren duerfen :(!(Error: ' + JSON.stringify(e) + ')');
                               });
                  //Funktion Tabelle erweitern
				  
                  var addTableRow = function(bestellung) {
                  $('#table_bestellungen').append('<tr><td>' + bestellung.cityrad + '</td><td>' + bestellung.cityrad_farbe + '</a></td><td>' + bestellung.mountainbike + '</td><td>' + bestellung.mountainbike_farbe + '</td><td>' + bestellung.trekkingrad + '</td><td>' + bestellung.trekkingrad_farbe + '</a></td><td>' + bestellung.mietbegin_datum + '</td><td>' + bestellung.mietbegin_zeit + '</td><td>' + bestellung.rueckgabe_datum + '</td><td>' + bestellung.rueckgabe_zeit + '</td></tr>');
                  
             
                  

                  };
                                    
});


