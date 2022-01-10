/*
Version: 0.16
Purpose:  Respond with PoP city in already existing WF branch/ATM searches
based on Repo: https://github.com/akamai/edgeworkers-examples/tree/master/microservice-geolocation

*/
export function onClientRequest(request) {
  var info = {};

  info.continent = request.userLocation.continent
    ? request.userLocation.continent
    : "N/A";

  info.country = request.userLocation.country
    ? request.userLocation.country
    : "N/A";

  info.zip = request.userLocation.zipCode
    ? request.userLocation.zipCode
    : "N/A";

  info.region = request.userLocation.region
    ? request.userLocation.region
    : "N/A";

  info.city = request.userLocation.city 
    ? request.userLocation.city 
    : "N/A";

  // add country check if US then do this, otherwise just give WF default locator site if outside US
  if (info.country == "US" && info.city != "N/A") {
    // edge case , e.g. Washington can be a State, City, etc...
    if (info.city == "WASHINGTON") {
      info.city = "WASHINGTON D.C.";
    }

    var redirecturl =
      "https://www.wellsfargo.com/locator/search/?searchTxt=" +
      info.city +
      "&mlflg=N&sgindex=99&chflg=N&_bo=on&_wl=on&_os=on&_bdu=on&_adu=on&_ah=on&_sdb=on&_aa=on&_nt=on&_fe=on/";

  } else {

    // return default WF locator if outside US
    redirecturl = "https://www.wellsfargo.com/locator/";
  }

  request.respondWith(
    302,
    {
      Location: [redirecturl],
    },
    ""
  );
}
