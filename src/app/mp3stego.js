/*
 * Main module. Contains the actual methods for
 * embedding and extracting text messages.
 * @param fileName: mp3 filename
 * @param arrayBuffer: raw mp3 content in bytes
 */
function MP3Stego(fileName, arrayBuffer) {
    // Init private members
    var name = fileName;
    var mp3 = new MP3Parser(arrayBuffer);

    // Sets the flag indicating if a file has been modified.
    // Sets num, which represents the number of frames to read
    // when extracting the file again.
    var _setSignature = function(num) {
        mp3.seekStart();
        _embed(0x1F);   // Set file modified flag
        mp3.nextFrame();
        for (var i = 0; i < 4; i++) {
            _embed((num >> i * 5) & 0x1F);
            mp3.nextFrame();
        }
    };

    // Get the number of frames to be read
    var _getSignature = function() {
        mp3.seekStart();
        mp3.nextFrame();   // Skip flag
        var num = 0;
        for (var i = 0; i < 4; i++) {
            num = num | _extract() << i * 5;
            mp3.nextFrame();
        }
        return num;
    };

    // Embed payload (5 bits) into frame header
    var _embed = function(payload) {
        var header = mp3.getFrameHeader();
        header[0] = (header[0] & 0xFE) | payload >> 4;
        header[1] = (header[1] & 0xF0) | payload & 0x0F;
        mp3.setFrameHeader(header);
    };

    // Extract payload from frame header
    var _extract = function() {
        var header = mp3.getFrameHeader();
        return (header[0] & 0x01) << 4 | (header[1] & 0x0F);
    };

    var _countFrames = function() {
        var frames = 0;
        while (mp3.hasNext()) {
            frames++;
            mp3.nextFrame();
        }
        return frames;
    };

    // Check if file has been previously modified
    this.isModified = function() {
        mp3.seekStart();
        return _extract() == 0x1F;
    };

    // Returns how many characters can be embedded
    // 5 frames are reserved for signature (1 + 4)
    // 13 frames are reserved for encryption (salt + IV)
    this.spaceLeft = function() {
        var frameCount = _countFrames();
        frameCount = frameCount - 5 - 13;
        return Math.trunc(((frameCount * 5) + 1) / 8);
    };

    // Embed message into frame headers
    this.embedText = function(message) {
        // Split message into chunks of 5 bits
        var enc = Base32.encode(message);
        _setSignature(enc.length);
        for (var i = 0; i < enc.length; i++) {
            _embed(enc[i]);
            mp3.nextFrame();
        }
    };

    // Extract message from frame headers
    this.extractText = function() {
        var enc = [];
        var frames = _getSignature();
        for (var i = 0; i < frames; i++) {
            enc.push(_extract());
            mp3.nextFrame();
        }
        return Base32.decode(enc);
    };

    // Trigger the download of the newly created mp3 file
    this.download = function() {
        var blob = new Blob([mp3.getRaw()], { type: "octet-stream" });
        triggerDownload(name, blob);
    };
}
