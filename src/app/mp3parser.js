/*
 * Provides a mechanism for iterating through
 * an mp3 file frame by frame, and modifying their headers.
 * @param arrayBuffer: raw mp3 content in bytes
 */
function MP3Parser(arrayBuffer) {
    // Init stuff
    var buffer = new Uint8Array(arrayBuffer);
    var start = 0;
    var current = 0;
    var end = buffer.byteLength;

    // TODO
    var _skipTags = function() {

    };

    _skipTags();

    this.getFrameHeader = function() {

    };

    this.setFrameHeader = function() {

    };

    this.nextFrame = function() {

    };

    this.hasNext = function() {
        return current < end;
    };

    this.seekStart = function() {
        current = start;
    };

    this.getRaw = function() {
        return buffer;
    };
}
