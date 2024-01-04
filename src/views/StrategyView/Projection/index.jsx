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

const W = 1000, H = 1000;

/**
 *
 * @param {import('src/model/Strategy.js').Prediction[]} allPredictors
 * @param {number[][]} predictorGroups
 * @param {number[]} selectedPredictors
 * @param {number} viewedPredictor
 * @param {(predIds: number[]) => void} onSelectGroup
 * @param {(predId: number) => void} onViewPredictor
 * @constructor
 */
function PredictorsProjection({
                                  allPredictors,
                                  predictorGroups,
                                  selectedPredictors,
                                  viewedPredictor,
                                  onSelectGroup,
                                  onViewPredictor,
                                  store,
                              }) {
    const points = store.predictionProjection;
    const {lasso, isDrawing, handleMouseDown, handleMouseUp, handleMouseMove} = useLasso();
    const preSelectedPointsIdx = usePointLassoSelection(points, lasso);
    const handleClear = useCallback(e => {
        e.preventDefault();
        e.stopPropagation();
        onSelectGroup([]);
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

    const theme = useTheme();
    return <Fragment>
        <svg viewBox={`0 0 ${W} ${H}`} width={'100%'} height={'100%'}
             onContextMenu={handleClear}
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onMouseUp={e => {
                 if (isDrawing) onSelectGroup(preSelectedPointsIdx);
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
                                   viewed={viewedPredictor === pId}
                                   isDrawing={isDrawing}
                                   r={points[pId][2] * W / 20}
                                   onContextMenu={handleContextMenu([pId])}
                                   onMouseEnter={() => onViewPredictor(pId)}
                                   onMouseLeave={() => onViewPredictor(-1)}/>
                        </Tooltip>
                        {isDrawing
                            ? <PointAnchor preSelected={preSelectedPointsIdx.includes(pId)}/>
                            : <PointIdx
                                fill={theme.palette.getContrastText(lighten(theme.palette.primary.main, 1 - opacity))}>{pId + 1}</PointIdx>}
                    </g>
                })}
            </g>
            {isDrawing && <LassoGroup d={'M' + lasso.map(p => `${p[0] * W} ${p[1] * H}`).join('L')}
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
    shouldForwardProp: propName => !['selected', 'isDrawing', 'viewed'].includes(propName)
})(({theme, selected, isDrawing, viewed}) => ({
    fill: theme.palette.primary.main,
    ...(isDrawing && {
        pointerEvents: 'none',
    }),
    ...(!isDrawing && viewed && {
        stroke: theme.palette.secondary.main,
        strokeWidth: W / 200,
    }),
    ...(selected && {
        stroke: theme.palette.success.main,
        strokeWidth: W / 200,
    })
}))
const PointIdx = styled('text')({
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: W / 20,
    pointerEvents: 'none',
})
const PointAnchor = styled('circle', {
    shouldForwardProp: propName => !['preSelected'].includes(propName)
})(({theme, preSelected}) => ({
    r: W / 100,
    fill: preSelected ? theme.palette.success.main : theme.palette.primary.main,
}))