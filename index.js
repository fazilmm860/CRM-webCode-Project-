const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT
const dburl = process.env.DB_URL
const app = express();

mongoose.connect(dburl);
const con = mongoose.connection
try {
    con.on('open', () => {
        console.log(`MongoDB Connected`);
    })
}
catch (err) {
    console.log(`ERROR:${err}`);
}
app.get('/', (req, res) => {
    res.send(`<h1>CRM WEB-CODE PROJECT</h1>`)
});

app.listen(port, (req, res) => {
    console.log(`APP IS RUNNING ON PORT=${port}`);
});