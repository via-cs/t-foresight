/**
 * @type {import('@mui/material').ThemeOptions}
 */
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
            }
        }
    }
}
