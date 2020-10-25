

Ægir Örn Sveinsson <aegirorn@gmail.com>
Para:
Paula

dom., 25 de oct. a las 11:44 p. m.

var currentPlaylist = [];
var likedPlaylist = [];

var currentIndex = 0;         //position in the array+++++++
var audioElement;
let allSongs = new Array();


document.addEventListener("DOMContentLoaded", function(event) {
  audioElement = new Audio();  // create an instance of the Audio class
  loadSongList();             // here it loads all the songs from local storage
});


//define the function of saveSongList
function saveSongList() {   // writes the song list to local storage
  localStorage.setItem('songList', JSON.stringify(allSongs));
}



function loadSongList() {
  //get the content from local storage of key songList into a temporary variable
  var storedSongs = JSON.parse(localStorage.getItem('songList'));
  console.log(storedSongs);
 
  //if there is something stored then we update the allSongs array
  if (storedSongs != null) {
    allSongs = storedSongs;
    audioElement.setTrack(allSongs[0],false);
    //using the allSongs button to load the DOM
    allSongsBtn.click();
  }
}


//***************wrapper around HTML audio tag*******************************************

//Audio is a javascript class
function Audio() {

this.currentlyPlaying;
  this.audio = document.createElement('audio');
  //when the song is ended goes to the next song in the
  this.audio.addEventListener("ended", function() {
nextSong();
});

  //track is a song
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
 
  //this function can be used to put the song to the beginning
  //this can be used for the Progress Bar, posibly by moving it to the middle
  //and the song will start from there
  this.setTime = function(seconds) {
this.audio.currentTime = seconds;
}
}
//************************************************************************* */

//TrackID is the position of a song in an array
function setTrack(trackId, play) {
  pauseSong();

  //updates the index of the current song with a new value
  currentIndex = currentPlaylist.indexOf(trackId);
  var track = currentPlaylist[currentIndex];

  audioElement.setTrack(track);

  if(play == true) {
    audioElement.play();
  }
}

function prevSong() {
  //if the song has been playing for more than 3 seconds or the first song in the list the previous btn
  //will set the song to the beginning,
  if(audioElement.audio.currentTime >= 3 || currentIndex == 0) {
audioElement.setTime(0);
  }
 
  //if the song has been playing for less than 3 seconds will go to the previous song
else {
    currentIndex = currentIndex - 1;
  }

  var trackToPlay = currentPlaylist[currentIndex];
//set  current track to previous song and play it
  setTrack(trackToPlay, true);
  updatePlayButtonImages(true);
}

function nextSong() {
//if current song is the last song , next song will be the first song
//it goes back in the list
if(currentIndex == currentPlaylist.length - 1) {
currentIndex = 0;
}
else {
currentIndex = currentIndex + 1;
  }
 
var trackToPlay = currentPlaylist[currentIndex];
  setTrack(trackToPlay, true);
  updatePlayButtonImages(true);
}


function playSong() {
  audioElement.play();

  updatePlayButtonImages(true);
}


//pauses the currently playing song and updates icons of play and pause
function pauseSong() {
    audioElement.pause();
    updatePlayButtonImages(false);
}


//changes the images from play to pause or viceversa
function updatePlayButtonImages(currentIsPlaying) {
  elements = document.getElementsByClassName("newSongPlayBtn");
  //this loop will go though the button images in the list and set it to play icon
  //all of them
 
    for (var i = 0; i < elements.length; i++) {
        elements[i].src="https://i.ibb.co/j59Mq8R/songlist-Play.png";
    }
   //gets the play btn in the footer
    var btnImage = document.getElementById("playBtnImg");
    //find the current song
    var selectedSong = currentPlaylist[currentIndex];

// finds the ID of the button image of selected song
    var currentBtnId  = "SongPlayBtn"+ selectedSong.songId
    var currentButton = document.getElementById(currentBtnId);

    if(currentIsPlaying){
// if the song is playing set button to pause
//list
       currentButton.src = "https://i.ibb.co/tM331H6/songlist-Pause.png";

       //footer
       btnImage.src = "../img/pause.png";
    }
    else {
      currentButton.src = "https://i.ibb.co/j59Mq8R/songlist-Play.png";

      //footer
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

    //plus 1
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

  //each play button in the list will get a separate ID
  newSongPlayBtn.id = "SongPlayBtn" + song.songId
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

    //ID for the hearts to update the image when click

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
  //getting the selected song
  const selctedSong = currentPlaylist[selectedIndex];

  //set the selected objects liked value to whatevers its not
  allSongs[selectedIndex].liked = !allSongs[selectedIndex].liked;
  //filters the songs liked and updates the likedPlayList
  likedPlaylist = allSongs.filter((song) => song.liked == true);
 
  //find the heart icon and if it is liked set the icon to red, else to empty
  var heartIcon  = document.getElementById("SongHeart" + selctedSong.songId);
  heartIcon.src = selctedSong.liked
     ? "https://i.ibb.co/sWv1GY8/heart-Full.png"
     : "https://i.ibb.co/5xt3Wnh/heart.png";
  console.log("Song liked/unliked.");

  //saves changes to local storage
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
  //reset the all songs because a song has been removed
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

//disable is true if the play list is empty
//from the footer
function updatePlaybarButtonsDisabledState() {
  const disabled = currentPlaylist.length == 0;

  document.getElementById("playbarBtnBack").disabled = disabled;
  document.getElementById("playbarBtnPlay").disabled = disabled;
  document.getElementById("playbarBtnForward").disabled = disabled;
}




