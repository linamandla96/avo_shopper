const express = require('express');
const exphbs  = require('express-handlebars');
const pg = require('pg');
let avocadoshops = require("./avo-shopper");


const app = express();
const PORT =  process.env.PORT || 3019;

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

const Pool = pg.Pool;
require('dotenv').config()

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}


const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/greeting_app',
    ssl: {
        useSSL,
        rejectUnauthorized: false
    }
});

// add more middleware to allow for templating support

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
let counter = 0;

const avocado = avocadoshops(pool) 
app.get('/', async function(req, res) {
	
		const avocados = await avocado.topFiveDeals()
	res.render('index', {
		avocados
	});
	
	
});

app.get('/listavoshop', async function(req, res){
	
		const avocadolist = await avocado.listShops()
	res.render('shoplist',{
		avocadolist
	});
	
	
});
app.get('/addavo', async function(req,res){
	    await avocado.dealsForShop()
		res.render('show-avolist');
	
	
})


app.post('/avodeals', async function(req,res){
	
		console.log(req.body.shop_name)
	 await avocado.createShop(req.body.shop_name)

	res.render('show-avolist');
	
	
})









// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function() {
	console.log(`AvoApp started on port ${PORT}`)
});