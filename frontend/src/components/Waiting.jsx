import {Backdrop, CircularProgress} from "@mui/material";

/**
 * @param {boolean} open
 * @returns {JSX.Element}
 * @constructor
 */
export default function Waiting({open}) {
    return <Backdrop open={open}
                     sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}>
        <CircularProgress color="inherit"/>
    </Backdrop>
}
