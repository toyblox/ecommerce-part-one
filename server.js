var express = require('express'),
	cors = require('cors'),
	bodyParser = require('body-parser'),
	mongojs = require('mongojs'),
	db = mongojs('products', ['shoes']);

var app = express()
var port = 8989;

app.use(bodyParser.json());
app.use(cors());

app.post('/api/shoes', function(req, res) {
	db.shoes.save(req.body, function(err, response){
		if(err){
			res.status(500).json(err); 
		} else {
			res.json(response);
			console.log('new shoe!');
		}
	})
});

app.get('/api/shoes', function(req, res) {
	var query = {};
	if(req.query.id) {
		query._id = mongoObjectId(req.query.id);
	}
	if(req.query.title) {
		query.title = req.query.title;
	}
	db.shoes.find(query, function(err, response) {
		if(err){
			res.status(500).json(err);
		} else {
			res.json(response);
			console.log('get success!');
		}
	})
});

app.put('/api/shoes', function(req, res) {
	if(!req.query.id){
		res.status(500).send('need an id yo');
	} else {
		db.shoes.findAndModify({
			query: {
				_id: mongojs.ObjectId(req.query.id)
			},
			update: {
				$set: req.body
			}
		}, function(err, response) {
			if(err) {
				res.status(500).json(err);
			} else {
				res.json(response);
				console.log('updated!');
			}
		})
	}
});

app.delete('/api/shoes', function(req, res) {
	if(!req.query.id){
		res.status(500).send('need an id yo');
	} else {
		db.shoes.remove({
			_id: mongojs.ObjectId(req.query.id)
		}, function(err, response) {
			if(err) {
				res.status(500).json(err);
			} else {
				res.json(response);
				console.log('deleted!');
			}
		})
	}
});


app.listen(port, function(){
	console.log('ready, go on', port);
})
