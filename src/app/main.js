var mp3;

// Add event handlers
document.getElementById("file")
    .addEventListener("change", loadFile, true);

// Load raw mp3 to buffer
function loadFile() {
    var reader = new FileReader();
    var file = document.getElementById("file").files[0];
    reader.onload = function() {
        mp3 = new MP3Stego(file.name, reader.result);
        document.getElementById("counter").value = mp3.spaceLeft();
    };
    reader.readAsArrayBuffer(file);
}
