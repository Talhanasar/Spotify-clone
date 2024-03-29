let currentSong = new Audio();
let seekbar = document.getElementById('seekbar');
let songs = [];
let currFolder;
let singer;
const username = 'Talhanasar';
const repo = 'Songs';
const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/`;
const accessToken = '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';
let file_link = "https://raw.githubusercontent.com/Talhanasar/Songs/main/";

function viewport() {
  document.documentElement.style.setProperty('--viewport-height', window.innerHeight + 'px');
}
viewport();
// Update height on window resize
window.addEventListener('resize', viewport);

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
function timeUpdate() {
  document.querySelector('.song-time').innerHTML = `${getTime(currentSong.currentTime)} / ${getTime(currentSong.duration)}`;
  seekbar.value = (currentSong.currentTime / currentSong.duration) * 100;
  const progress = (seekbar.value / seekbar.max) * 100;
  seekbar.style.background = `linear-gradient(to right, #f50 ${progress}%, rgb(128, 128, 128) ${progress}%)`;
}

const Playmusic = (track, pause = false) => {
  currentSong.src = file_link +currFolder+ track;
  if (!pause) {
    currentSong.play();
    play.src = 'icon/pause.svg';
  } else if (play.src.includes('pause.svg')) {
    play.src = play.src.replace('pause.svg', 'play.svg');
  }
  document.querySelector('.song-info').innerHTML = decodeURI(track);
  document.querySelector('.song-time').innerHTML = '00:00 / 00:00';
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(apiUrl+folder, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  let response = await a.json();
  songs = [];
  for (const elem of response) {
    if(elem.name.includes('.mp3')){
      songs.push(elem.name);
    }
  }

  // Adding songs to the playlist
  a = await fetch(`${file_link}${folder}info.json`);
  response = await a.json();
  if(response.artist != ""){
    singer = response.artist;
  }else{
    singer = "Talha";
  }
  let songul = document.querySelector('.song-list').getElementsByTagName('ul')[0];
  songul.innerHTML = '';
  for (const song of songs) {
    songul.innerHTML = songul.innerHTML + `<li>
      <img class="invert" src="icon/song.svg" alt="">
      <div class="info">
          <div class="txt">${song} </div>
          <div>${singer}</div>
      </div>
      <div class="play-now">
          <span>Play now</span>
          <img class="invert" src="icon/play.svg" alt="">
      </div>
    </li>`;
  }

  // play the song  when clicked 
  Array.from(document.querySelector('.song-list').getElementsByTagName('li')).forEach(elem => {
    elem.addEventListener('click', () => {
      Playmusic(elem.querySelector('.info').firstElementChild.innerHTML.trim());
    })
  });
}


async function displayAlbum() {
  let a = await fetch(apiUrl,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  let response = await a.json();
  let cardContainer = document.querySelector('.cardContainer');
  console.log(response);
  for (const elem of response) {
    if (elem.path.includes('songs/') && !elem.path.includes(".htaccess")) {
      // get the metadata of the folder
      let a = await fetch(`${file_link}songs/${elem.name}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder=${elem.name} class="card">
      <div class="img">
        <img src="${file_link}songs/${elem.name}/cover.jpeg" alt="">
        <div class="play">
                <svg width="70%" height="70%" viewBox="0 0 24 24" fill="060708" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 20V4L19 12L5 20Z" stroke="#060708" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>                        
        </div>
      </div>
      <div class="card-info">
        <h2>${response.title}</h2>
        <p>${response.description}.</p>
      </div>
    </div>`;
    }
  }
}

async function main() {
  // get the list of all songs
  await getSongs("Arjith Singh/");
  Playmusic(songs[0], true);

  // Display all the albums
  await displayAlbum();

  // Attach EventListener to change the pause and play icon 
  play.addEventListener('click', () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "icon/pause.svg";
    }
    else {
      currentSong.pause();
      play.src = "icon/play.svg";
    }
  })

  // Listen for timeupdate event 
  currentSong.addEventListener('timeupdate',timeUpdate);

  // Adding eventlistener for seekbar
  seekbar.addEventListener('input', e => {
    const slideValue = e.target.value;
    const progress = (slideValue / seekbar.max) * 100;
    seekbar.style.background = `linear-gradient(to right, #f50 ${progress}%, rgb(128, 128, 128) ${progress}%)`;
    currentSong.currentTime = (slideValue / 100) * currentSong.duration;
  })

  // Adding eventlistener for hamburger 
  document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.left').style.left = '0';
  })

  // Adding eventlistener for cross 
  document.querySelector('.cross').addEventListener('click', () => {
    document.querySelector('.left').style.left = '-100%';
  })

  // Adding eventlistener for previous button 
  prev.addEventListener('click', () => {
    let index = songs.indexOf(currentSong.src.split('songs/')[1]);
    if ((index - 1) > 0) {
      Playmusic(songs[index - 1]);
    }
  })

  // Adding eventlistener for next button 
  next.addEventListener('click', () => {
    let index = songs.indexOf(currentSong.src.split('songs/')[1]);
    if ((index + 1) < songs.length) {
      Playmusic(songs[index + 1]);
    }
  })

  // Adding eventlestener for volume 
  range.addEventListener('input', e => {
    console.log("volume set ", e.target.value, '/100');
    currentSong.volume = e.target.value / 100;
  });

  // Load the playlist whenever the Album is clicked
  Array.from(document.getElementsByClassName('card')).forEach( element => {
    element.addEventListener('click', async item => {
      console.log(item.currentTarget);
      await getSongs(`songs/${decodeURI(item.currentTarget.dataset.folder)}/`);
      Playmusic(songs[0]);
    })
  });

  // Adding enventlistener to mute if clicked 
  document.querySelector('.volume>img').addEventListener('click', e => {
    if (e.target.src.includes('volume.svg')) {
      e.target.src = e.target.src.replace('volume.svg', 'mute.svg');
      currentSong.volume = 0;
      range.value = 0;
    } else {
      e.target.src = e.target.src.replace('mute.svg', 'volume.svg');
      currentSong.volume = 0.2;
      range.value = 20;
    }
  })

}
main();