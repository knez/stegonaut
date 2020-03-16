[![Build Status](https://travis-ci.com/knez/stegonaut.svg?branch=master)](https://travis-ci.com/knez/stegonaut) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

![](img/logo.png)

`stegonaut` hides plain text messages inside MP3 files.

## Basic Overview

The app works by embedding chunks of text into "unused" bits of each MP3 header.
The "unused" bits are `Priv.Bit`, `Copy`, `Original`, `Emphasis` and are nowadays largely ignored by almost every encoder/decoder.


## Installation

	$ npm install

## Run

(Opens a default browser)

	$ npm start


## Contributions

Any pull requests are more than welcome

