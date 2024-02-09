var admin = require("firebase-admin");
const {GeoFire} = require('geofire');
var serviceAccount = require("./myapi-303e6-firebase-adminsdk-fsh0i-ae311c906f.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://drummroll-303e6-default-rtdb.firebaseio.com"
});



const Notification = {
    sendSingleNotification: (fcmId, payload, options) => {
       
        // const fcmId = "dIZJlO16S6aIiFoGPAg9qf:APA91bHjrxQ0I5vRqyrBFHqbYBM90rYZfmb2llmtA6q8Ps6LmIS9WwoO3ENnBGUDaax7l1eTpzh71RK9YS4fyDdPdowyalVhZXbjWxq337ZEtDvOSGihA5pyuTJeS0dqQl0I9H5MfnFp";
        // const payload = {
        //     notification: {
        //         title: "Hello from server",
        //         body: "Hello again"
        //     }
        // }
        // const options = {
        //     priority: "high",
        //     timeToLive: 60 * 60 * 24
        // }

        try {
            admin.messaging().sendToDevice(fcmId, payload, options)
            .then(response => {
                console.log(response)
            }).catch(err => {
                console.error(err)
            })
        } catch(err) {
            console.log('error');
            console.log(err)
        }

       
    },


    getNearestDrivers: async () => {
            const db = admin.database();
            const geofireRef = db.ref('availableDrivers');
            const geoFire = new GeoFire(geofireRef);

            const center = [8.993586100788185, 38.76614584934683];
            const radius = 10;
            const geoQuery = geoFire.query({
                center: center,
                radius: radius
              })
              const locations = [];

const handleKeyEntered = (key, location, distance) => {
    console.log('key entered')
  locations.push({ key, location });
};

geoQuery.on("key_entered", handleKeyEntered);

geoQuery.on("ready", () => {
  locations.forEach(({ key, location }) => {
    console.log("Key:", key);
    console.log("Location:", location);
    
  });

  // Remove the callback function from the key_entered event
//   geoQuery.off("key_entered", handleKeyEntered);
});
    },

    sendBulkNotification: (fcm, data) => {
        //console.log(678)
    },
    sendTopic: (topics, data) => {
        const topicList = topics.split(',');
        for (const topic of topicList) {
            const message = {
                notification: data,
                data: {
                    type: 'notification',
                    title: data.title,
                    body: data.body
                },
                topic: topic
            };
            admin.messaging().send(message)
                .then((response) => {
                    //console.log(`Successfully sent message on ${topic}:`, response);
                })
                .catch((error) => {
                    //console.log(`Error sending message on topic ${topic}:`, error);
                });
        }

    }
}
module.exports = Notification;