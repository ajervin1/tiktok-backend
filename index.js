
import express from 'express'
import bodyParser from "body-parser";
import cors from 'cors';
import morgan from 'morgan'; // Import Morgan

import db from './db.js'

import routes from './routes/routes.js'

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev')); // Use Morgan with 'dev' format
app.use(cors());
app.use('/', routes);
app.get('/', (req,res) => {
	res.send("hell world")
})

app.listen(8000, () => {
	console.log('Server started on port 8000');
});

