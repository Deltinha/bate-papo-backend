import cors from 'cors';
import dayjs from 'dayjs';
import express from 'express';

const app = express();
app.use(cors());
app.use(express.json());

let participants = [];
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

    res.sendStatus(200);
})

app.get('/messages', (req, res) => {
    const limit = req.query.limit;
    const from = req.headers['user'];

    res.send(messages)
})

app.post('/status', (req, res) => {
    const user = req.headers['user']
    if (!participants.find(participant => participant.name === user)){
        res.sendStatus(400)
    }
    else {
        const index = participants.findIndex(participant => participant.name === user);
        participants[index].lastStatus = Date.now();
        res.sendStatus(200);
    }
})

setInterval(()=>{
    const toRemove = participants.filter((participant)=> Date.now() - participant.lastStatus > 10000)
    participants = participants.filter((participant)=> Date.now() - participant.lastStatus <= 10000)
    toRemove.forEach(participant => {
        messages.push({from: participant.name, to: 'Todos', text: 'sai da sala...', type: 'status', time: dayjs().format('HH:mm:ss')})
    });
},15000)

app.listen(4000);