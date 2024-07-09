
import express from 'express'
import bodyParser from "body-parser";
import cors from 'cors';
import db from './db.js'
import routes from './routes/routes.js'

const app = express();

app.use(bodyParser.json());

app.use(cors());
app.use('/', routes)

app.listen(8000, () => {
	console.log('Server started on port 8000');
});

