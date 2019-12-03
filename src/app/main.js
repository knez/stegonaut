var mp3file, mp3file2, maxChars;

// Init DOM elements
var input = document.getElementById("input");
var input2 = document.getElementById("input2");
var counter = document.getElementById("counter");
var message = document.getElementById("message");
var message2 = document.getElementById("message2");

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

// Load raw mp3 to buffer
function loadFile2() {
    var reader = new FileReader();
    var file = input2.files[0];
    if (!file.name.endsWith(".mp3")) {
        alert("Not an MP3");
        return;
    }
    reader.onload = function() {
        mp3file2 = new MP3Stego(file.name, reader.result);
    };
    reader.readAsArrayBuffer(file);
}

// Embed text into mp3 and trigger download
function embedText() {
    mp3file.embedText(message.value);
    mp3file.download();
}

function extractText() {
    if (mp3file2.isModified()) {
        message2.value = mp3file2.extractText();
    } else {
        alert("Nothing to extract");
    }
}
