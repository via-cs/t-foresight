import {forwardRef, Fragment, useState} from "react";
import {IconButton, Menu, MenuItem} from "@mui/material";
import {Sort} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import {useStore} from "../../store/store.js";
import {contextSortFunctions} from "./contextSortFunctions.js";
import {Observer} from "mobx-react";

const ContextSortMenu = forwardRef(function (props, ref) {
    const store = useStore();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = event => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const {t} = useTranslation();

    return <Fragment>
        <IconButton {...props}
                    ref={ref}
                    onClick={handleClick}>
            <Sort/>
        </IconButton>
        <Observer>
            {() => (
                <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
                    {Object.keys(contextSortFunctions).map(key => (
                        <MenuItem key={key}
                                  onClick={() => store.setContextSort(key)}
                                  disabled={contextSortFunctions[key].disabled(store)}
                                  selected={store.contextSort === key}>
                            {t(`System.ContextView.Sort.${key}`)}
                        </MenuItem>
                    ))}
                </Menu>
            )}
        </Observer>
    </Fragment>
})

export default ContextSortMenu