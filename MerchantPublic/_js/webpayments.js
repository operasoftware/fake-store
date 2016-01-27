'use strict';

var supportedInstruments = [ "braintree" ];
var details = {
  "amount" : "2.99",
  "currencyCode" : "USD",
  "countryCode" : "US",
  "requestShipping" : false,
  "recurringCharge" : false
};

// Optional identities for schemes/instruments
var schemeData = {
  "braintree" : {
    "token" : "",
  },
};

function runPayments() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var token = xhttp.responseText;
      schemeData.braintree.token = token;
      runPaymentRequest();
    }
  }
  xhttp.open("GET", "/client_token", true);
  xhttp.send();
}

function runCheckout(nonce, amount) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // The user should now be authenticated
      window.top.location.reload();
    }
  }
  var params = "payment_method_nonce=" + nonce + "&full_amount=" + amount;
  xhttp.open("post", "/checkout?" + params, true);
  xhttp.send();
}

function runPaymentRequest() {
  var promise = paymentRequest(supportedInstruments, details, schemeData);

  promise.then(
      function(instrumentResponse) {
        if (instrumentResponse.instrumentDetails
            && instrumentResponse.instrumentDetails != "") {
          var instrument_details_json = JSON
              .parse(instrumentResponse.instrumentDetails);
          runCheckout(instrument_details_json.details.nonce, details.amount);
        }
      }).catch(function(err) {
        alert("Uh oh, something bad happened", err.message);
  });
}
