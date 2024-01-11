import {Button, ClickAwayListener, Tooltip} from "@mui/material";
import LegendIcon from "./LegendIcon.jsx";
import {useState} from "react";
import Legend from "./Legend.jsx";
import {useTranslation} from "react-i18next";

function MapLegendTrigger() {
    const [open, setOpen] = useState(false);
    const handleTooltipClose = () => setOpen(false);
    const handleTooltipToggle = () => setOpen(s => !s);
    const {t} = useTranslation();

    return <ClickAwayListener onClickAway={handleTooltipClose}>
        <div>
            <Tooltip PopperProps={{disablePortal: true}}
                     onClose={handleTooltipClose}
                     open={open}
                     disableFocusListener
                     disableHoverListener
                     disableTouchListener
                     title={<Legend/>}>
                <Button onClick={handleTooltipToggle} startIcon={<LegendIcon/>}>
                    {t("System.MapView.Legend")}
                </Button>
            </Tooltip>
        </div>
    </ClickAwayListener>
}

export default MapLegendTrigger;