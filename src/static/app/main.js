import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/style.css";
import { MP3Stego } from "./mp3stego.js";
import { encodeUTF8, decodeUTF8, checkPassword, toggleDiv } from "./helpers.js";

let mp3, maxChars;

// Init DOM elements
let input, encPwd, decPwd, counter, message, message2;

function enableHoverEffects() {
    const e = document.getElementById("dropArea");
    e.ondragover = function(ev) { ev.preventDefault(); e.classList.add("drag-over"); };
    e.ondragleave = function() { e.classList.remove("drag-over"); };
    e.ondrop = function() { e.classList.remove("drag-over"); };
}

// Count remaining characters (UTF-8)
function charCounter(textarea) {
    const utf8 = encodeUTF8(textarea.value);
    if (utf8.length > maxChars) {
        let i = maxChars, sync = 0;
        while ((utf8[i--] >> 6) == 2)  // Self-synchronize backwards
            sync++;
        textarea.value = decodeUTF8(utf8.slice(0, maxChars - sync));
    } else {
        counter.value = "Remaining characters: " + (maxChars - utf8.length);
    }
}

function clearText() {
    message.value = "";
    message.focus();
    charCounter(message);
}

async function copyText() {
    await navigator.clipboard.writeText(message2.value);
    const btn = document.querySelector("#extractBox [data-action=\"copy\"]");
    const original = btn.textContent;
    btn.textContent = "Copied!";
    btn.disabled = true;
    setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
    }, 1500);
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

// Load raw mp3 to buffer
function loadFile() {
    const file = input.files[0];
    if (!file) return;
    if (!file.name.endsWith(".mp3")) {
        alert("Not an MP3 ¯\\_(ツ)_/¯");
        return;
    }
    const reader = new FileReader();
    reader.onerror = () => alert("Failed to read file");
    reader.onload = () => {
        try {
            mp3 = new MP3Stego(file.name, reader.result);
            initScreen();
        } catch (err) {
            alert("Invalid MP3: " + err.message);
        }
    };
    reader.readAsArrayBuffer(file);
}

// Load proper box depending on input
function initScreen() {
    toggleDiv("main");  // Hide main screen
    if (mp3.isModified()) {
        toggleDiv("extractBox");
    } else {
        maxChars = mp3.spaceLeft();
        counter.value = "Remaining characters: " + maxChars;
        toggleDiv("embedBox");
    }
}

async function encryptText(str, password) {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await crypto.subtle.importKey(
        "raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]
    );
    const key = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        keyMaterial,
        { name: "AES-CTR", length: 256 },
        false,
        ["encrypt"]
    );
    const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-CTR", counter: iv, length: 64 },
        key,
        enc.encode(str)
    );
    // Prepend salt (16 bytes) + iv (16 bytes) to ciphertext
    const result = new Uint8Array(32 + ciphertext.byteLength);
    result.set(salt, 0);
    result.set(iv, 16);
    result.set(new Uint8Array(ciphertext), 32);
    return Array.from(result);
}

async function decryptText(bytes, password) {
    const enc = new TextEncoder();
    const arr = new Uint8Array(bytes);
    const salt = arr.slice(0, 16);
    const iv = arr.slice(16, 32);
    const ciphertext = arr.slice(32);
    const keyMaterial = await crypto.subtle.importKey(
        "raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]
    );
    const key = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        keyMaterial,
        { name: "AES-CTR", length: 256 },
        false,
        ["decrypt"]
    );
    const plaintext = await crypto.subtle.decrypt(
        { name: "AES-CTR", counter: iv, length: 64 },
        key,
        ciphertext
    );
    return Array.from(new Uint8Array(plaintext));
}

// Embed text into mp3 and trigger download
async function embedText() {
    const btn = document.querySelector("#embedBox [data-action=\"embed\"]");
    btn.disabled = true;
    btn.textContent = "Embedding…";
    try {
        if (!checkPassword(encPwd.value)) return;
        const str = message.value;
        let bytes;
        if (encPwd.value) {
            bytes = await encryptText(str, encPwd.value);
        } else {
            bytes = encodeUTF8(str);
        }
        mp3.embedText(bytes);
        mp3.download();
    } catch (err) {
        alert("Embed failed: " + err.message);
    } finally {
        btn.disabled = false;
        btn.textContent = "Embed";
    }
}

// Extract text from an mp3 file
async function extractText() {
    const btn = document.querySelector("#extractBox [data-action=\"extract\"]");
    btn.disabled = true;
    btn.textContent = "Extracting…";
    try {
        if (!checkPassword(decPwd.value)) return;
        let bytes = mp3.extractText();
        if (decPwd.value) {
            bytes = await decryptText(bytes, decPwd.value);
        }
        message2.value = decodeUTF8(bytes);
    } catch (err) {
        alert("Extract failed: " + err.message);
    } finally {
        btn.disabled = false;
        btn.textContent = "Extract";
    }
}

function initDarkMode() {
    const toggle = document.getElementById("darkToggle");
    const apply = (dark) => {
        document.documentElement.classList.toggle("dark", dark);
        toggle.textContent = dark ? "☀" : "☾";
    };
    const saved = localStorage.getItem("dark") === "true";
    apply(saved);
    toggle.addEventListener("click", () => {
        const dark = !document.documentElement.classList.contains("dark");
        localStorage.setItem("dark", dark);
        apply(dark);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Init DOM elements
    input = document.getElementById("input");
    encPwd = document.getElementById("encPwd");
    decPwd = document.getElementById("decPwd");
    counter = document.getElementById("counter");
    message = document.getElementById("message");
    message2 = document.getElementById("message2");

    enableHoverEffects();
    initDarkMode();
    document.getElementById("input").addEventListener("change", loadFile);
    document.getElementById("dropArea").querySelector("button").addEventListener("click", () => input.click());
    // embedBox buttons
    document.querySelector("#embedBox [data-action=\"clear\"]").addEventListener("click", clearText);
    document.querySelector("#embedBox [data-action=\"embed\"]").addEventListener("click", embedText);
    document.querySelector("#embedBox [data-action=\"reset\"]").addEventListener("click", () => reset("embedBox"));
    // extractBox buttons
    document.querySelector("#extractBox [data-action=\"copy\"]").addEventListener("click", copyText);
    document.querySelector("#extractBox [data-action=\"extract\"]").addEventListener("click", extractText);
    document.querySelector("#extractBox [data-action=\"reset\"]").addEventListener("click", () => reset("extractBox"));
    // charCounter
    document.getElementById("message").addEventListener("keyup", function() { charCounter(this); });
});
