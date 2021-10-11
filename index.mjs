import cors from 'cors';
import dayjs from 'dayjs';
import express from 'express';

const app = express();
app.use(cors());
app.use(express.json());

const participants = [];
const messages = [];

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

app.get('/participants', (req, res) => { 
    res.send(participants);
})

app.post('/messages', (req, res) => {
    const {to, text, type} = req.body;
    const time = dayjs().format('HH:mm:ss');
    const from = req.headers['user'];
    messages.push({to, text, type, time, from})
    console.log(messages)
    res.sendStatus(200);
})

app.listen(4000);