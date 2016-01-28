var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var braintree = require("braintree");

var gateway = braintree.connect({
  environment : braintree.Environment.Sandbox,
# error
// Fill in the sandbox credentials and remove the #error code above.
// Create an test account at https://www.braintreepayments.com/get-started

  merchantId : "",
  publicKey : "",
  privateKey : ""
});

var auth_sessions = {};

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended : true
}));

// Simple session check middleware
app.use('/authenticated', function(req, res, next) {
  console.log("req" + req.path + ". Cookies: ", req.cookies)
  if (req.cookies.secret && auth_sessions[req.cookies.secret])
    next();
  else
    res.send('<!DOCTYPE html><head><title>401 Not authenticated</title>'
        + '<meta http-equiv=refresh content="2;URL=/01.html"></head>'
        + '<body>Naughty</body>');
});

app.use('/', function(req, res, next) {
  console.log("req" + req.path + ". Cookies: ", req.cookies)
  if ((req.path == "/" || req.path == "/01.html") && req.cookies.secret
      && auth_sessions[req.cookies.secret]) {
    res.send('<!DOCTYPE html><title>Success</title>'
        + '<meta http-equiv=refresh content="0;URL=/authenticated/02.html">');
  } else
    next();
});

app.use(express.static('MerchantPublic'));
app.use('/authenticated', express.static('MerchantAuthorized'));

app.get("/client_token", function(req, res) {
  gateway.clientToken.generate({}, function(err, response) {
    console.log("client_token: " + response.clientToken);
    res.send(response.clientToken);
  });
});

app.post("/checkout", function(req, res) {
  var nonce = req.query.payment_method_nonce;
  var amount = req.query.full_amount;

  if (!nonce || nonce.length == 0) {
    res.send("Auth failed");
    return;
  }
  console.log("req.body.payment_method_nonce: " + nonce + "\n");
  CreateTransaction(amount, nonce, res);
});

app.use(function(req, res) {
  res.send("404 not found");
});

function CreateTransaction(client_amount, nonceFromTheClient, res) {
  console.log("nonceFromTheClient:" + nonceFromTheClient);
  gateway.transaction
      .sale(
          {
            amount : client_amount,
            paymentMethodNonce : nonceFromTheClient,
          },
          function(err, result) {
            if (err) {
              console.log("error" + err + "\nresult:" + result);
              res.send("Auth failed");
            } else {
              console.log("setting cookie " + nonceFromTheClient);
              // Hack. Use the nonce as session cookie.
              auth_sessions[nonceFromTheClient] = true;
              // Setting some simple header to fake auth control
              res.setHeader("Set-Cookie", [ "type=session", "name=someone",
                  "secret=" + nonceFromTheClient, "path=/" ]);
              res
                  .send('<!DOCTYPE html><title>Success</title><meta http-equiv=refresh content="0;URL=/authenticated/02.html">');
            }
          });
}

var server = app.listen(9001, "0.0.0.0", function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
