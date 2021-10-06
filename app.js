import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'

// ROUTER
import router from './routes/video';


const app = express();
const __dirname = path.resolve();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use('/api/video', router);



app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/view/index.html'));
});


app.listen(5000, () => {
	console.log("Server is listening");
});
