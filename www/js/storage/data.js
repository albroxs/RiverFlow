// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

var db;

// Cordova is ready
function onDeviceReady() {


    var url = 'http://api.rainchasers.com/v1/river?ts=1357504926';

    db = window.sqlitePlugin.openDatabase({name: "DB", bgType: 1, androidLockWorkaround: 1});

    db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS RIVERS");
        tx.executeSql("CREATE TABLE IF NOT EXISTS RIVERS (uuid PRIMARY KEY, url TEXT, riverName TEXT, riverSection TEXT, km TEXT, gradeText TEXT, description TEXT, directions TEXT, putinLat TEXT, putinLng TEXT, takeOutLat TEXT, takeOUTLng TEXT)");

    });

    populateDB(url);


}

function populateDB(url) {

    $.getJSON(url, function (result) {

        var nextURL = result.meta.link.next;

        $.each(result.data, function (i, field) {
            var uuid = result.data[i].uuid;
            var url = result.data[i].url;
            var riverName = result.data[i].river;
            var riverSection = result.data[i].section;
            var km = result.data[i].km;
            var gradeText = result.data[i].grade.text;
            var description = result.data[i].desc;
            var directions = result.data[i].directions;
            var putinLat = result.data[i].position[0].lat;
            var putinLng = result.data[i].position[0].lng;
            var takeOutLat = result.data[i].position[1].lat;
            var takeOutLng = result.data[i].position[1].lat;

            console.log("I got this far!");

            db.transaction(function (tx) {
                tx.executeSql("INSERT INTO RIVERS (uuid, url, riverName, riverSection, km, description, directions, putinLat, putinLng, takeOutLat, takeOutLng) " +
                "VALUES (" + uuid + "," + url + "," + riverName + "," + riverSection + "," + km + "," + gradeText + "," + description + "," +
                directions + "," + putinLat + "," + putinLng + "," + takeOutLat + "," + takeOutLng + ");", [], function(tx, res){
                        console.log("Rows Affected:" + res.rowsAffected);
                        console.log("Insert ID: " + res.insertId);
                    });

            });

        });

        if (nextURL != null) {
            populateDB(nextURL);
        }
    });






}
$('.search-button').click(function(){

    var query = $('.search-key').val();
    console.log(query);
    findRiver(query);
});

function findRiver(query) {

    var sqlStatement = "SELECT * FROM RIVERS WHERE riverName OR riverSection LIKE " + query + ";";
    console.log(sqlStatement);

    db.transaction(function (tx) {
        tx.executeSql(sqlStatement, [], function(tx, res) {
            console.log(res);
        });
    });


}