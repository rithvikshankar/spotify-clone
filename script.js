// Global variables
let currentSong = new Audio();

const getSongs = async () => {
  let response = await fetch("http://127.0.0.1:5500/songs");
  let rawSongData = await response.text();
  // console.log(rawSongData);
  let div = document.createElement("div");
  div.innerHTML = rawSongData;
  let anchorElements = div.getElementsByTagName("a");
  // console.log(anchorElements);

  const songs = [];
  for (let i = 0; i < anchorElements.length; i++) {
    let songHref = anchorElements[i].href;
    // NOTE: CHECK THIS LATER
    if (songHref.endsWith(".mp3")) {
      songs.push(songHref.split("/songs/")[1]);
    }
  }
  return songs;
};

const playMusic = (song) => {
  // song only contains the name of the song. Need to add the directory and the extension to make it play
  // let audio = new Audio(("/songs/" + song + ".mp3").trim());
  currentSong.src = ("/songs/" + song + ".mp3").trim();
  currentSong.play();
  // change play symbol to pause after clicking a song
  playSvg.src = "/assets/pause.svg";
  document.querySelector(".song-info").innerHTML = song;
  // document.querySelector(".song-time").innerHTML = "00:00 / 00:00";
};

// To make for eg. 120 seconds into 02:00
const secondsToMMSS = (seconds) => {
  if (isNaN(seconds) || seconds < 0) {
    throw new Error("invalid duration");
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const minutesFormatted = String(minutes).padStart(2, "0");
  const secondsFormatted = String(remainingSeconds).padStart(2, "0");

  return `${minutesFormatted}:${secondsFormatted}`;
};

const main = async () => {
  let songs = await getSongs();
  // Clicking the play button without clicking any song starts playing the first song
  currentSong.src = "/songs/" + songs[0];
  document.querySelector(".song-info").innerHTML = songs[0];

  const songsUl = document
    .querySelector(".song-list")
    .getElementsByTagName("ul")[0];

  for (let song of songs) {
    // songsUl.innerHTML += `<li>${song.replace(".mp3", "")}</li>`;
    songsUl.innerHTML += `<li>
      <div class="song-details">
        <h3 class="song-name">${song.replace(".mp3", "")}</h3>
        <p class="song-artist dimmed">song Artist artist artist</p>
      </div>

      <button class="song-play-btn">
        <img
          class="song-play-btn-svg"
          src="assets/play.svg"
          alt="play"
        />
      </button>
    </li>`;
  }

  // Event listener for each song
  let songListArray = Array.from(document.querySelectorAll(".song-list li"));
  songListArray.forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".song-details").firstElementChild.innerHTML);
      playMusic(e.querySelector(".song-details").firstElementChild.innerHTML);
    });
  });

  // Event listener for play, next and previous buttons in music controls
  // Note: play, prev, and next are the IDs of the button SVGs

  play.addEventListener("click", () => {
    if (currentSong.src) {
      if (currentSong.paused) {
        currentSong.play();
        playSvg.src = "/assets/pause.svg";
        playSvg.style.transition = "transform 0.2s ease-in-out";
        playSvg.style.transform = "rotate(180deg)";
      } else {
        currentSong.pause();
        playSvg.src = "/assets/play.svg";
        playSvg.style.transition = "transform 0.2s ease-in-out";
        playSvg.style.transform = "rotate(0deg)";
      }
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    const songTime = document.querySelector(".song-time");
    const songDuration = document.querySelector(".song-duration");
    const seekbarProgress = document.querySelector(".seekbar-progress");

    // Converting seconds to the 00:00 format
    songTime.innerHTML = `${secondsToMMSS(currentSong.currentTime)}`;
    songDuration.innerHTML = `${secondsToMMSS(currentSong.duration)}`;

    // Time and duration are hidden by default until a song plays
    songTime.style.opacity = "1";
    songDuration.style.opacity = "1";

    // Updating seekbar
    seekbarProgress.style.width =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // getBoundingClientRect gets the actual width of the seekbar. Using it to seek to a particular point in the song by dividing the offsetX by the width of the seekbar.
  const seekbar = document.querySelector(".seekbar");
  seekbar.addEventListener("click", (e) => {
    let seekbarPercent =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    // Updating the seekbar progress UI
    document.querySelector(".seekbar-progress").style.width =
      seekbarPercent + "%";

    let newTime = (currentSong.duration * seekbarPercent) / 100;
    if (newTime < currentSong.currentTime) {
      // If the new time is less than the current time, we are seeking backward
      currentSong.currentTime = newTime;
    }
    // Updating the actual song time
    // Note: Doesn't seem to be working perfectly. Issue usually occurs when I click slightly to the left of where the progress currently is.
    currentSong.currentTime = (currentSong.duration * seekbarPercent) / 100;
  });

  // Event listener for hamburger menu on mobile devices
  const hamburger = document.querySelector(".hamburger");
  hamburger.addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
};

main();
