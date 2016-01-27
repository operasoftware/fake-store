# Fake web store — a Payment Request API demo

Simple experiment for integrating [PayPal’s Braintree API](https://developers.braintreepayments.com/start/overview) with [Payment Request API](https://wicg.github.io/paymentrequest/specs/paymentrequest.html).

## Set up

1. Clone the repository and `cd` into its main directory.
2. Install [Node](https://nodejs.org/en/) which comes with `npm` if you haven’t already.
3. Install dependencies:

    ```sh
    npm install
    ```

4. A [PayPal sandbox account](https://www.braintreepayments.com/get-started) is also needed. Retrieve the credentials from the sandbox account, edit `index.js`, and fill in `merchantId`, `publicKey` and `privateKey`.

5. Run the test server:

    ```sh
    node index.js
    ```

6. Start a browser on an Android phone, browse to the test server, and click on “Download Opera” to download and install `opera_android_braintree.apk` on the phone. Run the demo from the Opera Beta.

    An Opera version with payment request support can be found at `/MerchantPublic/opera_android_braintree.apk`, and can also be downloaded from the test server.
