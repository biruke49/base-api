const mongoose = require("mongoose");
const User = require("../models/users/User");
const Utility = require("../helpers/utility");
const ROLES = require("../helpers/roles");

const ResetPassword = {
  LoginUrl: "https://myapi.org",
  Subject: "Your Login Credential",
};
const CommonEmail = {
  SupportEmail: "myapi@vintechplc.com",
  Footer: "MyApi",
  ShortCode: "9694",
  Logo: `${process.env.API_URL}/logo.png`,
};
const EmailConfig = {
  Email: "myapi@vintechplc.com",
};
const Messages = {
  400: "Bad Request",
  401: "Unauthorized",
  404: "Not Found",
  500: "Internal Server Error",
};

const connectDB = async () => {
  const response = await mongoose.connect(`${process.env.MONGO_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
    serverSelectionTimeoutMS: 200000,
    socketTimeoutMS: 60000,
  });

  console.log("MongoDB Connected: " + response.connection.host);
};

const createDefaultUser = async () => {
  const users = await User.find({});
  if (users.length === 0) {
    const defaultUser = new User({
      first_name: "Default",
      last_name: "User",
      email: "admin@myapi.org",
      password: Utility.hashPassword("P@ssw0rd"),
      gender: "Male",
      phone_number: "+251967436185",
      role: [ROLES.SuperAdmin, ROLES.Admin],
      address: {
        city: "Addis Ababa",
        sub_city: "Kirkos",
        woreda: "02",
        house_number: "1234",
      },
    });

    if (await defaultUser.save()) {
      console.log("default user created successfully");
    }
  }
};

// const connectDB = async () => {
//     console.log('connectio')
//    await mongoose.connect(`${process.env.MONGO_URL}?retryWrites=true&w=majority`, {
//         useNewUrlParser: true,
//         useUnifiedTopology: false,
//         serverSelectionTimeoutMS: 200000
//     }).then(() => {
//         console.log('Database connected');
//     }).catch((error) => {
//         console.log(error)
//     })

// }
module.exports = {
  ResetPassword,
  CommonEmail,
  EmailConfig,
  Messages,
  connectDB,
  createDefaultUser,
};
