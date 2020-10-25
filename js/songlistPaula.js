var currentPlaylist = [];
var likedPlaylist = [];

var currentIndex = 0;
var audioElement;
let allSongs = new Array();

$(document).ready(function() {
  audioElement = new Audio();
  loadSongList();
});

function saveSongList() {
  localStorage.setItem('songlist', JSON.stringify(allSongs)); 
}

function loadSongList() {
  var storedSongs = JSON.parse(localStorage.getItem('songlist'));
  
  if (storedSongs != null) {
    allSongs = storedSongs;
    audioElement.setTrack(allSongs[0],false);
    allSongsBtn.click();
  }
}

function Audio() {

	this.currentlyPlaying;
  this.audio = document.createElement('audio');
  
  this.audio.addEventListener("ended", function() {
		nextSong();
	});

	this.setTrack = function(track) {
		this.currentlyPlaying = track;
		this.audio.src = track.path;
	}

	this.play = function() {
    this.audio.play();
	}

	this.pause = function() {
		this.audio.pause();
  }
  
  this.setTime = function(seconds) {
		this.audio.currentTime = seconds;
	}
}

function setTrack(trackId, play) {
  pauseSong();
  currentIndex = currentPlaylist.indexOf(trackId);
  var track = currentPlaylist[currentIndex];

  audioElement.setTrack(track);

  if(play == true) {
    audioElement.play();
  }
}

function prevSong() {
  if(audioElement.audio.currentTime >= 3 || currentIndex == 0) {
		audioElement.setTime(0);
	}
	else {
    currentIndex = currentIndex - 1;
  }

  var trackToPlay = currentPlaylist[currentIndex];
  setTrack(trackToPlay, true);
  updatePlayButtonImages(true);
}

function nextSong() {

	if(currentIndex == currentPlaylist.length - 1) {
		currentIndex = 0;
	}
	else {
		currentIndex++;
  }
  
	var trackToPlay = currentPlaylist[currentIndex];
  setTrack(trackToPlay, true);
  updatePlayButtonImages(true);
}


function playSong() {
  audioElement.play();

  updatePlayButtonImages(true);
}



function pauseSong() {
    audioElement.pause();
    updatePlayButtonImages(false);
}

function updatePlayButtonImages(currentIsPlaying) {
  elements = document.getElementsByClassName("newSongPlayBtn");
    for (var i = 0; i < elements.length; i++) {
        elements[i].src="https://i.ibb.co/j59Mq8R/songlist-Play.png";
    }

    var btnImage = document.getElementById("playBtnImg");
    var selectedSong = currentPlaylist[currentIndex];

    var currentBtnId  = "SongPlayBtn"+ selectedSong.songId
    var currentButton = document.getElementById(currentBtnId);

    if(currentIsPlaying){

       currentButton.src = "https://i.ibb.co/tM331H6/songlist-Pause.png";
       btnImage.src = "../img/pause.png";
    }
    else {
      currentButton.src = "https://i.ibb.co/j59Mq8R/songlist-Play.png";
      btnImage.src = "../img/play.png";
    }
}

//SONG LIST

const songList = document.querySelector(".songList");

function addNewSong(songSrc) {
  // Define the emoji data
  let song = {
    cover:
      "https://upload.wikimedia.org/wikipedia/en/a/a6/Schoolboy_Q_-_Crash_Talk.png",
    isPlaying: false,
    artist: "Daddy Yankee",
    title: "terremoto",
    liked: false,
    songId: allSongs.length + 1,
    audio: songSrc,
    path: songSrc
  };
  // Add it to the allSongs array
  allSongs.push(song);

  console.log("Song added to array");
  addSongToDom(song);

  saveSongList();

  if(allSongs.length == 1)
  setTrack(song, false);
}

let addSongToDom = function (song) {
  // Add it to the DOM
  let newSong = document.createElement("div");
  newSong.classList.add("newSong");
  songList.appendChild(newSong);

  newSong.setAttribute("data-index", song.songId -1);

  //song cover
  let newSongCover = document.createElement("img");
  newSongCover.classList.add("newSongCover");
  newSongCover.src = song.cover;
  newSong.appendChild(newSongCover);

  //play button
  let newSongPlayBtn = document.createElement("img");
  newSongPlayBtn.src = "https://i.ibb.co/j59Mq8R/songlist-Play.png";
  newSongPlayBtn.id = "SongPlayBtn"+ song.songId
  newSongPlayBtn.classList.add("newSongPlayBtn");
  newSong.appendChild(newSongPlayBtn);
  newSongPlayBtn.addEventListener("click", playOrPauseSelectedSong);

  //song artist and title div
  let newSongInfo = document.createElement("div");
  newSongInfo.classList.add("newSongInfo");
  newSong.appendChild(newSongInfo);

  //artist
  let newSongArtist = document.createElement("h3");
  newSongArtist.innerHTML = song.artist;
  newSongInfo.appendChild(newSongArtist);

  //title
  let newSongTitle = document.createElement("h4");
  newSongTitle.innerHTML = song.title;
  newSongInfo.appendChild(newSongTitle);

  //icons div
  let newSongIcons = document.createElement("div");
  newSongIcons.classList.add("icons");
  newSong.appendChild(newSongIcons);

  let newSongHeart = document.createElement("img");
  newSongHeart.classList.add("heart");
  newSongHeart.src = song.liked
    ? "https://i.ibb.co/sWv1GY8/heart-Full.png"
    : "https://i.ibb.co/5xt3Wnh/heart.png";
  newSongHeart.id = "SongHeart"+ song.songId
  newSongIcons.appendChild(newSongHeart);
  newSongHeart.addEventListener("click", likeSong);

  ///TRASH BUTTON
  let newSongTrash = document.createElement("img");
  newSongTrash.classList.add("trash");
  newSongTrash.src = "https://i.ibb.co/48cHjGg/Delete.png";
  newSongIcons.appendChild(newSongTrash);
  newSongTrash.addEventListener("click", removeSong);

  //audio div
  let newSongAudio = document.createElement("audio");
  newSongAudio.classList.add("newAudio");
  newSongAudio.src = song.audio;
  newSong.appendChild(newSongAudio);
  if (song.isPlaying) {
    newSongAudio.play();
  }
  // //line div
  let newSongLine = document.createElement("div");
  newSongLine.classList.add("line");
  newSong.parentNode.appendChild(newSongLine);

  console.log("Song added or changed in DOM");

  if(allSongs.length == 1){
    currentPlaylist = allSongs;
  }

  updatePlaybarButtonsDisabledState();
};

