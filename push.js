var express = require('express');
const fetch = require('node-fetch');
const { google } = require('googleapis');
var app = express();


function getAccessToken() {
    return new Promise(function(resolve, reject) {
        //const key = require('./**********************************.json');
        const jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            ['https://www.googleapis.com/auth/firebase.messaging'],
            null
        );
        jwtClient.authorize(function(err, tokens) {
            if (err) {
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        });
    });
}


var server = app.listen(8085, function() {
    console.log("Server is running on port 8085");
});

app.get('/', (req, res) => res.send('Hello this nodejs server. Enjoy :)'));


app.get('/sendNotification', function(req, res) {
    getAccessToken().then(function(accessToken) {
        console.log("signedAccessToken", accessToken);
        let title="Hi test";
        let bodyMessage="Hi test";
        var options = {
            "message": {
                "token": "*******************************************************************************",
                "notification": {
                    "title": title,
                    "body": bodyMessage
                },
                "data": {
                    "title": title,
                    "body": bodyMessage
                },
                "android": {
                    "notification": {
                        "click_action": "android.intent.action.MAIN"
                    }
                },
                "apns": {
                    "headers": {
                        "priority": "high"
                    },
                    "payload": {
                        "aps": {
                            "badge": 1
                        },
                        "content_available": 1,
                        "data": {
                            "title": title,
                            "body": bodyMessage
                        }
                    }
                }
            }
        };

        fetch('https://fcm.googleapis.com/******************/messages:send', {
                method: 'post',
                body: JSON.stringify(options),
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken },
            })
            .then(res => res.json())
            .then(json => {
                res.send({ "result": json })
            });


    });
})
