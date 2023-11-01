let currentLocation = null;

const checkpoints = [
    {
        latitude: 37.76330191194163,
        longitude: -122.43706560688697,
        radius: 10, // in meters
        audio: './audios/audio1.mp3'
    },
    {
        latitude: 37.763335838547796,
        longitude: -122.43694088416595,
        radius: 10,
        audio: './audios/audio2.mp3'
    },
    {
        latitude: 37.76336100554575,
        longitude: -122.43659344258074,
        radius: 10,
        audio: './audios/audio3.mp3'
    },
    {
        latitude: 37.76330982030606,
        longitude: -122.43614628631695,
        radius: 10,
        audio: './audios/audio4.mp3'
    },
    {
        latitude: 37.76335001620028,
        longitude: -122.43538762723672,
        radius: 10,
        audio: './audios/audio5.mp3'
    },
    {
        latitude: 37.762932684480795,
        longitude: -122.43533704006848,
        radius: 10,
        audio: './audios/audio6.mp3'
    },
    {
        latitude: 37.76266345935579,
        longitude: -122.43490246100194,
        radius: 10,
        audio: './audios/audio7.mp3'
    }
];

document.getElementById('grantLocationAccess').addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }

    function success(position) {
        currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        document.getElementById('currentLocation').textContent = `${currentLocation.latitude}, ${currentLocation.longitude}`;
        checkIfWithinCheckpoint();
    }

    function error() {
        alert('Unable to retrieve your location');
    }

    navigator.geolocation.getCurrentPosition(success, error);
});

function checkIfWithinCheckpoint() {
    if (!currentLocation) return;

    checkpoints.forEach(checkpoint => {
        const distance = getDistanceBetweenPoints(
            currentLocation.latitude, currentLocation.longitude,
            checkpoint.latitude, checkpoint.longitude
        );

        if (distance <= checkpoint.radius) {
            // Play the audio
            new Audio(checkpoint.audio).play();
        }
    });
}

function getDistanceBetweenPoints(lat1, lon1, lat2, lon2) {
    // This function calculates the distance between two geo-points using the Haversine formula
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Return distance in meters
}

let watcher = null;

function startTracking() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }

    watcher = navigator.geolocation.watchPosition((position) => {
        currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        document.getElementById('currentLocation').textContent = `${currentLocation.latitude}, ${currentLocation.longitude}`;
        checkIfWithinCheckpoint();
    });
}

document.getElementById('startRun').addEventListener('click', startTracking);
