# Stegonaut

Stegonaut is a simple steganography tool that hides plain text messages inside MP3 files.
It does so by embedding text into "unused" bits of each MP3 header.
Those bits are `Priv.Bit`, `Copy`, `Original`, `Emphasis` and are nowadays largely ignored by almost every encoder/decoder.

