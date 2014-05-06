$(document).ready(function() {
                  //PubSub Client erstellen
                  var client = new Faye.Client('/faye');
                  
                  var subscription = client.subscribe('/anmeldung', function(message) {
                                                      addTableRow(message);
                                                      });
                  
                  //Definiert, was nach dem Absenden des Formulars passiert
                  $('#anmeldung').submit(function(event) {
                                         var formURL = $(this).attr('action');
                                         // content wird in data als JSON gespeichert
                                         var data = {
										 user: $('#user').val(),
                                         email: $('#email').val(),
                                         password: $('#password').val()
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
                                                       alert('Danke für Ihre Anmeldung! Sie können jetzt Fahrräder ausleihen!');
                                                       $('#anmeldung')[0].reset();
                                                       });
                                         // Popup mit Error
                                         ajaxPost.fail(function(e) {
                                                       alert(data.modul + ' nicht hinzugefügt (' + JSON.stringify(e) + ')');
                                                       });
                                         // Prevent Default des Formulars
                                         event.preventDefault();
                                         });
                  
                  //Spezifiziert das Verhalten bei "get" auf /anmeldung
                  var request = $.ajax({
                                       url: '/anmeldung',
                                       type: 'GET',
                                       contentType: 'application/json'
                                       });
                  //Erweitert die Tabelle
                  request.done(function(data) {
                               data.forEach(function(anmeldung) {
                                            addTableRow(anmeldung);
                                            });
                               });
                  //Popup mit Error
                  request.fail(function(e) {
                               alert('ups, das haette nicht passieren duerfen :(!(Error: ' + JSON.stringify(e) + ')');
                               });
                  //Funktion Tabelle erweitern
                  var addTableRow = function(anmeldung) {
                  $('#table').append('<tr><td><a id="link_user" href="/bestellungen.html?' + anmeldung._id+ '">' + anmeldung.user + '</a></td><td>' + anmeldung.email + '</a></td><td>' + anmeldung.password + '</td><td>' + anmeldung._id + '</td></tr>');
                  
                  $('#user_id').append('<b><a id="link_user" href="/bestellungen.html?' + anmeldung._id+ '">' + anmeldung.user + '</a><br/></b>');
				  
				  $('#user_res').append('<tr><td><a id="link_user" href="/benutzer_liste.html?' + anmeldung._id+ '">'+anmeldung.user +'<br/></td></tr>');
				 
				  
                  

                  };                        
});


