var mp3file, maxChars;

// Init DOM elements
var input = document.getElementById("input");
var counter = document.getElementById("counter");
var message = document.getElementById("message");
var embedButton = document.getElementById("embedButton");

// Load raw mp3 to buffer
function loadFile() {
    var reader = new FileReader();
    var file = input.files[0];
    if (!file.name.endsWith(".mp3")) {
        alert("Not an MP3");
        return;
    }
    reader.onload = function() {
        mp3file = new MP3Stego(file.name, reader.result);
        maxChars = mp3file.spaceLeft();
        counter.value = maxChars;
    };
    reader.readAsArrayBuffer(file);
}

// Embed text into mp3 and trigger download
function embedText() {
    message.disabled = embedButton.disabled = true;
    mp3file.embedText(message.value);
    mp3file.download();
    message.disabled = embedButton.disabled = false;
}
