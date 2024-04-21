<?php 
	//Returns JSON data to Javascript file
	header("Content-type:application/json");
	
	//Connect to db 
	$pgsqlOptions = "host='dialogplus.leeds.ac.uk' dbname = 'geog5871' user = 'geog5871student' password = 'Geibeu9b'";
	$dbconn = pg_connect($pgsqlOptions) or die ('connection failure');
	
	// get the coordinates typed by users. if the value is not null, get the data typed by users, or set it as defult
	$longitude = isset($_GET['longitude']) ? $_GET['longitude'] : '-0.38999780280788093';
	$latitude = isset($_GET['latitude']) ? $_GET['latitude'] : '54.28748197694775';
	
	//echo "Longitude: " . $longitude . "<br>";
	//echo "Latitude: " . $latitude . "<br>";

	// prepare sql sentence
	$stmt = pg_prepare($dbconn, 
		"my_query", "SELECT 
		name,
		latitude,
		longitude,
		ST_Distance(
			ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
			ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
		) AS distance_meters
	FROM 
		web22_hospital
	ORDER BY 
		distance_meters
	LIMIT 1");

	//excute query
	$result = pg_execute($dbconn, "my_query", array($longitude, $latitude));


	
	//Define new array to store results
	$nearhospital = array();
	
	//Loop through query results 
	while ($row = pg_fetch_array($result, null, PGSQL_ASSOC))	{
	
		//Populate tweetData array 
		$nearhospital[] = array("oid" => $row["oid"], "name" => $row["name"], "lat" => $row["latitude"], "lon" => $row["longitude"]);
	}
	
	//Encode tweetData array in JSON
	echo json_encode($nearhospital); 
	
	//Close db connection
	pg_close($dbconn);
?>
