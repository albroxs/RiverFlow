// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

var db;



// Cordova is ready
function onDeviceReady() {




    db = window.sqlitePlugin.openDatabase({name: "DB", bgType: 1, androidLockWorkaround: 1});

    db.transaction(createTables, errorCB, successCB);
    db.transaction(populateDB, errorCB, successCB);


}

function createTables(tx) {

    tx.executeSql("DROP TABLE IF EXISTS rivers");
    tx.executeSql("CREATE TABLE IF NOT EXISTS rivers (id integer primary key, uuid text, url text, riverName text, riverSection text, km text, gradeText text, description text, directions text, putinLat text, putinLng text, takeOutLat text, takeOUTLng text)");

}

function populateDB(tx) {
    var url = 'http://api.rainchasers.com/v1/river?ts=1357504926';

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

            console.log("I got here!");

                tx.executeSql("INSERT INTO rivers (uuid, url, riverName, riverSection, km, gradeText, description, directions, putinLat, putinLng, takeOutLat, takeOutLng) " +
                "VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [uuid, url, riverName, riverSection, km, gradeText, description, directions, putinLat, putinLng, takeOutLat, takeOutLng], successDB, errorCB);
        });

        //if (nextURL != null) {
        //    populateDB();
        //}
    });

}


$('.search-button').click(function(){

    var query = $('.search-key').val();
    console.log(query);
    findRiver(query);
});

function findRiver(query) {

    var sqlStatement = "SELECT * FROM rivers WHERE riverName OR riverSection LIKE " + query + ";";
    console.log(sqlStatement);

    db.transaction(function (tx) {
        tx.executeSql(sqlStatement, [], function (tx, res) {
            console.log(res);
        });
    });

}

// Transaction error callback
function errorCB(err) {
    console.log("Error processing SQL: " + err.code);
}
// Success error callback
function successCB() {
    console.log("Success!");
}

