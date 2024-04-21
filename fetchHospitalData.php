<?php

//Connect to db 
$pgsqlOptions = "host='dialogplus.leeds.ac.uk' dbname='geog5871' user='geog5871student' password='Geibeu9b'";
$dbconn = pg_connect($pgsqlOptions) or die ('connection failure');

// get the hospital name typed by users. if the value is not null, get the hospital name typed by users, or set the string the as empty
$hospitalName = isset($_GET['hospitalName']) ? $_GET['hospitalName'] : '';

// prepare the sql sentence
$sql = "SELECT oid, name, latitude, longitude FROM web22_hospital WHERE name LIKE $1";

// excute the query
$result = pg_query_params($dbconn, $sql, array("%$hospitalName%"));

// get results
$hospitalData = array();
if ($result) {
    while($row = pg_fetch_assoc($result)) {
        $hospitalData[] = $row;
    }
} else {
    $hospitalData[] = array("error" => "No hospital data found");
}

// convert the results as json
header('Content-Type: application/json');
echo json_encode($hospitalData);

// close connection
pg_close($dbconn);

?>
