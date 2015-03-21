// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready
function onDeviceReady() {
    var db = window.sqlitePlugin.openDatabase({name: "DB"});

    url = 'http://api.rainchasers.com/v1/river?ts=1357504926';
    $.getJSON(url, function(result){
        $.each(result, function(i, field){

            var obj = JSON.parse(result);

           var print = obj.data[1].desc;

            console.log(print);
        });
    });

    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS test_table');
        tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');


        });
}