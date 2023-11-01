const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use('/audios', express.static('audios'));

app.get('/', (req, res) => {
    res.send('Hello from the backend server!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const runs = [];

app.get('/runs', (req, res) => {
    res.json(runs);
});

app.post('/start-run', (req, res) => {
    const run = {
        id: Date.now(),
        started: new Date(),
        checkpoints: []
    };
    runs.push(run);
    res.json(run);
});

const serverCheckpoints = [
    {
        latitude: 37.76315388023181,
        longitude: -122.43703865800339,
        audio: './audios/audio1.mp3'
    },
    {
        latitude: 37.763303634573454,
        longitude: -122.43706279788826,
        audio: './audios/audio2.mp3'
    },
    {
        latitude: 37.76269160298254,
        longitude: -122.43517363523765,
        audio: './audios/audio3.mp3'
    },
    {
        latitude: 37.76275160298254,
        longitude: -122.43523363523765,
        audio: './audios/audio4.mp3'
    },
    {
        latitude: 37.76281160298254,
        longitude: -122.43529363523765,
        audio: './audios/audio5.mp3'
    },
    {
        latitude: 37.76287160298254,
        longitude: -122.43535363523765,
        audio: './audios/audio6.mp3'
    },
    {
        latitude: 37.76293160298254,
        longitude: -122.43541363523765,
        audio: './audios/audio7.mp3'
    }
];

app.post('/reach-checkpoint', (req, res) => {
    const runId = req.body.runId;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    if (!latitude || !longitude) {
        return res.status(400).send('Latitude or longitude not specified');
    }

    const matchingCheckpoint = serverCheckpoints.find(cp => 
        cp.latitude === latitude && cp.longitude === longitude
    );

    if (!matchingCheckpoint) {
        return res.status(400).send('Matching checkpoint not found');
    }

    const checkpoint = {
        id: Date.now(),
        reached: new Date(),
        audio: matchingCheckpoint.audio
    };

    const run = runs.find(r => r.id === runId);
    if (run) {
        run.checkpoints.push(checkpoint);
        res.json(checkpoint);
    } else {
        res.status(404).send('Run not found');
    }
});
