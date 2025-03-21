
// =================== EXISTING VARIABLES ===================
let effectsListBox = document.querySelector(".container .effects-list-div");
let effectsListOpenBtn = document.querySelector(".container .btns #effects-list-btn");
let effectsListCloseBtn = document.querySelector(".container .effects-list-div #effects-list-close-btn");
let musicListBox = document.querySelector(".container .music-list-div");
let musicListOpenBtn = document.querySelector(".container .btns #music-list-btn");
let musicListCloseBtn = document.querySelector(".container .music-list-div #music-list-close-btn");
let music = document.querySelector("#music");
let musicImg = document.querySelector(".container .music-img img");
let musicName = document.querySelector(".container .music-name");
let artistName = document.querySelector(".container .artist-name");
let playPauseBtn = document.querySelector(".container .btns .play-pause");
let currentTime = document.querySelector(".container .wave-box .current-time");
let totalTime = document.querySelector(".container .wave-box .total-time");
let nextMusicBtn = document.querySelector(".container .btns .fa-forward-step");
let prevMusicBtn = document.querySelector(".container .btns .fa-backward-step");
let volumeProgressBar = document.querySelector(".container .volume-box input");
let volumeIncreBtn = document.querySelector(".container .volume-box .volume-incre");
let volumeDecreBtn = document.querySelector(".container .volume-box .volume-decre");
let volumeIcon = document.querySelector(".container .volume-box .volume-icon");
let repeatSongIcon = document.querySelector(".container .btns #repeat-song-icon");
let musicIndex = 1;

// Load music on page load
window.addEventListener("load", ()=>{
    loadMusic(musicIndex);
    playingNow();
});

// Load music data based on music index
function loadMusic(indexNumb){
    // "indexNumb" is 1-based, but arrays are 0-based
    const track = allmusic[indexNumb - 1];
    // Set the <audio> src
    music.src = track.src;
    // If you have images, e.g. track.img => "Musics_modif/Karimi/Dashti/iri" etc.
    // Adjust as needed or remove if you don't have images for each track
    musicImg.src = `${track.img || "Images/default"}.jpg`;

    // Update the displayed text
    musicName.innerHTML = `${track.name} - ${track.artist}`;
}

/*
 ********************* WAVEFORM IMPLEMENTATION ************************
*/

// Timeline plugin instance
const timeline = WaveSurfer.Timeline.create({
    height: 20,
    insertPosition: 'beforebegin',
    timeInterval: 0.5,
    primaryLabelInterval: 5,
    secondaryLabelInterval: 1,
    style: {
      fontSize: '7px',
      color: '#FFFFFF',
    },
});

const ctx = document.createElement('canvas').getContext('2d');
const gradient = ctx.createLinearGradient(0, 20, 0, 520);
gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
gradient.addColorStop(0.5, 'rgb(255, 255, 255)');
gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

const gradientprog = ctx.createLinearGradient(0, 20, 0, 520);
gradientprog.addColorStop(0, 'rgba(73, 221, 247, 0.1)');
gradientprog.addColorStop(0.5, 'rgb(73, 221, 247)');
gradientprog.addColorStop(1, 'rgba(73, 221, 247, 0.1)');

// Create audio wave using WaveSurfer
const wavesurfer = WaveSurfer.create({
    backend: 'WebAudio',
    container: '#waveform',
    waveColor: gradient,
    progressColor: gradientprog,
    height: 300,
    barWidth: NaN,
    barRadius: NaN,
    audioRate: 1,
    hideScrollbar: false,
    responsive: true,
    minPxPerSec: 20,
    barHeight: 0.5,
    plugins: [ 
        regions = WaveSurfer.Regions.create(),
        WaveSurfer.Hover.create({
            lineColor: '#ff0000',
            lineWidth: 2,
            labelBackground: '#555',
            labelColor: '#fff',
            labelSize: '11px',
        }),
        timeline,
    ],
});


