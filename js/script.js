//event listeners
document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", displayCounties);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#password").addEventListener("focus", displayPwd);
document.querySelector("#signupForm").addEventListener("submit", function(event) {
    validateForm(event);
});

//functions
async function displayCity() {
    //alert("Getting city name")
    let zipCode = document.querySelector("#zip").value;
    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();
    
    //zip code not found
    const err = document.querySelector("#zipError");
    if (!data || !data.city) {
        if (err) err.textContent = "Zip code not found";
        document.querySelector("#city").textContent = "";
        document.querySelector("#latitude").textContent = "";
        document.querySelector("#longitude").textContent = "";
        return;
    }
    if (err) err.textContent = "";

    document.querySelector("#city").textContent = data.city;
    document.querySelector("#latitude").textContent = data.latitude ?? "";
    document.querySelector("#longitude").textContent = data.longitude ?? "";
}

async function displayCounties() {
    let state = document.querySelector("#state").value;
    let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
    let response = await fetch(url);
    let data = await response.json();
    //resets content of county dropdown menu
    let countyList = document.querySelector("#county");
    countyList.innerHTML = "<option> Select County </option>";
    for (let i=0; i < data.length; i++) {
        countyList.innerHTML += `<option> ${data[i].county} </option>`;
    }
}

//checking whether the username is available
async function checkUsername() {
    let username = document.querySelector("#username").value.trim();
    let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
    let response = await fetch(url);
    let data = await response.json();
    let usernameError = document.querySelector("#usernameError")

    const available = (data?.available === true) ||
                    (data?.available === "true") ||
                    (data?.available === 1) ||
                    (data?.available === "1");

    if (available) {
        usernameError.innerHTML = " Username available!";
        usernameError.style.color = "green";
    } else {
        usernameError.innerHTML = " Username taken";
        usernameError.style.color = "red";
    }

    return available;
}

//validating form data
async function validateForm(e){
    e.preventDefault();
    let isValid = true;
    let username = document.querySelector("#username").value;
    if (username.length === 0) {
        document.querySelector("#usernameError").innerHTML = "Username Required!";
        isValid = false;
    }

    const pwd = document.querySelector("#password").value.trim();
    const pwd2 = document.querySelector("#password2").value.trim();
    const pwdError = document.querySelector("#passwordError");

    if (pwdError) pwdError.textContent = "";

    if (pwd.length < 6) {
        if (pwdError) pwdError.textContent = "Password must be at least 6 characters";
        isValid = false;
    } else if (pwd !== pwd2) {
        if (pwdError) pwdError.textContent = "Passwords don't match";
        isValid = false;
    }

    if (!(await checkUsername())) isValid = false;

    if (isValid) {
    e.target.submit();
    }
}

//display a suggested password
async function displayPwd() {
  try {
    const url = "https://csumb.space/api/suggestedPassword.php?length=8";
    const response = await fetch(url);
    const data = await response.json();
    const el = document.querySelector("#suggestedPwd");
    if (el) el.textContent = data.password || "";
  } catch (err) {
    const el = document.querySelector("#suggestedPwd");
    if (el) el.textContent = "Couldn’t load suggestion";
  }
}

//all 50 states
function populateStates() {
  const states = [
    { abbr: "AL", name: "Alabama" }, { abbr: "AK", name: "Alaska" },
    { abbr: "AZ", name: "Arizona" }, { abbr: "AR", name: "Arkansas" },
    { abbr: "CA", name: "California" }, { abbr: "CO", name: "Colorado" },
    { abbr: "CT", name: "Connecticut" }, { abbr: "DE", name: "Delaware" },
    { abbr: "FL", name: "Florida" }, { abbr: "GA", name: "Georgia" },
    { abbr: "HI", name: "Hawaii" }, { abbr: "ID", name: "Idaho" },
    { abbr: "IL", name: "Illinois" }, { abbr: "IN", name: "Indiana" },
    { abbr: "IA", name: "Iowa" }, { abbr: "KS", name: "Kansas" },
    { abbr: "KY", name: "Kentucky" }, { abbr: "LA", name: "Louisiana" },
    { abbr: "ME", name: "Maine" }, { abbr: "MD", name: "Maryland" },
    { abbr: "MA", name: "Massachusetts" }, { abbr: "MI", name: "Michigan" },
    { abbr: "MN", name: "Minnesota" }, { abbr: "MS", name: "Mississippi" },
    { abbr: "MO", name: "Missouri" }, { abbr: "MT", name: "Montana" },
    { abbr: "NE", name: "Nebraska" }, { abbr: "NV", name: "Nevada" },
    { abbr: "NH", name: "New Hampshire" }, { abbr: "NJ", name: "New Jersey" },
    { abbr: "NM", name: "New Mexico" }, { abbr: "NY", name: "New York" },
    { abbr: "NC", name: "North Carolina" }, { abbr: "ND", name: "North Dakota" },
    { abbr: "OH", name: "Ohio" }, { abbr: "OK", name: "Oklahoma" },
    { abbr: "OR", name: "Oregon" }, { abbr: "PA", name: "Pennsylvania" },
    { abbr: "RI", name: "Rhode Island" }, { abbr: "SC", name: "South Carolina" },
    { abbr: "SD", name: "South Dakota" }, { abbr: "TN", name: "Tennessee" },
    { abbr: "TX", name: "Texas" }, { abbr: "UT", name: "Utah" },
    { abbr: "VT", name: "Vermont" }, { abbr: "VA", name: "Virginia" },
    { abbr: "WA", name: "Washington" }, { abbr: "WV", name: "West Virginia" },
    { abbr: "WI", name: "Wisconsin" }, { abbr: "WY", name: "Wyoming" },
    { abbr: "DC", name: "District of Columbia" }
  ];
  const sel = document.querySelector("#state");
  sel.innerHTML = `<option value="">Select One</option>` +
    states.map(s => `<option value="${s.abbr.toLowerCase()}">${s.name}</option>`).join("");
}
    populateStates();