import {inject, observer} from "mobx-react";
import {Layer, Stage} from "react-konva";
import useMapNavigation from "./useMapNavigation.js";
import KonvaImage from "../../components/KonvaImage.jsx";
import PlayerLayer from "./PlayerLayer.jsx";
import RealTrajectoryLayer from "./RealTrajectoryLayer.jsx";
import StrategyRenderer from "./StrategyRenderer.jsx";
import {useRef} from "react";
import PredictedTrajectoryLayer from "./PredictedTrajectoryLayer.jsx";
import {styled} from "@mui/material/styles";
import Legend from "./Legend.jsx";
import {alpha} from "@mui/material";

/**
 * @param {import('src/store/store.js').Store} store
 * @param {number} size
 * @constructor
 */
function MapRenderer({
                         store, size,
                     }) {
    const ref = useRef(null);
    const {scale, autoFocus, handleWheel, handleRecover, dragBoundFunc} = useMapNavigation(size, ref);
    const scaleBalance = 2 / (scale + 1);

    return <Root>
        <Stage width={size} height={size}
               ref={n => ref.current = n}
               onWheel={handleWheel}
               onDblClick={handleRecover}
               fill={'black'}
               draggable
               dragBoundFunc={dragBoundFunc}>
            <Layer>
                <KonvaImage src={store.mapImage} w={size} h={size}/>
            </Layer>
            {store.selectedPredictorsAsAStrategy && <StrategyRenderer mapSize={size}
                                                                      strat={store.selectedPredictorsAsAStrategy}
                                                                      onAutoFocus={autoFocus}/>}
            {store.viewedPrediction !== -1 && <PredictedTrajectoryLayer mapSize={size}
                                                                        scaleBalance={scaleBalance}
                                                                        prediction={store.predictions[store.viewedPrediction].trajectory}
                                                                        color={store.curColor}/>}
            {store.focusedPlayer !== -1 && <RealTrajectoryLayer mapSize={size} scaleBalance={scaleBalance}/>}
            <PlayerLayer mapSize={size} scaleBalance={scaleBalance}/>
        </Stage>
        <LegendContainer darkMode={store.mapStyle === 'sketch'}>
            <Legend/>
        </LegendContainer>
    </Root>
}

export default inject('store')(observer(MapRenderer))

const Root = styled('div')({
    position: 'relative',
})

const LegendContainer = styled('div', {
    shouldForwardProp: propName => !['darkMode'].includes(propName),
})(({theme, darkMode}) => ({
    position: "absolute",
    right: theme.spacing(1),
    bottom: theme.spacing(1),
    padding: theme.spacing(0, 1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.background.paper, darkMode ? 0.9 : 0.4),
    border: darkMode ? `1px solid grey` : 'none',
}))
