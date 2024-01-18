import {inject, observer} from "mobx-react";
import {Fragment, useState} from "react";
import {IconButton, Menu, MenuItem} from "@mui/material";
import {Sort} from "@mui/icons-material";
import {contextSortFunctions} from "./contextSortFunctions.js";
import {useTranslation} from "react-i18next";

/**
 *
 * @param {import('src/store/store.js').Store} store
 * @return {JSX.Element}
 * @constructor
 */
function ContextSortMenu({store}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = event => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const {t} = useTranslation();

    return <Fragment>
        <IconButton onClick={handleClick}><Sort/></IconButton>
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
    </Fragment>
}

export default inject('store')(observer(ContextSortMenu))
