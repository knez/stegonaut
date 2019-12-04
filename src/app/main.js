var mp3file, mp3file2, maxChars;

// Init DOM elements
var input = document.getElementById("input");
var input2 = document.getElementById("input2");
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
    var str = message.value;
    if (encrypt.checked) {
        // Encrypt stuff
        var enc = CryptoJS.AES.encrypt(str, encPwd.value, {
            mode: CryptoJS.mode.CTR, padding: CryptoJS.pad.NoPadding
        });
        str = atob(enc.toString()).substr(8);
    }
    mp3file.embedText(str);
    mp3file.download();
}

function extractText() {
    if (mp3file2.isModified()) {
        var str = mp3file2.extractText();
        // Decrypt stuff
        if (decrypt.checked) {
            str = btoa("Salted__" + str);
            var dec = CryptoJS.AES.decrypt(str, decPwd.value, {
                mode: CryptoJS.mode.CTR, padding: CryptoJS.pad.NoPadding
            });
            str = dec.toString(CryptoJS.enc.Latin1);
        }
        message2.value = str;
    } else {
        alert("Nothing to extract");
    }
}
