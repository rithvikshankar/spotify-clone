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
};

const main = async () => {
  let songs = await getSongs();
  // console.log(songs);

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
  play.addEventListener("click", () => {
    if (currentSong.paused) {
    }
  });
};

main();
