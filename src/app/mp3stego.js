/*
 * Main module. Contains the actual methods for
 * embedding and extracting text messages.
 * @param fileName: mp3 filename
 * @param arrayBuffer: raw mp3 content in bytes
 */
function MP3Stego(fileName, arrayBuffer) {
    // Init private members
    var name = fileName;
    var mp3file = new MP3Parser(arrayBuffer);

    this.isModified = function() {

    };

    this.spaceLeft = function() {

    };

    this.embed = function(message) {

    };

    this.extract = function() {

    };

    this.download = function() {

    };
}
