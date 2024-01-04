import {useState} from "react";
import {Menu} from "@mui/material";

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
        <Menu open={contextMenu !== null}
              onClose={onClose}
              anchorReference="anchorPosition"
              anchorPosition={
                  contextMenu !== null
                      ? {top: contextMenu.mouseY, left: contextMenu.mouseX}
                      : undefined
              }
        >
            {children}
        </Menu>
    )

    return {menuFactory, onContextMenu, onClose}
}