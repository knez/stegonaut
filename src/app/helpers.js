function charCounter(textarea)
{
    if (textarea.value.length > maxChars) {
        textarea.value = textarea.value.substring(0, maxChars);
        return;
    } else {
        counter.value = maxChars - textarea.value.length;
    }
}