//a function that removes all html from songlist and then puts it back in with newer data
function resetAllSongsDom() {

  loadSongList();

  document.querySelector(".songList").innerHTML = "";

  allSongs.forEach((song) => {
    addSongToDom(song);

    console.log("DOM Reset.");
  });
}

// UPLOAD BUTTONS
const realUploadBtn = document.querySelector("#real-upload");
const addSongBtn = document.querySelector("#addSongBtn");

//click the input button on click
addSongBtn.addEventListener("click", function (e) {
  e.preventDefault();
  realUploadBtn.click();
});
//when input changes (gets a file), sets the files source as songSrc and runs addNewSong with the songSrc as an argument
realUploadBtn.addEventListener("change", function (e) {
  e.preventDefault();
  const fileInput = e.target;
  let songSrc = fileInput.value;
  // the song source has a stupid file path so we

  songSrc = "../audio/" + songSrc.substring(12);
  console.log("Song uploaded.");
  addNewSong(songSrc);
});

// PLAY BUTTON


function playOrPauseSelectedSong(e) {

  const newSongIndex = e.target.parentNode.getAttribute("data-index");
  if (newSongIndex == currentIndex) {
    if(audioElement.audio.paused == false)
      pauseSong();
    else
      playSong();
  }
  else {
    currentIndex = newSongIndex;
    var trackToPlay = currentPlaylist[currentIndex];
    setTrack(trackToPlay,true);
    updatePlayButtonImages(true);
  }
}


// liked song function
//let likedSongs = [];
function likeSong(e) {
  //target the dom element of the selected objects id
  const selectedIndex = e.target.parentNode.parentNode.getAttribute("data-index");
  const selctedSong = currentPlaylist[selectedIndex];

  //set the selected objects liked value to whatevers its not
  allSongs[selectedIndex].liked = !allSongs[selectedIndex].liked;
  //filers all liked songs into an array called likedSongs
  likedPlaylist = allSongs.filter((song) => song.liked == true);
  
  var heartIcon  = document.getElementById("SongHeart" + selctedSong.songId);
  heartIcon.src = selctedSong.liked
     ? "https://i.ibb.co/sWv1GY8/heart-Full.png"
     : "https://i.ibb.co/5xt3Wnh/heart.png";
  console.log("Song liked/unliked.");

  saveSongList();
}

//remove song function
function removeSong(e) {
  //get this songs id
  const songId = e.target.parentNode.parentNode.getAttribute("data-index");
  //remove the object with the same id
  var remove = confirm(
    `Are you sure you want to delete ${allSongs[songId].title}?`
  );
  if (remove) {
    allSongs.splice(songId);
  }

  console.log("Song removed.");
  saveSongList();
  resetAllSongsDom();
  updatePlaybarButtonsDisabledState();
}

// menu

const allSongsBtn = document.querySelector("#allSongsBtn");
const likedSongsBtn = document.querySelector("#likedSongsBtn");

likedSongsBtn.addEventListener("click", function () {
  LoadPlaylists(true);
});


allSongsBtn.addEventListener("click", function () {
  LoadPlaylists(false);
});

function LoadPlaylists(filterLikedSongs){
  
  let playlist = allSongs;
  if (filterLikedSongs){
    playlist = playlist.filter((song) => song.liked == true);
  }

  currentPlaylist = playlist;
  
  document.querySelector(".songList").innerHTML = "";
  playlist.forEach((song) => {
    addSongToDom(song);
  });
}


function playbarBtnPlayOnClick() {
  var btnImage = document.getElementById("playBtnImg");
  
  if (btnImage.src.includes("play"))
  {
    playSong();
  }
  else
  {
    pauseSong();
  }
}

function updatePlaybarButtonsDisabledState() {
  const disabled = currentPlaylist.length == 0;

  document.getElementById("playbarBtnBack").disabled = disabled;
  document.getElementById("playbarBtnPlay").disabled = disabled;
  document.getElementById("playbarBtnForward").disabled = disabled;
}
