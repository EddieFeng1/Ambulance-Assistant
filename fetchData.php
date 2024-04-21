<?php 
	//Returns JSON data to Javascript file
	header("Content-type:application/json");
	
	//Connect to db 
	$pgsqlOptions = "host='dialogplus.leeds.ac.uk' dbname = 'geog5871' user = 'geog5871student' password = 'Geibeu9b'";
	$dbconn = pg_connect($pgsqlOptions) or die ('connection failure');
	
	//Define sql query
	$query = "SELECT oid, name, latitude, longitude FROM web22_hospital";

	//Execute query
	$result = pg_query($dbconn, $query) or die ('Query failed: '.pg_last_error());
	
	//Define new array to store results
	$tweetData = array();
	
	//Loop through query results 
	while ($row = pg_fetch_array($result, null, PGSQL_ASSOC))	{
	
		//Populate tweetData array 
		$tweetData[] = array("id" => $row["oid"], "name" => $row["name"], "lat" => $row["latitude"], "lon" => $row["longitude"]);
	}
	
	//Encode tweetData array in JSON
	echo json_encode($tweetData); 
	
	//Close db connection
	pg_close($dbconn);
?>
