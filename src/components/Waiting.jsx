import {Backdrop, CircularProgress} from "@mui/material";

/**
 * @param {boolean} open
 * @param {Function} onClose
 * @returns {JSX.Element}
 * @constructor
 */
export default function Waiting({open, onClose}) {
    return <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={onClose}
    >
        <CircularProgress color="inherit" />
    </Backdrop>
}
