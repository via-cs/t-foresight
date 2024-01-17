import usePointLassoSelection from "./usePointLassoSelection.js";
import useLasso from "./useLasso.js";
import {styled, useTheme} from "@mui/material/styles";
import {lighten, MenuItem, Tooltip} from "@mui/material";
import {Fragment, useCallback, useRef} from "react";
import ConvexHull from "./ConvexHull.jsx";
import LassoGroup from "./Group.js";
import {inject, observer} from "mobx-react";
import useContextMenu from "../../../utils/useContextMenu.jsx";
import joinSet from "../../../utils/joinSet.js";
import {selectionColor} from "../../../utils/theme.js";
import useKeyPressed from "../../../utils/useKeyPressed.js";

const W = 1000, H = 1000;

/**
 *
 * @param {import('src/model/Strategy.js').Prediction[]} allPredictors
 * @param {number[][]} predictorGroups
 * @param {number[]} selectedPredictors
 * @param {number[]} selectedPredictors2
 * @param {number} viewedPredictor
 * @param {(predIds: number[], whichGroup: 0 | 1) => void} onSelectGroup
 * @param {(predId: number) => void} onViewPredictor
 * @constructor
 */
function PredictorsProjection({
                                  allPredictors,
                                  predictorGroups,
                                  selectedPredictors,
                                  selectedPredictors2,
                                  viewedPredictor,
                                  onSelectGroup,
                                  onViewPredictor,
                                  store,
                              }) {
    const points = store.predictionProjection;
    const {lasso, isDrawing, handleMouseDown, handleMouseUp, handleMouseMove} = useLasso();
    const shift = useKeyPressed('Shift');
    const preSelectedPointsIdx = usePointLassoSelection(points, lasso);
    const handleClear = useCallback(e => {
        e.preventDefault();
        e.stopPropagation();
        onSelectGroup([], 0);
        onSelectGroup([], 1);
    }, []);

    const tagSelection = useRef(-1);
    const {menuFactory, onContextMenu, onClose} = useContextMenu();
    const handleAddTag = () => {
        onClose();
        const tag = window.prompt('Input the tag name:');
        if (!tag) return;
        store.addTag(tagSelection.current, tag);
    }
    const handleRemoveTag = () => {
        onClose();
        const tag = window.prompt('Input the tag name:');
        if (!tag) return;
        store.removeTag(tagSelection.current, tag);
    }
    const handleClearTag = () => {
        onClose();
        store.clearTag(tagSelection.current)
    }
    const handleContextMenu = pId => e => {
        e.stopPropagation();
        e.preventDefault();
        onContextMenu(e);
        tagSelection.current = pId;
    }
    const handleSelectPoint = pId => e => e.button === 0 && onSelectGroup([pId], Number(e.shiftKey));

    const theme = useTheme();
    return <Fragment>
        <svg viewBox={`0 0 ${W} ${H}`} width={'100%'} height={'100%'}
             onContextMenu={handleClear}
             onMouseDown={e => {
                 if (e.shiftKey) setShift(true);
                 handleMouseDown(e);
             }}
             onMouseMove={handleMouseMove}
             onMouseUp={e => {
                 if (isDrawing) onSelectGroup(preSelectedPointsIdx, shift ? 1 : 0);
                 handleMouseUp(e);
             }}>
            <g>
                {predictorGroups.map((g, gId) => (
                    <ConvexHull key={gId}
                                predictorGroup={g}
                                points={points}
                                tags={joinSet(g.map(w => store.workerTags[w]))}
                                selected={selectedPredictors}
                                onSelectGroup={onSelectGroup}
                                onContextMenu={handleContextMenu(g)}/>
                ))}
            </g>
            <g>
                {allPredictors.map((p, pId) => {
                    const opacity = Math.min(p.probability * 5, 1);
                    return <g key={pId}
                              transform={`translate(${points[pId][0] * W}, ${points[pId][1] * H})`}>
                        <Tooltip title={Array.from(store.workerTags[pId]).join(', ')}>
                            <Point fillOpacity={opacity}
                                   selected={selectedPredictors.includes(pId)}
                                   compared={selectedPredictors2.includes(pId)}
                                   viewed={viewedPredictor === pId}
                                   isDrawing={isDrawing}
                                   r={points[pId][2] * W / 20}
                                   onContextMenu={handleContextMenu([pId])}
                                   onClick={handleSelectPoint(pId)}
                                   onMouseEnter={() => onViewPredictor(pId)}
                                   onMouseLeave={() => onViewPredictor(-1)}/>
                        </Tooltip>
                        {isDrawing
                            ? <PointAnchor preSelected={preSelectedPointsIdx.includes(pId)}
                                           color={selectionColor[Number(shift)]}/>
                            : <PointIdx
                                fill={theme.palette.getContrastText(lighten(theme.palette.primary.main, 1 - opacity))}>{pId + 1}</PointIdx>}
                    </g>
                })}
            </g>
            {isDrawing && <LassoGroup d={'M' + lasso.map(p => `${p[0] * W} ${p[1] * H}`).join('L')}
                                      color={selectionColor[Number(shift)]}
                                      width={W / 200}/>}
        </svg>
        {menuFactory([
            <MenuItem key={'add'} onClick={handleAddTag}>Add Tag</MenuItem>,
            <MenuItem key={'rem'} onClick={handleRemoveTag}>Remove Tag</MenuItem>,
            <MenuItem key={'clr'} onClick={handleClearTag}>Clear Tag</MenuItem>,
        ])}
    </Fragment>
}

export default inject('store')(observer(PredictorsProjection));
const Point = styled('circle', {
    shouldForwardProp: propName => !['selected', 'isDrawing', 'viewed', 'compared'].includes(propName)
})(({theme, selected, isDrawing, viewed, compared}) => ({
    fill: theme.palette.primary.main,
    ...(isDrawing && {
        pointerEvents: 'none',
    }),
    ...(selected && {
        stroke: selectionColor[0],
        strokeWidth: W / 200,
    }),
    ...(compared && {
        stroke: selectionColor[1],
        strokeWidth: W / 200,
    }),
    ...(!isDrawing && viewed && {
        stroke: theme.palette.success.main,
        strokeWidth: W / 200,
    }),
}))
const PointIdx = styled('text')({
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: W / 20,
    pointerEvents: 'none',
})
const PointAnchor = styled('circle', {
    shouldForwardProp: propName => !['preSelected', 'color'].includes(propName)
})(({theme, preSelected, color}) => ({
    r: W / 100,
    fill: preSelected ? color : theme.palette.primary.main,
}))