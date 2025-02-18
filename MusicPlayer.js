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
    
})

// Load music data based on music index
let loadMusic =(indexNumb)=>{
    // Set music image, source, name and artist
    musicImg.src = `${allmusic[indexNumb - 1].img}.jpg`;
    music.src = `${allmusic[indexNumb - 1].src}.mp3`;
    // musicName.innerHTML = `${allmusic[indexNumb - 1].name}`;
    // artistName.innerHTML = `${allmusic[indexNumb - 1].artist}`;
    musicName.innerHTML = `${allmusic[indexNumb - 1].name} - ${allmusic[indexNumb - 1].artist}`;
}

/*
 ********************* WAVEFORM IMPLEMENTATION************************
*/

// Create a timeline plugin instance with custom options
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
  })

const ctx = document.createElement('canvas').getContext('2d')
const gradient = ctx.createLinearGradient(0, 20, 0, 520)
gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)')
gradient.addColorStop(0.5, 'rgb(255, 255, 255)')
gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)')

const gradientprog = ctx.createLinearGradient(0, 20, 0, 520)
gradientprog.addColorStop(0, 'rgba(73, 221, 247, 0.1)')
gradientprog.addColorStop(0.5, 'rgb(73, 221, 247)')
gradientprog.addColorStop(1, 'rgba(73, 221, 247, 0.1)')

// Create audio wave using wavesurfer API
const wavesurfer = WaveSurfer.create({
    backend: 'WebAudio',
    container: '#waveform', //Waveform container
    waveColor: gradient,
    progressColor: gradientprog,
    height: 300,
    barWidth: NaN,
    barRadius: NaN,
    audioRate: 1, // set the initial playback rate
    // normalize: true,
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
})

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

//  Load initial music file
wavesurfer.load(`Musics/music${musicIndex}.mp3`);

// Play/Pause music on click
playPauseBtn.addEventListener("click", ()=>{
    wavesurfer.playPause(); //Toggle play/pause
    // Update play/pause icon
    if(playPauseBtn.classList.contains("play")){
        playPauseBtn.classList.replace("play", "pause");
        playPauseBtn.innerHTML = '<i class="material-icons">pause</i>';
    }else{
        playPauseBtn.classList.replace("pause", "play");
        playPauseBtn.innerHTML = '<i class="material-icons">play_arrow</i>';
    }
    playingNow();
})



// Calculate time in minutes and seconds
let calculateTime = function(value){
    let second = Math.floor(value % 60);
    let minute = Math.floor(value / 60);

    if(second < 10){
        second = "0" + second;
    }
    return `${minute}:${second}`;
}

