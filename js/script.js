//event listeners
document.querySelector("#zip").addEventListener("change", displayCity);

//functions
async function displayCity() {
    //alert("Getting city name")
    let zipCode = 
    document.querySelector("#zip").value;
    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();
    //console.log(data);

    document.querySelector("#city").innerHTML = data.city;
    document.querySelector("#latitude").innerHTML = data.latitude;
    document.querySelector("#longitude").innerHTML = data.longitude;
}

