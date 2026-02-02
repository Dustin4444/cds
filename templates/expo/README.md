# Coinbase Design System - Expo Template

A React Native application template integrated with Coinbase Design System (CDS) using Expo.

## Tech Stack

- **Expo SDK 53** with New Architecture enabled
- **React Native** (Fabric + TurboModules)
- **React 19**
- **TypeScript**

## Installation

Use `gitpick` to create a new project from this template:

```sh
npx -y gitpick coinbase/cds/tree/master/templates/expo cds-expo
cd cds-expo
```

## Setup

We suggest [nvm](https://github.com/nvm-sh/nvm/tree/master) to manage Node.js versions. If you have it installed, you can use these commands to set the correct Node.js version. Using corepack ensures you have your package manager setup.

```sh
nvm install
nvm use
corepack enable
yarn
```

## Development

Start the Expo development server:

```sh
yarn start
```

This will display a QR code. You can:

- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Scan the QR code with Expo Go on your device

### Run with native build

For a full development build with native debugging:

```sh
# iOS (requires Xcode)
yarn ios

# Android (requires Android Studio)
yarn android
```

## Available Scripts

| Command        | Description                       |
| -------------- | --------------------------------- |
| `yarn start`   | Start the Expo development server |
| `yarn ios`     | Build and run on iOS              |
| `yarn android` | Build and run on Android          |
| `yarn web`     | Start the web version             |

## Debugging

- Press `j` in the Metro terminal to open the JavaScript debugger
- Press `m` to toggle the developer menu
- Press `r` to reload the app

## Documentation

Visit [cds.coinbase.com](https://cds.coinbase.com) for the latest CDS documentation and component examples.
