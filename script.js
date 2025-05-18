const nowPlaying = document.querySelector(".now-playing");
const trackArt = document.querySelector(".track-art");
const trackName = document.querySelector(".track-name");
const trackArtist = document.querySelector(".track-artist");

const pauseButton = document.querySelector(".pause-track");
const stopButton = document.querySelector(".stop-track");
const nextButton = document.querySelector(".next-track");
const prevButton = document.querySelector('.prev-track');
const playButton = document.querySelector(".play-track");

const seekSlider = document.querySelector(".seek-slider");
const volumeSlider = document.querySelector(".track-volume");
const currentTrackTime = document.querySelector(".current-time");
const totalTrackTimeDuration = document.querySelector(".total-duration");

//Global Value
let trackIndex = 0;
let isPlaying = false;
let updateTimer; // For holding interval ID

// For audio
let currentTrack = document.createElement('audio');
let trackList = [
    {
        name: 'Fly Me to The Moon',
        artist: 'Frank Sinatra',
        image: 'Image/Frank_Sinatra.jpg',
        path: 'Audio/FlyMeToTheMoon_FrankSinatra.m4a'
    },
    {
        name: 'My Way',
        artist: 'Frank Sinatra',
        image: 'Image/Frank_Sinatra.jpg',
        path: 'Audio/MyWay_FrankSinatra.m4a'
    },
    {
        name: 'Raindrops Keep Faling on My Head',
        artist: 'B.J. Thomas',
        image: 'Image/BJ_Thomas.jpg',
        path: 'Audio/RaindropsKeepFallinOnMyHead_BJThomas.m4a'
    }
]

// To check the path for audio files
const path = new Audio(trackList[0].path);
path.onerror = () => console.log("❌ Audio file does NOT exist or cannot be loaded.");
path.oncanplaythrough = () => console.log("✅ Audio file exists and can be played.");

// This part only for test
// [pauseButton, stopButton, nextButton, prevButton, playButton].forEach(button => {
//     button.addEventListener('click', () => {
//         alert('button is clicked')
//     })
// })

const resetTrackValues = () => {// To reset track duration
    currentTrackTime.textContent = '00:00';
    totalTrackTimeDuration.textContent = '00:00';
    seekSlider.value = '0';
}

const loadTrack = (index) => {
    //To clear previous seek timer
    clearInterval(updateTimer);
    resetTrackValues();

    //To load new track
    currentTrack.src = trackList[index].path;
    currentTrack.load();

    //To update the deatails of the track

    //img.trackArt = trackList[index].image;
    /* var img = document.createElement("img");
    img.src = trackList[index].image;
    var src = document.getElementById("headMe");
    src.appendChild(img); */

    trackArt.classList.add("opacity-0");
    // Wait for the fade-out transition to complete before changing the image
    setTimeout(() => {
        trackArt.style.backgroundImage = "url('" + trackList[index].image + "')";

        // Fade the element back in
        trackArt.classList.remove("opacity-0");
    }, 500);

    trackName.textContent = trackList[index].name;
    trackArtist.textContent = "By " + trackList[index].artist;
    nowPlaying.textContent = "Playing " + (index + 1) + " of " + trackList.length;



    //For updating seekSlider
    updateTimer = setInterval(seekUpdate, 1000) //seekUpdate function will be added later

    //Set up interval timer for seek bar updates but only set the timer *after* metadata is loaded to get duration
    currentTrack.addEventListener('loadedmetadata', () => {
        seekUpdate()
        // Call once immediately to show duration and to clear any *existing* timer again before setting a new one (safety measure)
        clearInterval(updateTimer);
        updateTimer = setInterval(seekUpdate, 1000)
    })

    currentTrack.removeEventListener('ended', nextTrack);
    currentTrack.addEventListener('ended', nextTrack);

    //Apply random background color
    //addRandomBackgroundColor() //This will be added later

    console.log(`Loading track ${index + 1}: ${trackList[index].name}`);
}

