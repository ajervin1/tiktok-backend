import mongoose from 'mongoose'
const mongoUrl = "mongodb+srv://ajervin:dunk7onu@maincluster.hhnou26.mongodb.net/tiktokdatabase?retryWrites=true&w=majority&appName=MainCluster";


mongoose.connect(mongoUrl, { });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('Database connected successfully');
});
export default db

