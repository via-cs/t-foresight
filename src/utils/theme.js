import {alpha, darken, lighten} from "@mui/material";

/**
 * @type {import('@mui/material').ThemeOptions}
 */
const scrollColor = '#364041'
export const defaultTheme = {
    palette: {
        primary: {
            main: '#271c1c',
        },
        background: {
            default: '#f0f0f0',
            paper: '#ffffff',
        }
    },
    spacing: 10,
    components: {
        MuiButton: {
            defaultProps: {
                size: "small",
            },
            styleOverrides: {
                root: {
                    minWidth: 0,
                }
            }
        },
        MuiIconButton: {
            defaultProps: {
                size: "small",
            }
        },
        MuiCssBaseline: {
            styleOverrides: theme => ({
                '*::-webkit-scrollbar': {
                    width: 10,
                    height: 10,
                },
                '*::-webkit-scrollbar-track': {
                    display: 'none',
                },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 5,
                },
                '*:hover::-webkit-scrollbar-thumb': {
                    backgroundColor: lighten(theme.palette.primary.main, 0.2),
                },
                '*::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: theme.palette.primary.main,
                },
                '*::-webkit-scrollbar-thumb:active': {
                    backgroundColor: darken(theme.palette.primary.main, 0.2),
                },
            })

        }
    }
}
