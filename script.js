var map;
var markerData;
var searchResults = [];


function clearData() {
	//clear markers on the map
    map.eachLayer(function(layer) {
        if (layer.getLatLng) {
            map.removeLayer(layer); 
        }
    });
	//clear routes on the map
	 map.eachLayer(function (layer) {
        if (layer instanceof L.Polyline) {
            map.removeLayer(layer); 
        }
    });
  }

function search() {
    searchResults = [];

    // Get the hospital name
    var hospitalName = $('#hospitalName').val();

    // Invoke the PHP
    $.getJSON("fetchHospitalData.php", { hospitalName: hospitalName }, function(data) {
        // Clear the results
        $('#results').empty();
		//push the elements of results to searchResults
        for (var i = 0; i < data.length; i++) {
            searchResults.push({
                oid: data[i].oid, 
                name: data[i].name, 
                lat: data[i].latitude, 
                lon: data[i].longitude
            }); 
        }

        // Check if data is retrieved successfully
        if (data.length > 0) {
            // Show the hospital names
            data.forEach(function(hospital) {
                $('#results').append('<p>' + hospital.name+ '.' + 'Coordinate is '+ hospital.latitude+ ',' + hospital.longitude+'</p>');
				//add hopsital to Map
                plotIcons();
            });
        } else {
            $('#results').append('<p>No hospital data found.</p>');
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error fetching hospital data: ", textStatus, errorThrown);
    });//report erro if program gone wrong
}

		function plotIcons()	{
			
			clearData();
			
			var myIcon = L.icon({
				iconUrl : 'hospital.png',
				iconSize:[23,23]
			});	
			for (var i = 0; i< searchResults.length; i++)	{ 
				var Results = new L.LatLng(searchResults[i].lat,searchResults[i].lon);
				var marker = new L.Marker(Results,{icon:myIcon}).addTo(map).bindPopup(searchResults[i].name);
			}
		}


function showmap()	{
	// Create the map object and set the centre point and zoom level 
    map = L.map('mapcontainer');
    map.setView([51,-2],7);

    // Load tiles from open street map
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data ©OpenStreetMap contributors, CC-BY-SA, Imagery ©CloudMade',
        maxZoom: 18 
    }).addTo(map); // Add the basetiles to the map object
	
	L.control.locate().addTo(map)
}

function fetchData()	{
	
	
	//Define array to hold results returned from server
	markerData = new Array();
	
	//AJAX request to server; accepts a URL to which the request is sent 
	//and a callback function to execute if the request is successful. 
	$.getJSON("fetchData.php", function(results)	{
		
		//Populate tweetData with results
		for (var i = 0; i < results.length; i++ )	{
			
			markerData.push ({
				id: results[i].oid, 
				name: results[i].name, 
				lat: results[i].lat, 
				lon: results[i].lon
			}); 
		}
		
		plotTweets(); 
	});
	
	function plotTweets()	{
		var myIcon = L.icon({
    iconUrl : 'hospital.png',
    iconSize:[23,23]
	});	
		for (var i = 0; i< markerData.length; i++)	{ 
			var markerLocation = new L.LatLng(markerData[i].lat,markerData[i].lon);
			var marker = new L.Marker(markerLocation,{icon:myIcon}).addTo(map).bindPopup(markerData[i].name);
		}
	}
}



function route() {
    // Clear map
    clearData();

    // Get the values from the form
    var longitude = document.getElementById("longitude").value;
    var latitude = document.getElementById("latitude").value;

    // Declare an array to save return
    var nearhospital = [];
    // Handle data when request received
    $.getJSON("nearhospital.php", {longitude:longitude,latitude:latitude},function(results) {
        for (var i = 0; i < results.length; i++) {
            nearhospital.push({
                oid: results[i].oid, 
                name: results[i].name, 
                lat: results[i].lat, 
                lon: results[i].lon
            }); 
        }

        // Route
        L.Routing.control({
            waypoints: [
                L.latLng(latitude, longitude),
                L.latLng(nearhospital[0].lat, nearhospital[0].lon)
            ]
        }).addTo(map);
    });
}


	