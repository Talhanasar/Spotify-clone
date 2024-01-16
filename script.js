let currentSong = new Audio();
let isDragging = false;
let circle = document.querySelector('.circle');
let seekbar = document.querySelector('.seekbar');
let songs = [];

function getTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid input";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.ceil(seconds % 60);

  const min = String(minutes).padStart(2, '0');
  const sec = String(remainingSeconds).padStart(2, '0');

  return `${min}:${sec}`;
}

async function getSongs() {
  let a = await fetch('https://github.com/Talhanasar/Spotify-clone/tree/main/songs');
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName('a');
  let songs = [];
  for (const elem of as) {
    if (elem.href.endsWith('.mp3')) {
      songs.push(elem.href.split('/songs/')[1]);
    }
  }
  return songs;
}

const Playmusic=(track,pause = false)=>{
  currentSong.src = "https://github.com/Talhanasar/Spotify-clone/tree/main/songs/"+track
  if(!pause){
    currentSong.play();
    play.src = 'icon/pause.svg';
  }
  document.querySelector('.song-info').innerHTML = decodeURI(track);
  document.querySelector('.song-time').innerHTML = "00:00 / 00:00"
}

async function main() {
  // get the list of all songs 
  songs = await getSongs();
  Playmusic(songs[0], true); 
  

  // Adding songs to the playlist 
  let songul = document.querySelector('.song-list').getElementsByTagName('ul')[0];
  for (const song of songs) {
      songul.innerHTML = songul.innerHTML + `<li>
      <img class="invert" src="icon/song.svg" alt="">
      <div class="info">
          <div class="txt">${decodeURI(song)} </div>
          <div>Talha</div>
      </div>
      <div class="play-now">
          <span>Play now</span>
          <img class="invert" src="icon/play.svg" alt="">
      </div>
    </li>`;
  }

  // play the song  when clicked 
  Array.from(document.querySelector('.song-list').getElementsByTagName('li')).forEach(elem => {
    elem.addEventListener('click',()=>{
      console.log(elem.querySelector('.info').firstElementChild.innerHTML);
      Playmusic(elem.querySelector('.info').firstElementChild.innerHTML.trim());
    })
  });

  // Attach EventListener to change the pause and play icon 
  play.addEventListener('click',()=>{
      if(currentSong.paused){
        currentSong.play();
        play.src ="icon/pause.svg";
      }
      else{
        currentSong.pause();
        play.src ="icon/play.svg";
      }
  })

  // Listen for timeupdate event 
  currentSong.addEventListener('timeupdate',()=>{
    document.querySelector('.song-time').innerHTML = `${getTime(currentSong.currentTime)} / ${getTime(currentSong.duration)}`;
    circle.style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
  });

  // Adding eventlistener for seekbar
  function seekbar_click(e){
    let percent =  (e.offsetX/e.target.getBoundingClientRect().width)*100;
    circle.style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration)*(percent/100);
  }
  seekbar.addEventListener('click',seekbar_click);

  // Adding eventlistener for hamburger 
  document.querySelector('.hamburger').addEventListener('click',()=>{
    document.querySelector('.left').style.left = '0';
  })

  // Adding eventlistener for cross 
  document.querySelector('.cross').addEventListener('click',()=>{
    document.querySelector('.left').style.left = '-100%';
  })

  // Adding eventlistener for previous button 
  prev.addEventListener('click',()=>{
    let index = songs.indexOf(currentSong.src.split('songs/')[1]);
    if((index-1)>0){
      Playmusic(songs[index-1]);
    }
  })

  // Adding eventlistener for next button 
  next.addEventListener('click',()=>{
    let index = songs.indexOf(currentSong.src.split('songs/')[1]);
    if((index+1)< songs.length){
      Playmusic(songs[index+1]);
    }
  })


  // Adding effect to drag the circle 
  circle.addEventListener('mousedown', e=>{
    isDragging = true;
    circle.style.transition = 'none';
    seekbar.removeEventListener('click',seekbar_click);
  })
  document.addEventListener('mousemove',e=>{
    if(isDragging){
      const seekbarRect = seekbar.getBoundingClientRect();
      const newPosition = e.clientX - seekbarRect.left;

      const progress = newPosition / seekbarRect.width;
      const percentage = progress * 100;

      circle.style.left = `${percentage}%`;
      currentSong.currentTime = currentSong.duration * progress;
    }
  });
  document.addEventListener('mouseup',()=>{
    isDragging = false;
    circle.style.transition = 'left 0.5s';
    seekbar.addEventListener('click',seekbar_click);
  });
  
}
main();