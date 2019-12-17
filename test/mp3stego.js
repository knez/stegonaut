var assert = require("assert");
var fs = require("fs");

// Load functions
eval(fs.readFileSync("src/app/mp3parser.js", "utf-8"));
eval(fs.readFileSync("src/app/mp3stego.js", "utf-8"));
eval(fs.readFileSync("src/app/helpers.js", "utf-8"));
eval(fs.readFileSync("src/app/base32.js", "utf-8"));

describe("MP3Stego", function() {

    var mp3;

    // Init mp3 object
    before(function(done) {
        fs.readFile("test/short.mp3", function(err, data) {
            var arrayBuffer = new Uint8Array(data).buffer;
            mp3 = new MP3Stego("short.mp3", arrayBuffer);
            done();
        });
    });

    describe("#isModified()", function() {
        it("should return false", function() {
            assert.equal(mp3.isModified(), false);
        });
    });

    describe("#spaceLeft()", function() {
        it("should return 285", function() {
            assert.equal(mp3.spaceLeft(), 285);
        });
    });

    describe("#embedText()", function() {
        it("should return true if file modified", function() {
            mp3.embedText(encodeUTF8("ALOHA"));
            assert.equal(mp3.isModified(), true);
        }) ;
    });

    describe("#extractText()", function() {
        it("should return 'ALOHA'", function() {
            assert.equal(decodeUTF8(mp3.extractText()), "ALOHA");
        }) ;
    });
});
