const keys = require('./keys')

//EXPRESS SETUP
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json())

//POSTGRES SETUP
 const { Pool } = require('pg');
 const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgdatabase,
    password: keys.pgPassword,
    port: keys.pgPort
 });

pgClient.on("error", () => console.log("Connection Interrupted!"));

pgClient
    .query("CREATE TABLE IF NOT EXISTS values (number INT)", (err, res) => {
        console.log(err, res)
      })



//REDIS CLIENT SETUP
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

//Express Route Handlers
app.get('/',(req, res) => {
    res.send('Hi')
});

app.get('/values/all', async (req, res) => {
    const client = await pgClient.connect();
    const values = await client.query('SELECT * FROM values');
    client.release()
    res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values',(err, values) => {
        res.send(values)
    });
});

app.post('/values', async (req, res) => {
    const index = req.body.index;
    if(index > 40){
        res.status(422).send("Index is too high");
    } 

    redisClient.hset('values',index,'Nothing yet!');
    redisPublisher.publish('insert',index);
    const client = await pgClient.connect();
    client.query('INSERT INTO values(number) VALUES($1)',[index]);
    client.release()
    res.send({ inserted: true })
});

app.listen(5000, err => {
    console.log('Listening on PORT 5000');
});