const volume_value = document.querySelector("#volume_value");
const volume_input = document.querySelector("#volume_input");
const speed_value = document.querySelector("#speed_value");
const speed_input = document.querySelector("#speed_input");
const pitch_value = document.querySelector("#pitch_value");
const pitch_input = document.querySelector("#pitch_input");
const tune_value = document.querySelector("#tune_value");
const tune_input = document.querySelector("#tune_input");
const pan_value = document.querySelector("#pan_value");
const pan_input = document.querySelector("#pan_input");

// THIS FILE CONTAINS ALL THE EFFECTS JS STUFFS EXCEPT FOR VOLUME

volume_value.textContent = volume_input.value;
volume_input.addEventListener("input", (event) => {
  volume_value.textContent = event.target.value;
});

speed_value.textContent = speed_input.value;
speed_input.addEventListener("input", (event) => {
  const target_speed = event.target.valueAsNumber
  speed_value.textContent = target_speed.toFixed(2);
});

pitch_value.textContent = pitch_input.value - 1;
pitch_input.addEventListener("input", (event) => {
  const target_pitch = event.target.valueAsNumber
  pitch_value.textContent = (target_pitch -1).toFixed(2);
});

tune_value.textContent = tune_input.value;
tune_input.addEventListener("input", (event) => {
  tune_value.textContent = event.target.value;
});

pan_value.textContent = pan_input.value;
pan_input.addEventListener("input", (event) => {
    let value = parseFloat(event.target.value);
    
    if (value === 0) {
        pan_value.textContent = "0 L/R";
    } else if (value > 0) {
        pan_value.textContent = `${value} R`;
    } else {
        pan_value.textContent = `${Math.abs(value)} L`;
    }
});


const button = document.getElementById('effects-list-btn');
const caret = document.getElementById('caret');
const effectsdropdown = document.getElementById('myDropdown');

button.addEventListener('click', () => {
    const isHidden = effectsdropdown.style.display === 'none';
    effectsdropdown.style.display = isHidden ? 'block' : 'none';
    caret.textContent = isHidden ? 'expand_less' : 'expand_more';
});



