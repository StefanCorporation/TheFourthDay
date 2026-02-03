import express from 'express';
import morgan from 'morgan';
import axios from 'axios';
import bodyParser from 'body-parser';



const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({extended:true}));


app.get('/', async (req, res) => {
    
    res.render('index.ejs')
})



app.listen(port, () => {
    console.log(`Server listening in ${port} port!`)
})