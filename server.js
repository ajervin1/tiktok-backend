
import express from 'express'
import bodyParser from "body-parser";
import db from './db.js'
import routes from './routes/routes.js'
const app = express();

app.use(bodyParser.json());


app.use('/', routes)

app.listen(3000, () => {
	console.log('Server started on port 3000');
});

