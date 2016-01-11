# Apple TV app for the SmoothStreams network

## Requirements

- A "new" Apple TV 4th generation or newer
- An official Apple Mac, or some sort of Hackintosh running OSX Yosemite (10.10) or newer
- Xcode 7 or newer
- A USB Type-C cable to connect your computer to the Apple TV

To install, follow [this guide](http://www.redmondpie.com/how-to-sideload-apps-on-apple-tv-4-tutorial/)
using this repository as the source. When you load the project in Xcode for the first time, select
the root "SmoothStreams" project and change the "Bundle Identifier" to something unique to you.

There is very little chance that this app will ever appear in the Apple TV App Store due to the
nature of the SmoothStreams network, so you will have to sideload the app using this method.

## Usage

When you open load the app for the first time, you will be asked to enter your username or email,
then your password. You will then need to select your site and nearest server.

## Updates

For the most part, updates will be loaded each time the app is restarted. Check this repository for
release notes.

## Known Issues / Planned features

- Can't change credentials or server without reinstalling app
- Ugly / plain app icon (Pull Requests welcome!)
- Unicode issue with some characters
- Easily watch other versions of programmes on other channels (720p, HQ/LQ, UK, TSN etc.)

## Issues

Raise bugs or issues either here or on the SmoothStreams forum.

## Development

1. Install dependencies with `npm install`
2. Build the js package with `gulp`, which will monitor source files for changes and rebuild
3. Serve the static site with `python -m SimpleHTTPServer`
4. Change the `TVBootURL` variable in `AppDelegate.swift` to point to the local webserver
