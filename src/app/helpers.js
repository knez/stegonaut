function charCounter(textarea)
{
    if (textarea.value.length > maxChars) {
        textarea.value = textarea.value.substring(0, maxChars);
        return;
    } else {
        counter.value = maxChars - textarea.value.length;
    }
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
