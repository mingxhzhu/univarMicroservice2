var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
app.set('port', (process.env.PORT || 5050));
app.use(express.json({limit: '50mb'}));

app.use(express.json());
app.use(express.urlencoded());


// variables, move to envt file
var url = 'mongodb://user90bd44:821bc8LIkumxQc01be9@cluster-pgrs1001-0-us-east-1-scalabledbs.cloudstrap.io:29001,cluster-pgrs1001-1-us-east-1-scalabledbs.cloudstrap.io:29001,cluster-pgrs1001-2-us-east-1-scalabledbs.cloudstrap.io:29001/pg-app-2-us-u8e29vmtak05z6erwl2vcuhukq5trh?replicaSet=pgrs1001&ssl=true';
// Database Name
const dbName = 'pg-app-2-us-u8e29vmtak05z6erwl2vcuhukq5trh';

// development only
if ('development' == app.get('env')) {
  //app.use(express.errorHandler());
}


app.get('/', (req, res) => {
    res.send('hey, whats up!');
});

app.post('/', (req, res) => {
    res.send('were watching!');
});


// create a function for each microservice.
// we will move these to separate files so they can be worked / supported independently.
async function customerList() {
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); });
    if (!client) {
        return;
    }
    try {
        const db = client.db(dbName);
        let collection = db.collection('Customer');
        let query = {}; // query holds any query, filter logic.
        let res = await collection.find(query).toArray();

        // format response here... mapping.
        console.log(res);
        return res;
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}

// move this to another file eventually and add error handling.
async function customerRead(customerId) {
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); });
    if (!client) {
        return;
    }
    try {
        const db = client.db(dbName);
        let collection = db.collection('Customer');
        let query = { 'CustomerId': customerId }
        let res = await collection.findOne(query);
        console.log(res);
        return res;
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}

app.get('/CustomerList', async function(req, res) {

  // Use connect method to connect to the server
  let results = await customerList();
  res.send(results);

});


app.get('/CustomerRead', async function(req, res) {

  var customerId = req.query.customer; //no longer needed, as we get all materials
  console.log('customer id is', customerId);
  // Use connect method to connect to the server
  let results = await customerRead(customerId);
  res.send(results);

});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
