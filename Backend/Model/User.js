const mongoose = require("mongoose");
const User_Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
        },
        password: {
            type: String,
            require: true
        },
        private_key: {
            type: String,
            require: true
        },
        public_key: {
            type: String,
            require: true,
        },
        mnemonics: {
            type: String,
            require: true,
        },
        address: {
            type: String,
            require: true
        },
        acc_type: {
            type: String,
            require: true
        },
        symmetric_key: {
            type: String,
            require: true
        },
        encryption_Private_Key: {
            type: String,
            require: true
        },
        encryption_Public_Key: {
            type: String,
            require: true
        },
    }
)

const User = mongoose.model("user", User_Schema);
module.exports = User;