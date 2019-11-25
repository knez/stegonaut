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

    var bitrateTable = [
        0, 32, 40, 48,
        56, 64, 80, 96,
        112, 128, 160, 192,
        224, 256, 320, 0
    ];

    var srateTable = [
        44.1, 48.0, 32.0, 0.0
    ];

    // Helper variables for unpacking the frame header
    var bitrate, srate, padding;

    // Decode synchsafe integer
    var _synchToInt = function(b) {
        return b[3] | (b[2] << 7) | (b[1] << 14) | (b[0] << 21);
    };

    // Detect tags and skip them (ID3v1 and ID3v2)
    var _skipTags = function() {
        // ID3v1
        var triplet = buffer.slice(end - 128, end - 125);
        var str = String.fromCharCode.apply(String, triplet);
        if (str == "TAG") {
            end = end - 128; // skip
        }
        // ID3v2
        triplet = buffer.slice(0, 3);
        str = String.fromCharCode.apply(String, triplet);
        if (str == "ID3") {
            var size = buffer.slice(6, 10);
            current = start = _synchToInt(size) + 10;
        }
    };

    // Unpack frame header audio metadata
    var _unpack = function() {
        var byte = buffer[current + 2];
        bitrate = bitrateTable[byte >> 4];
        srate = srateTable[(byte & 0x0C) >> 2];
        padding = (byte & 0x02) >> 1;
    };

    _skipTags();

    this.getFrameHeader = function() {

    };

    this.setFrameHeader = function() {

    };

    this.nextFrame = function() {
        _unpack();
        var offset = Math.trunc(144 * bitrate / srate + padding);
        current += offset;
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
