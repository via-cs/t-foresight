import {inject, observer} from "mobx-react";
import {Layer} from "react-konva";
import {mapDis} from "../../../utils/game.js";
import {useEffect} from "react";
import {useTheme} from "@mui/material/styles";
import Traj from "./Traj.jsx";

/**
 * @param {import('src/store/store').Store} store
 * @param {number} mapSize
 * @param {number} scaleBalance
 * @returns {JSX.Element}
 * @constructor
 */
function RealTrajectoryLayer({store, mapSize, scaleBalance, onAutoFocus}) {
    // 0. I have added some example files with some comments.
    //    You can find the file list in README.md.

    // 1. You can get the trajectory of the selected player from store here.
    //    You can refer to store.playerPositions, where I get the current positions of all players.
    //    But you need to get several future positions of the selected player.
    //    e.g., const trajectory = store.selectedPlayerTrajectory;

    const tra = store.selectedPlayerTrajectory;
    const windowedTra = store.selectedPlayerTrajectoryInTimeWindow;

    useEffect(() => {
        const centerPos = store.playerPositions[store.focusedTeam][store.focusedPlayer];
        const radius = Math.max(Math.min(Math.max(...tra.map(pos => mapDis(
            pos,
            store.playerPositions[store.focusedTeam][store.focusedPlayer]
        ))) * 1.2, 3000), 2000);
        onAutoFocus && onAutoFocus(centerPos, radius);
    }, [windowedTra]);

    const theme = useTheme();
    return <Layer>
        <Traj traj={tra}
              mapSize={mapSize}
              scaleBalance={scaleBalance}
              noPointer
              noDash
              opacity={0.4}
              color={theme.palette.secondary.main}
              timeRange={[-450, 150]}
        />
        <Traj traj={windowedTra}
              mapSize={mapSize}
              scaleBalance={scaleBalance}
              noDash
              color={theme.palette.secondary.main}
              timeRange={store.trajTimeWindow}/>
    </Layer>
}


export default inject('store')(observer(RealTrajectoryLayer));
