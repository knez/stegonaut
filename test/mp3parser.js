var assert = require("assert");
var fs = require("fs");

// Load functions
eval(fs.readFileSync("src/app/mp3parser.js", "utf-8"));

describe("MP3Parser", function() {

    var mp3;

    // Init mp3 object
    before(function(done) {
        fs.readFile("test/short.mp3", function(err, data) {
            var arrayBuffer = new Uint8Array(data).buffer;
            mp3 = new MP3Parser(arrayBuffer);
            done();
        });
    });

    describe("#getFrameHeader()", function() {
        // Test if ID3v2 tags are skipped
        it("should return [144, 192]", function() {
            assert.deepEqual(mp3.getFrameHeader(), [144, 192]);
        });
    });

    describe("#hasNext()", function() {
        it("should return true", function() {
            assert.equal(mp3.hasNext(), true);
        });
    });

    describe("#nextFrame()", function() {
        it("should return [146, 192]", function() {
            mp3.nextFrame();
            assert.deepEqual(mp3.getFrameHeader(), [146, 192]);
        });
    });

    describe("#setFrameHeader()", function() {
        it("should set the header to [255, 255]", function() {
            mp3.setFrameHeader([255, 255]);
            assert.deepEqual(mp3.getFrameHeader(), [255, 255]);
        });
    });

    describe("#seekStart()", function() {
        it("should return [144, 192] ", function() {
            mp3.seekStart();
            assert.deepEqual(mp3.getFrameHeader(), [144, 192]);
        });
    });
});
