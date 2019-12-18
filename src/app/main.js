var mp3, maxChars;

// Init DOM elements
var input = document.getElementById("input");
var encrypt = document.getElementById("encChck");
var decrypt = document.getElementById("decChck");
var encPwd = document.getElementById("encPwd");
var decPwd = document.getElementById("decPwd");
var counter = document.getElementById("counter");
var message = document.getElementById("message");
var message2 = document.getElementById("message2");

// Load raw mp3 to buffer
function loadFile() {
    var reader = new FileReader();
    var file = input.files[0];
    if (!file.name.endsWith(".mp3")) {
        alert("Not an MP3");
    } else {
        reader.onload = function () {
            mp3 = new MP3Stego(file.name, reader.result);
            initScreen();
        };
        reader.readAsArrayBuffer(file);
    }
}

// Load proper box depending on input
function initScreen() {
    toggleDiv("main");  // Hide main screen
    if (mp3.isModified()) {
        toggleDiv("extractBox");
    } else {
        maxChars = mp3.spaceLeft();
        counter.value = maxChars;
        toggleDiv("embedBox");
    }
}

// Embed text into mp3 and trigger download
function embedText() {
    var str = message.value;
    if (encrypt.checked) {
        mp3.embedText(encryptText(str));
    } else {
        mp3.embedText(encodeUTF8(str));
    }
    mp3.download();
}

// Extract text from an mp3 file
function extractText() {
    var bytes = mp3.extractText();
    if (decrypt.checked) {
        bytes = decryptText(bytes);
    }
    message2.value = decodeUTF8(bytes);
}

// Encrypt stuff
function encryptText(str) {
    var enc = CryptoJS.AES.encrypt(str, encPwd.value, {
        mode: CryptoJS.mode.CTR, padding: CryptoJS.pad.NoPadding
    });
    str = atob(enc.toString()).substr(8);
    var bytes = str.split("").map(c => c.charCodeAt(0));
    return bytes;
}

// Decrypt stuff
function decryptText(bytes) {
    var str = String.fromCharCode.apply(String, bytes);
    str = btoa("Salted__" + str);
    var dec = CryptoJS.AES.decrypt(str, decPwd.value, {
        mode: CryptoJS.mode.CTR, padding: CryptoJS.pad.NoPadding
    });
    return wordArrayToByteArray(dec);
}