/* const addRandomBackgroundColor = () => {
    // Get a random number between 64 to 256
    // (for getting lighter colors)
    let red = Math.floor(Math.random() * 256) + 64;
    let green = Math.floor(Math.random() * 256) + 64;
    let blue = Math.floor(Math.random() * 256) + 64;

    // Construct a color with the given values
    let bgColor = "rgb(" + red + ", " + green + ", " + blue + ")";

    // Set the background to the new color
    document.body.style.background = bgColor;
} */

const playPauseTrack = () => {
    if (!isPlaying) playTrack()
    else pauseTrack();
}

const playTrack = () => {
    currentTrack.play().then(() => {
        isPlaying = true;
        console.log('Track is Played')

        playButton.style.display = 'none';
        pauseButton.style.display = 'inline-block'

    }).catch(error => {
        console.error("Error playing track", error)
        isPlaying = false
    });

    // Need to add a function to switch between play, pause, and stop button
}

const pauseTrack = () => { //Pause loaded track
    currentTrack.pause();
    isPlaying = false;
    console.log("Track is Paused")

    playButton.style.display = 'inline-block';
    pauseButton.style.display = 'none'
}

const stopTrack = () => {
    currentTrack.pause();
    currentTrack.currentTime = 0;
    isPlaying = false;
    playButton.style.display = 'inline-block';
    pauseButton.style.display = 'none';
    seekSlider.value = 0;
    currentTrackTime.textContent = "00:00";
    console.log("Track stopped");
}

const nextTrack = () => {
    if (trackIndex < trackList.length - 1) {
        trackIndex += 1;
    } else {
        trackIndex = 0;
    }
    loadTrack(trackIndex);
    playTrack();
}

const prevTrack = () => {
    if (trackIndex > 0) {
        trackIndex -= 1;
    } else {
        trackIndex = trackList.length - 1;
    }
    // Load and play new track
    loadTrack(trackIndex);
    playTrack();
}

// These are for button section
const seekTo = () => {
    // Seek position is from the percentage of the seek slider and get the relative duration to the track
    if (!isNaN(currentTrack.duration)) {
        let seekTime = currentTrack.duration * (seekSlider.value / 100);
        currentTrack.currentTime = seekTime;
    }

}

const setVolume = () => {
    currentTrack.volume = volumeSlider.value / 100;
}

const seekUpdate = () => {
    let seekPosition = 0;

    // To check if current track can be played
    if (!isNaN(currentTrack.duration)) {
        seekPosition = currentTrack.currentTime * (100 / currentTrack.duration);
        seekSlider.value = seekPosition;

        // To calculate the time left of the track from a whole track duration
        let currentMinutes = Math.floor(currentTrack.currentTime / 60);
        let currentSeconds = Math.floor(currentTrack.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(currentTrack.duration / 60);
        let durationSeconds = Math.floor(currentTrack.duration - durationMinutes * 60);

        // adding "zero" to the single digit time value
        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        // Display the updated track duration
        currentTrackTime.textContent = currentMinutes + ":" + currentSeconds;
        totalTrackTimeDuration.textContent = durationMinutes + ":" + durationSeconds;
    } else {
        resetTrackValues()
    }

}

// --- Event Listeners ---
playButton.addEventListener('click', playTrack);
pauseButton.addEventListener('click', pauseTrack);
stopButton.addEventListener('click', stopTrack); // Added listener for stop
nextButton.addEventListener('click', nextTrack);
prevButton.addEventListener('click', prevTrack);
// trackArt.addEventListener('click',
//     isPlaying ? pauseTrack : playTrack
// )

seekSlider.addEventListener('input', seekTo); // 'input' for smoother seeking while dragging
volumeSlider.addEventListener('input', setVolume); // 'input' for immediate volume change feedback

loadTrack(trackIndex)

//This the last