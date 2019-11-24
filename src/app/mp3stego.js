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

    var _countFrames = function() {
        var frames = 0;
        while (mp3file.hasNext()) {
            frames++;
            mp3file.nextFrame();
        }
        mp3file.seekStart();
        return frames;
    };

    this.isModified = function() {

    };

    // Returns how many characters can be embedded
    // 5 frames are reserved for signature (1 + 4)
    // 13 frames are reserved for encryption (salt + IV)
    this.spaceLeft = function() {
        var frameCount = _countFrames();
        frameCount = frameCount - 5 - 13;
        return Math.trunc(((frameCount * 5) + 1) / 8);
    };

    this.embed = function(message) {

    };

    this.extract = function() {

    };

    this.download = function() {

    };
}
