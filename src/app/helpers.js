// UI-specific utility functions
function clearText() {
    message.value="";
    message.focus();
    charCounter(message);
}

function copyText() {
    message2.select();
    document.execCommand("copy");
    alert("Copied to clipboard!");
}

// Count remaining characters (UTF-8)
function charCounter(textarea) {
    var utf8 = encodeUTF8(textarea.value);
    if (utf8.length > maxChars) {
        var i = maxChars, sync = 0;
        while ((utf8[i--] >> 6) == 2)  // Self-synchronize backwards
            sync++;
        textarea.value = decodeUTF8(utf8.slice(0, maxChars - sync));
    } else {
        counter.value = "Remaining characters: " + (maxChars - utf8.length);
    }
}

// Toggle div
function toggleDiv(div) {
    var x = document.getElementById(div);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

// Reset to landing page
function reset(element) {
    toggleDiv(element);
    toggleDiv("main");
    // Reset all input fields
    input.value = "";
    message.value = "";
    message2.value = "";
    encPwd.value = "";
    decPwd.value = "";
}

function triggerDownload(fileName, blob) {
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}

// CryptoJS WordArray -> Byte Array
function wordArrayToByteArray(wordArray, length) {
    length = wordArray.sigBytes;
    wordArray = wordArray.words;
    var result = [], bytes, i = 0;
    while (length > 0) {
        bytes = wordToByteArray(wordArray[i++], Math.min(4, length));
        length -= bytes.length;
        result.push(bytes);
    }
    return [].concat.apply([], result);
}

function wordToByteArray(word, length) {
    var ba = [];
    if (length > 0)
        ba.push(word >>> 24);
    if (length > 1)
        ba.push((word >>> 16) & 0xFF);
    if (length > 2)
        ba.push((word >>> 8) & 0xFF);
    if (length > 3)
        ba.push(word & 0xFF);
    return ba;
}

// Taken from google closure library
// Convert UTF-16 string -> UTF-8 byte array
function encodeUTF8(str) {
    var out = [], p = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (c < 128) {
            out[p++] = c;
        } else if (c < 2048) {
            out[p++] = (c >> 6) | 192;
            out[p++] = (c & 63) | 128;
        } else if (
            ((c & 0xFC00) == 0xD800) && (i + 1) < str.length &&
            ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
            // Surrogate Pair
            c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
            out[p++] = (c >> 18) | 240;
            out[p++] = ((c >> 12) & 63) | 128;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        } else {
            out[p++] = (c >> 12) | 224;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        }
    }
    return out;
}

// Convert UTF-8 byte array -> UTF-16 string
function decodeUTF8(bytes) {
    var out = [], pos = 0, c = 0;
    var c1, c2, c3, c4;
    while (pos < bytes.length) {
        c1 = bytes[pos++];
        if (c1 < 128) {
            out[c++] = String.fromCharCode(c1);
        } else if (c1 > 191 && c1 < 224) {
            c2 = bytes[pos++];
            out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
        } else if (c1 > 239 && c1 < 365) {
            // Surrogate Pair
            c2 = bytes[pos++];
            c3 = bytes[pos++];
            c4 = bytes[pos++];
            var u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) -
                0x10000;
            out[c++] = String.fromCharCode(0xD800 + (u >> 10));
            out[c++] = String.fromCharCode(0xDC00 + (u & 1023));
        } else {
            c2 = bytes[pos++];
            c3 = bytes[pos++];
            out[c++] =
                String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
        }
    }
    return out.join("");
}
