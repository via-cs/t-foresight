import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {defaultTheme} from "./utils/theme.js";
import {Provider} from "mobx-react";
import Store from "./store/store.js";
import 'setimmediate'
import './i18n'

const store = new Store();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <CssBaseline/>
                <App/>
            </ThemeProvider>
        </Provider>
    </React.StrictMode>,
)
