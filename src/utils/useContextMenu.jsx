import {useState} from "react";
import {Popover} from "@mui/material";

export default function useContextMenu() {
    const [contextMenu, setContextMenu] = useState(null);
    const onContextMenu = e => {
        e.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: e.clientX + 2,
                    mouseY: e.clientY - 6,
                }
                : null,
        );
    }
    const onClose = () => setContextMenu(null);
    const menuFactory = children => (
        <Popover open={contextMenu !== null}
                 onClose={onClose}
                 anchorReference="anchorPosition"
                 anchorPosition={
                     contextMenu !== null
                         ? {top: contextMenu.mouseY, left: contextMenu.mouseX}
                         : undefined
                 }
        >
            {children}
        </Popover>
    )

    return {menuFactory, onContextMenu, onClose}
}