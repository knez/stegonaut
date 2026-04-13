[![CI](https://github.com/knez/stegonaut/actions/workflows/ci.yml/badge.svg)](https://github.com/knez/stegonaut/actions/workflows/ci.yml) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

![](img/logo.png)

`stegonaut` hides plain text messages inside MP3 files.

## Basic Overview

The app works by embedding chunks of text into "unused" bits of each MP3 header.
The "unused" bits are `Priv.Bit`, `Copy`, `Original`, `Emphasis` and are nowadays largely ignored by almost every encoder/decoder.

Messages can optionally be encrypted with a password using AES-256-CTR and PBKDF2 key derivation via the native Web Crypto API.

## Installation

	$ npm install

## Development

	$ npm run dev

Opens the app at http://localhost:5173

## Build

	$ npm run build

Output is written to `dist/`.

## Test

	$ npm test

## Contributions

Any pull requests are more than welcome
