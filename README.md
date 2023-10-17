# RoadSign for DOTA 2

## How to start it

1. install `NodeJS`
2. install `yarn`
3. run `yarn install` command
4. run `yarn run dev` command
5. visit `http://127.0.0.1:5173`

## Main techniques used

- [React](https://react.dev/): UI framework
- [MobX](https://mobx.js.org/README.html): Data management
- [MUI](https://mui.com/material-ui/getting-started/): UI elements
- [Konva](https://konvajs.org/docs/react/Intro.html): Canvas drawing
- [I18N](https://react.i18next.com/): Change the language (we need an English version in our paper, and a Chinese version for user study)

## Project structures

- `src/components` is for some common and reusable UI elements
- `src/model` declares the data structure
- `src/store` declares the data center
- `src/utils` consists of some tool functions
- `src/views` contains the main UI designs
