import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors());
app.use(express.json());

const participants = [];

app.get("/", (req, res) => { 
    res.send();
})

app.post('/participants', (req, res) => {
    const username = req.body.name;
    if (username === ''){
        res.sendStatus(400);
    }
    else if (participants.find(user => user.name === username)){
        res.sendStatus(403)
    }
    else {
        participants.push({name: username, lastStatus: Date.now()})
        res.sendStatus(200);
    }
})

app.listen(4000);