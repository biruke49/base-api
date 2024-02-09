require('dotenv').config()
const bcrypt = require('bcrypt')
const random = require('random-string-generator')

const Utility = {
    hashPassword: (plainPassword) => {
        console.log(plainPassword)
        // let hashedPassword;
        // bcrypt.genSalt( Number(process.env.bcryptHashRound), function(err, salt) {
        //     bcrypt.hash(plainPassword, salt, function(err, hash) {
        //         console.log(hash)
        //     });
        // });
        return bcrypt.hashSync(plainPassword, Number(process.env.bcryptHashRound));
    },
    //  generateRandomTrackingId: async () => {
    
    //     const randomTrackingId = random(6, 'numeric');
        
    //     const delivery = await Delivery.findOne({tracking_id: "EDL-"+randomTrackingId})
    //     if(delivery) {
    //         return Utility.generateRandomTrackingId()
    //     }
    //     console.log(randomTrackingId)
    //         return "EDL-"+ randomTrackingId
    // },
    comparePassword: (plainPassword, encryptedPassword) => {
       
        const isMatch = bcrypt.compareSync(plainPassword, encryptedPassword);
        console.log(isMatch)
        return isMatch;
        
    },
    generatePassword: (length = 4) => {
        var password = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()-';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            password += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return password;
    },
    getTimeDifference: (endTime, startTime) => {
        //console.log('getTimeDifference ', endTime, 'startTime', startTime)
        let diff = endTime.getTime() - startTime.getTime();
        let msec = diff;
        const hh = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;
        const mm = Math.floor(msec / 1000 / 60);
        msec -= mm * 1000 * 60;
        const ss = Math.floor(msec / 1000);
        msec -= ss * 1000;
        let result = hh ? hh.toString() : '00';
        result += ':' + (mm.toString() ? mm.toString() : '00');
        result += ':' + (ss.toString() ? ss.toString() : '00')
        return result;
    },
    getPasswordFromCurrentDate: () => {
        const currentDate = new Date();
        const month = (currentDate.getMonth() > 9) ? currentDate.getMonth().toString() : '0' + currentDate.getMonth().toString();
        const date = (currentDate.getDate() > 9) ? currentDate.getDate().toString() : '0' + currentDate.getDate().toString();
        return currentDate.getFullYear().toString() + month + date;
    },
    getTheLastMonday: () => {
        const date = new Date();
        const previousMonday = new Date();
        previousMonday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
        return previousMonday;
    }

}
module.exports = Utility;