// Give regions a random color when they are created
const random = (min, max) => Math.random() * (max - min) + min
const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`

regions.enableDragSelection({
  color: 'rgba(88, 104, 156, 0.4)',
})
regions.on('region-updated', (region) => {
  console.log('Updated region', region)
})

let selectedRegion = null;

// Handle region selection
regions.on('region-clicked', (region) => {
  selectedRegion = region;
  document.getElementById('delete-btn').disabled = false;  // Enable the button
});

// Handle button click to delete the selected region
document.getElementById('delete-btn').addEventListener('click', () => {
  if (selectedRegion) {
    selectedRegion.remove();
    selectedRegion = null;
    document.getElementById('delete-btn').disabled = true;  // Disable the button
  }
});
  // Loop a region on click
let loop = true
// Toggle looping with a checkbox
document.querySelector('input[type="checkbox"]').onclick = (e) => {
  loop = e.target.checked
}

  {
    let activeRegion = null
    regions.on('region-in', (region) => {
      console.log('region-in', region)
      activeRegion = region
    })
    regions.on('region-out', (region) => {
      console.log('region-out', region)
      if (activeRegion === region) {
        if (loop) {
          region.play()
        } else {
          activeRegion = null
        }
      }
    })
    regions.on('region-clicked', (region, e) => {
      e.stopPropagation() // prevent triggering a click on the waveform
      activeRegion = region
      region.play()
      region.setOptions({ color: randomColor() })
    })
    // Reset the active region when the user clicks anywhere in the waveform
    wavesurfer.on('interaction', () => {
      activeRegion = null
    })
  }
  wavesurfer.on('click', () => {
    wavesurfer.play()
  })
 // Update the zoom level on slider change
wavesurfer.once('decode', () => {
    document.querySelector('#zooming').oninput = (e) => {
      const minPxPerSec = Number(e.target.value)
      wavesurfer.zoom(minPxPerSec)
    }
  })

// Load the first track into wavesurfer
wavesurfer.load(allmusic[musicIndex - 1].src);

// Example: play/pause
playPauseBtn.addEventListener("click", ()=> {
    wavesurfer.playPause();
    if (playPauseBtn.classList.contains("play")){
        playPauseBtn.classList.replace("play", "pause");
        playPauseBtn.innerHTML = '<i class="material-icons">pause</i>';
    } else {
        playPauseBtn.classList.replace("pause", "play");
        playPauseBtn.innerHTML = '<i class="material-icons">play_arrow</i>';
    }
    playingNow();
});

// Calculate time in minutes and seconds
let calculateTime = function(value){
    let second = Math.floor(value % 60);
    let minute = Math.floor(value / 60);

    if (second < 10) {
        second = "0" + second;
    }
    return `${minute}:${second}`;
}

// Update total time on wavesurfer ready
wavesurfer.on("ready", async ()=>{
  const webAudioPlayer = wavesurfer.getMediaElement()
  const gainNode = webAudioPlayer.getGainNode()
  const audioContext = gainNode.context
  // Load the phase vocoder audio worklet
  await audioContext.audioWorklet.addModule('phase-vocoder.min.js')
  const phaseVocoderNode = new AudioWorkletNode(audioContext, 'phase-vocoder-processor')

  const myAudio = document.querySelector("audio");
  const panControl = document.querySelector("#pan_input");
  const panValue = document.querySelector("#pan_value");

  const source = audioContext.createMediaElementSource(myAudio);

  // Create a stereo panner
  const panNode = audioContext.createStereoPanner();

  panControl.oninput = () => {
    panNode.pan.setValueAtTime(panControl.value, audioContext.currentTime);
    panValue.textContent = panControl.value;
  };

  // Connect the worklet to the wavesurfer audio
  gainNode.disconnect()
  gainNode.connect(phaseVocoderNode)
  phaseVocoderNode.connect(panNode)
  panNode.connect(audioContext.destination);

  let speed = 1.0;  // Default speed
  let pitch = 1.0;  // Default pitch
  let tune = 0.0; 


  // Speed slider
  document.getElementById('speed_input').addEventListener('input', (e) => {
      speed = e.target.valueAsNumber;
      wavesurfer.setPlaybackRate(speed);
      updatePitch();
  });

  // Pitch slider
  document.getElementById('pitch_input').addEventListener('input', (t) => {
      pitch = t.target.valueAsNumber;
      updatePitch();
  });

  // Tune slider
  document.getElementById('tune_input').addEventListener('input', (t) => {
    tune = t.target.valueAsNumber;
    updatePitch();
  });

  // Function to update pitch considering speed
  function updatePitch() {
      const pitchFactorParam = phaseVocoderNode.parameters.get('pitchFactor');
      pitchFactorParam.value = (pitch+5*1e-4*tune) / speed;
  }
})

// Next music button event listener
nextMusicBtn.addEventListener("click", ()=>{
    musicIndex++; //Increment music index
    // Check music index bounds and reset to 1 if exceeded
    musicIndex > allmusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex); //Load music index
    wavesurfer.load(`Musics/music${musicIndex}.mp3`); //Load next file using wavesurfer
    wavesurfer.setTime(0); //Reset waveform progress to 0
    // Update play/pause icon if currently paused
    if(playPauseBtn.classList.contains("pause")){
        playPauseBtn.classList.replace("pause", "play");
        playPauseBtn.innerHTML = '<i class="material-icons">play_arrow</i>';
    }
    // Play next music after 2-second delay
    setTimeout(() =>{
        if(playPauseBtn.classList.contains("play")){
            playPauseBtn.classList.replace("play", "pause");
            playPauseBtn.innerHTML = '<i class="material-icons">pause</i>';
        }
        wavesurfer.play();
    }, 2000);
    playingNow();
})

// Previous music button event listener
prevMusicBtn.addEventListener("click", ()=>{
    musicIndex--; // Decrement music index
    // Check music index bounds and reset to last music if below 1
    musicIndex < 1 ? musicIndex = allmusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex); //Load music index
    wavesurfer.load(`Musics/music${musicIndex}.mp3`); //Load next file using wavesurfer
    wavesurfer.setTime(0); //Reset waveform progress to 0
    // Update play/pause icon if currently paused
    if(playPauseBtn.classList.contains("pause")){
        playPauseBtn.classList.replace("pause", "play");
        playPauseBtn.innerHTML = '<i class="material-icons">play_arrow</i>';
    }
    // Play previous music after 2-second delay
    setTimeout(() =>{
        if(playPauseBtn.classList.contains("play")){
            playPauseBtn.classList.replace("play", "pause");
            playPauseBtn.innerHTML = '<i class="material-icons">pause</i>';
        }
        wavesurfer.play();
    }, 2000);
    playingNow();
})

// Define functions to open and close music list
// Opens the music list by setting its bottom position to 0(zero)

// Progress Bar Slider Runnable track
let updateSliderTrack =()=>{
    let min = volumeProgressBar.min;
    let max = volumeProgressBar.max;
    let value = volumeProgressBar.value;

    let bgSize = volumeProgressBar.style.cssText = 'background-size:' + (value - min) * 100 / (max - min) + "% 100%";
    setMusicVolume();
}

let setMusicVolume =() =>{
    // Set wavesurfer volume to current volume input value
    wavesurfer.setVolume(volumeProgressBar.value); 
}

// Increase volume
let volumeIncrease =()=>{
    // stepUp(): is a javascript inbuild function it increment input value by specified step
    volumeProgressBar.stepUp(); //Increment volume value
    wavesurfer.setVolume(volumeProgressBar.value); //Update wavesurfer volume
    updateSliderTrack();
}

// Decrease volume
let volumeDecrease =()=>{
    volumeProgressBar.stepDown(); // Decrement volume value
    wavesurfer.setVolume(volumeProgressBar.value); //Update wavesurfer volume
    updateSliderTrack();
}

// Mute music
let muteMusic =()=>{
    if(volumeIcon.textContent = 'volume_up'){
        volumeProgressBar.value = 0; //Set volume input value to 0
        wavesurfer.setVolume(volumeProgressBar.value); //Update wavesurfer volume
        // volumeIcon.innerHTML = 'volume_off';
        updateSliderTrack();
    }
}

// Repeat button event listener
repeatSongIcon.addEventListener("click", ()=>{
    // Get current icon text
    let getText = repeatSongIcon.innerHTML;
    // Toggle icon
    switch(getText){
        case "repeat":
            repeatSongIcon.innerHTML = "repeat_one";
            repeatSongIcon.setAttribute("title", "Song looped");
        break;
        case "repeat_one":
            repeatSongIcon.innerHTML = "shuffle";
            repeatSongIcon.setAttribute("title", "Playback shuffle");
        break;
        case "shuffle":
            repeatSongIcon.innerHTML = "repeat";
            repeatSongIcon.setAttribute("title", "Playlist looped");
        break;
    }
})

wavesurfer.on("finish", ()=>{
    let getText = repeatSongIcon.innerHTML;
    switch(getText){
        case "repeat":
            nextMusicBtn.click();
        break;
        case "repeat_one":
            wavesurfer.setTime(0);
            loadMusic(musicIndex);
            setTimeout(()=> wavesurfer.play(), 300);
        break;
        case "shuffle":
            let ranIndex = Math.floor((Math.random() * allmusic.length) + 1);
            do {
                ranIndex = Math.floor((Math.random() * allmusic.length) + 1);
            } 
            while(musicIndex == ranIndex);

            musicIndex = ranIndex;
            loadMusic(musicIndex);
            wavesurfer.load(allmusic[musicIndex - 1].src);
            wavesurfer.setTime(0);

            if(playPauseBtn.classList.contains("pause")){
                playPauseBtn.classList.replace("pause", "play");
                playPauseBtn.innerHTML = '<i class="material-icons">play_arrow</i>';
            }
            setTimeout(()=>{
                if(playPauseBtn.classList.contains("play")){
                    playPauseBtn.classList.replace("play", "pause");
                    playPauseBtn.innerHTML = '<i class="material-icons">pause</i>';
                }
                wavesurfer.play();
            }, 2000);
            playingNow();
        break;
    }
    wavesurfer.stop();
    // 2) Seek to 0 if you want the playhead to go back
    wavesurfer.seekTo(0);
});

// ========== BOTTOM SHEET LOGIC (Radif -> Dastgah -> Songs) ==========

// We keep the same approach as before, but note that now "dastgahMap" is an array of objects.
//   radifMap[x] -> name of radif x
//   dastgahMap[x] -> an object containing {y: "dastgahName", ...}

let currentView = "radif"; 
let currentRadif = null;      
let currentSongList = [];
let currentSongListIndex = 0;

const bottomSheet = document.querySelector(".container .music-list-div");
const backToRadif = document.getElementById("backToRadif");      // (You'd add these IDs in HTML)
const backToDastgah = document.getElementById("backToDastgah");  // (You'd add these IDs in HTML)
const prevSongBtn2 = document.getElementById("prevSongBtn");     // If you have separate next/prev in the sheet
const nextSongBtn2 = document.getElementById("nextSongBtn");
const sheetTitle = document.getElementById("sheetTitle");
const sheetContent = document.getElementById("sheetContent");

// In Dastgah view (step 2): back-to-radif goes to radif list.
backToRadif.addEventListener("click", () => {
    showRadifList();
  });

// In Songs view (step 3): back-to-dastgah goes to dastgah list for currentRadif.
backToDastgah.addEventListener("click", () => {
    if(currentRadif !== null) {
        showDastgahList(currentRadif);
    }
});

// Show the bottom sheet
function musicListOpen(){
    showRadifList();
    bottomSheet.style.bottom = "0";
}
function musicListClose(){
    bottomSheet.style.bottom = "-100%";
}
musicListOpenBtn.addEventListener("click", musicListOpen);
musicListCloseBtn.addEventListener("click", musicListClose);

function updateNavButtons(show){
    if(!prevSongBtn2 || !nextSongBtn2) return;
    prevSongBtn2.style.display = show ? "inline-block" : "none";
    nextSongBtn2.style.display = show ? "inline-block" : "none";
}

// Step 1: Radif List
function showRadifList(){
    currentView = "radif";
    sheetTitle.textContent = "Select a Radif";
    if(backToRadif) backToRadif.style.display = "none";
    if(backToDastgah) backToDastgah.style.display = "none";
    updateNavButtons(false);

    let html = `<ul class="list">`;
    Object.keys(radifMap).forEach(rKey => {
        const radifName = radifMap[rKey];
        // Check if this radif has any songs in allmusic
        const hasSongs = allmusic.some(song => song.index[0] === parseInt(rKey, 10));
        html += `
            <li class="list-item" data-radif="${rKey}">
                <span>${radifName}</span>
                <span class="sub-text">${hasSongs ? ">" : "(No songs)"}</span>
            </li>`;
    });
    html += `</ul>`;
    sheetContent.innerHTML = html;

    sheetContent.querySelectorAll(".list-item").forEach(item => {
        item.addEventListener("click", ()=>{
            const radifIndex = parseInt(item.getAttribute("data-radif"), 10);
            if(allmusic.some(song => song.index[0] === radifIndex)){
                currentRadif = radifIndex;
                showDastgahList(radifIndex);
            }
        });
    });
}

// Step 2: Dastgah List
function showDastgahList(radifIndex){
    currentView = "dastgah";
    const rName = radifMap[radifIndex] || `Unknown(${radifIndex})`;
    sheetTitle.innerHTML = `<span class="back-btn" id="backToRadif" style="display:none;">←</span> </span><i class="material-icons" id="music-list-btn">queue_music</i> ${rName} > Select a Dastgah`;
    if(backToRadif) backToRadif.style.display = "inline-block";
    if(backToDastgah) backToDastgah.style.display = "none";
    updateNavButtons(false);

    // We use dastgahMap[ radifIndex ], which is an object: e.g. { "0": "BayateTork", "1": "Dashti", "2": "Shur" }
    const possibleDastgahs = dastgahMap[radifIndex]; 
    // Filter songs to see which dastgah indices actually exist
    const filtered = allmusic.filter(song => song.index[0] === radifIndex);
    const uniqueDastgahs = [...new Set(filtered.map(song => song.index[1]))];

    let html = `<ul class="list">`;
    uniqueDastgahs.forEach(d => {
        const dName = possibleDastgahs[d] || `Unknown(${d})`;
        html += `
            <li class="list-item" data-dastgah="${d}">
                <span>${dName}</span>
                <span class="sub-text">></span>
            </li>
        `;
    });
    html += `</ul>`;
    sheetContent.innerHTML = html;

    sheetContent.querySelectorAll(".list-item").forEach(item => {
        item.addEventListener("click", ()=>{
            const dIndex = parseInt(item.getAttribute("data-dastgah"), 10);
            showSongsList(radifIndex, dIndex);
        });
    });
}

// Step 3: Songs in (radifIndex, dastgahIndex)
function showSongsList(radifIndex, dastgahIndex){
    currentView = "songs";
    currentSongList = allmusic.filter(song => (
        song.index[0] === radifIndex && song.index[1] === dastgahIndex
    ));
    currentSongListIndex = 0;

    if(backToRadif) backToRadif.style.display = "none";
    if(backToDastgah) backToDastgah.style.display = "inline-block";
    updateNavButtons(true);

    const rName = radifMap[radifIndex] || `Unknown(${radifIndex})`;
    const dName = dastgahMap[radifIndex][dastgahIndex] || `Unknown(${dastgahIndex})`;
    sheetTitle.textContent = `Songs in ${rName} > ${dName}`;
    updateSongListUI();
}

// Build the songs UI
function updateSongListUI(){
    let html = `<ul class="music-list">`;
    currentSongList.forEach((song, idx) => {
        const isPlaying = (idx === currentSongListIndex);
        const displayDuration = isPlaying ? "Playing" : (song.duration || "0:00");
        html += `
            <li class="list-item" data-index="${idx}">
                <div>
                    <strong>${song.name}</strong><br/>
                    <span class="sub-text">${song.artist}</span>
                </div>
                <span class="sub-text">${displayDuration}</span>
            </li>
        `;
    });
    html += `</ul>`;
    sheetContent.innerHTML = html;

    sheetContent.querySelectorAll(".list-item").forEach(item => {
        item.addEventListener("click", ()=>{
            const idx = parseInt(item.getAttribute("data-index"), 10);
            currentSongListIndex = idx;
            loadAndPlaySongFromList();
            updateSongListUI();
        });
    });
}

// Next/Prev within the currentSongList
function nextSong(){
    if(currentSongList.length === 0) return;
    currentSongListIndex = (currentSongListIndex + 1) % currentSongList.length;
    loadAndPlaySongFromList();
    updateSongListUI();
}

function prevSong(){
    if(currentSongList.length === 0) return;
    currentSongListIndex = (currentSongListIndex - 1 + currentSongList.length) % currentSongList.length;
    loadAndPlaySongFromList();
    updateSongListUI();
}

// Load/Play from currentSongList
function loadAndPlaySongFromList(){
    const song = currentSongList[currentSongListIndex];
    // Find the 1-based index in allmusic
    musicIndex = allmusic.findIndex(s => s.src === song.src) + 1;
    loadMusic(musicIndex);
    wavesurfer.load(song.src);
    wavesurfer.setTime(0);
    wavesurfer.once("ready", ()=> wavesurfer.play());
}

// If you have separate next/prev buttons for the bottom sheet:
if (prevSongBtn2) prevSongBtn2.addEventListener("click", prevSong);
if (nextSongBtn2) nextSongBtn2.addEventListener("click", nextSong);

// FOR EFFECTS LIST
function myFunction() {
    document.getElementById("effects-Dropdown").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
  
// REGIONS SETTINGS 
const icon = document.getElementById('region-icon');
const dropdown = document.getElementById('regions-dropdown');

icon.addEventListener('click', () => {
    dropdown.classList.toggle('show');
    icon.classList.toggle('active');
});

// Attach event listener to volume input range
volumeProgressBar.addEventListener("input", updateSliderTrack);
musicListOpenBtn.addEventListener("click", musicListOpen);
musicListCloseBtn.addEventListener("click", musicListClose);
updateSliderTrack();