// Update total time on wavesurfer ready
wavesurfer.on("ready", async ()=>{
    // totalTime.innerHTML = calculateTime(wavesurfer.getDuration());
  const webAudioPlayer = wavesurfer.getMediaElement()
  const gainNode = webAudioPlayer.getGainNode()
  const audioContext = gainNode.context
  // Load the phase vocoder audio worklet
  await audioContext.audioWorklet.addModule('phase-vocoder.min.js')
  const phaseVocoderNode = new AudioWorkletNode(audioContext, 'phase-vocoder-processor')

  // Connect the worklet to the wavesurfer audio
  gainNode.disconnect()
  gainNode.connect(phaseVocoderNode)
  phaseVocoderNode.connect(audioContext.destination)

  // // Speed slider

  // document.getElementById('speed_input').addEventListener('input', (e) => {
  //   const speed = e.target.valueAsNumber
  //   // document.querySelector('#rate').textContent = speed.toFixed(2)
  //   wavesurfer.setPlaybackRate(speed)
  // })

  // document.getElementById('pitch_input').addEventListener('input', (t) => {
  //   const pitch = t.target.valueAsNumber
  //   const pitchFactorParam = phaseVocoderNode.parameters.get('pitchFactor')
  //   pitchFactorParam.value = pitch * 1 / speed
  // })
  let speed = 1.0;  // Default speed
let pitch = 1.0;  // Default pitch

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

// Function to update pitch considering speed
function updatePitch() {
    const pitchFactorParam = phaseVocoderNode.parameters.get('pitchFactor');
    pitchFactorParam.value = pitch / speed;
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
let musicListOpen =()=>{
    musicListBox.style.bottom = "0";
}

// Closes the music list by setting its bottom position to -100%
let musicListClose =()=>{
    musicListBox.style.bottom = "-100%";
}

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
    // Update volume icon based on volume value
    // if(volumeProgressBar.value == 0){
    //     volumeIcon.innerHTML = 'volume_off';
    // }else{
    //     volumeIcon.innerHTML = 'volume_up';
    // }
}

// Increase volume
let volumeIncrease =()=>{
    // stepUp(): is a javascript inbuild function it increment input value by specified step
    volumeProgressBar.stepUp(); //Increment volume value
    wavesurfer.setVolume(volumeProgressBar.value); //Update wavesurfer volume
    // if(volumeProgressBar.value !== 0){
    //     volumeIcon.innerHTML = 'volume_up';
    // }
    updateSliderTrack();
}

// Decrease volume
let volumeDecrease =()=>{
    // stepDown(): is a javascript inbuild function it decrement input value by specified step
    volumeProgressBar.stepDown(); // Decrement volume value
    wavesurfer.setVolume(volumeProgressBar.value); //Update wavesurfer volume
    // // Update volume icon based on volume value
    // if(volumeProgressBar.value == 0){
    //     volumeIcon.innerHTML = 'volume_off';
    // }else{
    //     volumeIcon.innerHTML = 'volume_up';
    // }
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


/*
*********************** FOR TRAVERSING RADIFS ************************
*/

// After song ends
wavesurfer.on("finish", ()=>{
    // Get current mode (repeat, repeat_one, or shuffle)
    let getText = repeatSongIcon.innerHTML;
    // Handle song ending based on mode
    switch(getText){
        // Repeat playlist
        case "repeat":
          nextMusicBtn.click(); //Play next song
        break;
        // Repeat current song
        case "repeat_one":
          wavesurfer.setTime(0); // Reset song position to 0(zero)
          loadMusic(musicIndex); // Reload current song
          setTimeout(()=>{
            wavesurfer.play();
          }, 300);
        break;
        // Shuffle playlist
        case "shuffle":
            // Generate random song index
            let ranIndex = Math.floor((Math.random() * allmusic.length) + 1);
            do{
                // Ensure new song is different from current song
                ranIndex = Math.floor((Math.random() * allmusic.length) + 1);
            }while(musicIndex == ranIndex);
            musicIndex = ranIndex; // Update music index
            loadMusic(musicIndex); // Load new song
            wavesurfer.load(`Musics/music${musicIndex}.mp3`); //Load new song file 
            wavesurfer.setTime(0); // Reset song position to 0(zero)
            // Update play/pause icon if currently paused
            if(playPauseBtn.classList.contains("pause")){
                playPauseBtn.classList.replace("pause", "play");
                playPauseBtn.innerHTML = '<i class="material-icons">play_arrow</i>';
            }
            // Play new music after 2-second delay
            setTimeout(() =>{
                if(playPauseBtn.classList.contains("play")){
                    playPauseBtn.classList.replace("play", "pause");
                    playPauseBtn.innerHTML = '<i class="material-icons">pause</i>';
                }
                wavesurfer.play();
            }, 2000);
            playingNow();
        break;
    }
})

// Now we create music playlist functionality
// Music list box which store music items dynamically
const ul = document.querySelector(".music-lists-container ul");

for(let i = 0; i < allmusic.length; i++){
    // Create list item HTML
    let li = `
                <li li-index="${i + 1}">
                    <div class="music-list">
                        <img src="${allmusic[i].img}.jpg" alt="">
                        <span class="musiclist-song-title">${allmusic[i].name}</span>
                        <span class="musiclist-artistname">${allmusic[i].artist}</span>
                        <audio class="music${i + 1}" src="${allmusic[i].src}.mp3"></audio>
                        <span class="music-list-total-time" id="music${i + 1}">3:45</span>
                    </div>
                </li>`;
    // Insert list item HTML into ul element
    ul.insertAdjacentHTML("beforeend", li);

    // Get audio duration
    const audioTag = document.querySelector(`.music${i + 1}`);
    const audioduration = document.querySelector(`#music${i + 1}`);

    // Update audio duration on load
    audioTag.addEventListener("loadeddata", ()=>{
        let audioDuration = audioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){
            totalSec = `0${totalSec}`;
        }
        audioduration.innerHTML = `${totalMin}:${totalSec}`;
        audioduration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    })
}

// Get all list items
let allLiTag = document.querySelectorAll(".music-lists-container ul li");

// Function to update all list items
let playingNow =()=>{
    // Loop through all list items
    for(let i = 0; i < allmusic.length; i++){
        let addura = allLiTag[i].querySelector(".music-list-total-time");
        // Remove playing class if present
        if(allLiTag[i].classList.contains("playing")){
            allLiTag[i].classList.remove("playing");
            let adDuration = addura.getAttribute("t-duration");
            addura.innerHTML = adDuration;
        }
        // Add playing class if current music index matches
        if(allLiTag[i].getAttribute("li-index") == musicIndex){
            allLiTag[i].classList.add("playing");
            addura.innerHTML = "Playing";
        }
        // Set onclick event for list item
        allLiTag[i].setAttribute("onclick", "clicked(this)");
    }
}

// Function to handle list item click
let clicked =(elem)=>{
    // Get music index from list item
    let getLiIndex = elem.getAttribute("li-index");
    musicIndex = getLiIndex; //Update music index
    loadMusic(musicIndex); //Load music data based on music index
    wavesurfer.load(`Musics/music${musicIndex}.mp3`); //Load music file using wavesurfer
    wavesurfer.setTime(0); //Reset waveform progress to 0(zero)
    // Update play/pause icon if currently paused
    if(playPauseBtn.classList.contains("pause")){
        playPauseBtn.classList.replace("pause", "play");
        playPauseBtn.innerHTML = '<i class="material-icons">play_arrow</i>';
    }
    // Play clicked music after 2-second delay
    setTimeout(() =>{
        if(playPauseBtn.classList.contains("play")){
            playPauseBtn.classList.replace("play", "pause");
            playPauseBtn.innerHTML = '<i class="material-icons">pause</i>';
        }
        wavesurfer.play();
    }, 2000);
    playingNow();
    musicListClose();
}

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
// Attach event listeners to buttons
// volumeIncreBtn.addEventListener("click", volumeIncrease);
// volumeDecreBtn.addEventListener("click", volumeDecrease);
// volumeIcon.addEventListener("click", muteMusic);
musicListOpenBtn.addEventListener("click", musicListOpen);
musicListCloseBtn.addEventListener("click", musicListClose);
updateSliderTrack();



/*
***************** DETECT GESTURE ********************
*/
myElement.addEventListener("touchstart", startTouch, false);
myElement.addEventListener("touchmove", moveTouch, false);
 
// Swipe Up / Down / Left / Right
var initialX = null;
var initialY = null;
 
function startTouch(e) {
  initialX = e.touches[0].clientX;
  initialY = e.touches[0].clientY;
};
 
function moveTouch(e) {
  if (initialX === null) {
    return;
  }
 
  if (initialY === null) {
    return;
  }
 
  var currentX = e.touches[0].clientX;
  var currentY = e.touches[0].clientY;
 
  var diffX = initialX - currentX;
  var diffY = initialY - currentY;
 
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // sliding horizontally
    if (diffX > 0) {
      // swiped left
      console.log("swiped left");
    } else {
      // swiped right
      console.log("swiped right");
    }  
  } else {
    // sliding vertically
    if (diffY > 0) {
      // swiped up
      console.log("swiped up");
    } else {
      // swiped down
      console.log("swiped down");
    }  
  }
 
  initialX = null;
  initialY = null;
   
  e.preventDefault();
};

