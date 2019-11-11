const assert = require('assert');
const express = require('express');
const MongoClient = require("mongodb").MongoClient;
//const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const bcrypt = require('bcryptjs')

//const url = "mongodb+srv://ayushk:ayush12345@cluster0-zkrdw.mongodb.net/test?retryWrites=true&w=majority"
const url = "mongodb://ayushk:ayush12345@ds141238.mlab.com:41238/heroku_9m25szr2"
const client = new MongoClient(url, { useNewUrlParser: true });
var collection = null;
client.connect(function(err) {
	if (err) throw err;
	collection = client.db("heroku_9m25szr2").collection("users");
});

function insertUserIntoDB(user) {
	collection.insertOne(user, function(err, res) {
		if (err) throw err;
		console.log("1 document inserted");
	});
	return "success";
}
// We're still in server.js! Right below everything else.

// Starting our app.
const myserver = express();
myserver.use(bodyparser.urlencoded({ extended: false }));
myserver.use(bodyparser.json());


myserver.post('/', function (req, res) {
	//handle post requests here
	console.log(req.body)
	if (req.body.authentication == "LoginAuth") {
		res.setHeader('Content-Type', 'application/json');
		let response = {authenticated:0, firstname:"", lastname:"",};
		console.log("Attempting LoginAuth");
		console.log("Searching for username : "+req.body.username);
		collection.find({username:req.body.username}).toArray(function(err, docs) {
			assert.equal(err, null);
			if (docs.length > 0) {
				console.log("Found username : "+req.body.username);
				if (bcrypt.compareSync(req.body.password, docs[0].password)) {
					console.log("Login Authenticated!");
					response.authenticated = 1;
					response.firstname = docs[0].firstname;
					response.lastname = docs[0].lastname;
					response.location = docs[0].location;
				} else {
					console.log("Login Failed! Password Incorrect");
					response.authenticated = -1;
				}
			} else {
				console.log("Login Failed! Couldn't find username: "+req.body.username);
				response.authenticated = -2;
			}
			res.end(JSON.stringify(response));
		})
	} else if (req.body.authentication == "SignupAuth") {
		//signup the new user and send him an email
		res.setHeader('Content-Type', 'application/json');
		let response = {authenticated:0};
		console.log("Attempting SignupAuth");
		console.log("Searching for username : "+req.body.username);
		collection.find({username:req.body.username}).toArray(function(err1, docs1) {
			assert.equal(err1, null);
			if (docs1.length > 0) {
				console.log("Found username : "+req.body.username);
				console.log("Signup Failed! Username not available!");
				response.authenticated = -2;
			} else {
				console.log("Username available!");
				console.log("Creating new account...");
				insertUserIntoDB({
					firstname:req.body.firstname,
					lastname: req.body.lastname,
					username: req.body.username,
					password: bcrypt.hashSync(req.body.password, 10),
					gender:   req.body.gender,
					phone:    req.body.phone,
				});
				response.authenticated = 1;
			}
			res.end(JSON.stringify(response));
		})
	} else {
		res.end("Unknown Authentication Type!");
	}
    //handle the request and send the response
});

function getDistance(lat1, long1, lat2, long2) {
	//finds the distance betweent two people situated at (lat1, long1) and (lat2, long2)
	//uses Haversine formulat o calculate the distance
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(long2-long1); 
	var a = 
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
		Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	return d;
}

function deg2rad(deg) {
	return deg * (Math.PI/180)
}

myserver.get('/searchnearby', function (req, res) {
	//when handling a get request use req.query instead of req.body
	console.log("Searching for people nearby...");
	console.log("Setting search radius as "+req.query.searchradius+"kms...");
	res.setHeader('Content-Type', 'application/json');
	collection.find({}).toArray(function(err, docs) {
		assert.equal(err, null);
		//iterate over the array to find people lying in radius
		let nearbyusers = new Array();
		docs.forEach(element => {
			if (req.query.username == element.username) return;
			if (element.location == undefined) return;
			console.log("Found someone around you: "+element.username);
			let dist = getDistance(req.query.latitude, req.query.longitude, 
				element.location.latitude, element.location.longitude);
			console.log("Distance calculated: "+dist);
			if (dist <= req.query.searchradius) {
				nearbyusers.push(element);
			}
		});
		console.log(nearbyusers.length+" "+(nearbyusers.length == 1 ? "person" : "people")+" found around you!");
		console.log(nearbyusers);
		res.end(JSON.stringify({nearbyusers: nearbyusers,}));
	});
});

myserver.get('/search', function(req, res) {
	console.log("Searching for requested user(s)...");
	console.log(req.query.username);
	res.setHeader('Content-Type', 'application/json');
	if (req.query.username != null) {
		collection.findOne({username: req.query.username}, {})
		.then(result => {
			if (result) {
				console.log("Found requested user!");
				console.log(result);
				result.error= 0;
				res.end(JSON.stringify(result));
			} else {
				console.log("The requested user was not found!");
				res.end(JSON.stringify({error: 1}));
			}
		})
		.catch(err => console.error(err));
	} else {
		//search by firstname and lastname instead
		res.end({});
	}
});

myserver.post('/updatelocation', function (req, res) {
	console.log("Updating user's location...");
	console.log("Username: "+req.body.username+", Latitude: "+req.body.latitude+", longitude: "+req.body.longitude);
	res.setHeader('Content-Type', 'application/json');
	collection.findOneAndUpdate(
		{username: req.body.username}, // query
		{$set: {location: {latitude: req.body.latitude, longitude: req.body.longitude,}}}, // replacement, replaces only the field "hi"
		{}, // options
		function(err, object) {
			if (err){
				res.end(JSON.stringify({updated: false}));
				console.err(err.message);  // returns error if no matching object found
			}else{
				res.end(JSON.stringify({updated: true}));
				console.log("Successfully updated user location!");
				console.log("New user location: "+object.value.location);
			}
		}
	);
});

myserver.get('/', function(req, res) {
	/*
	let hash = bcrypt.hashSync('hahaha', 10);
	user = {
		firstname: "Ayush",
		lastname: "Kumar",
		email: "ayushk@iitk.ac.in",
		username: "ayushk",
		password: hash,
		gender: "male",
	}
	console.log(insertUserIntoDB(user));
	*/
	//It is recommended not to close the client. When the server closes,
	//the client will automatically close.
	//client.close();
	res.end("Hello");
})

// Starting our server.
myserver.listen(8080, () => {
    console.log('Go to http://localhost:8080/ so you can see the data.');
});


