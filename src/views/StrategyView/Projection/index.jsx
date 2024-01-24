import usePointLassoSelection from "./usePointLassoSelection.js";
import useLasso from "./useLasso.js";
import {Fragment, useCallback, useRef} from "react";
import ConvexHull, {LassoGroup} from "./ConvexHull.jsx";
import {inject, observer} from "mobx-react";
import useContextMenu from "../../../utils/useContextMenu.jsx";
import {selectionColor} from "../../../utils/theme.js";
import useKeyPressed from "../../../utils/useKeyPressed.js";
import WorkerTagsMenu from "./WorkerTagsMenu.jsx";
import {probOpacity} from "../../../utils/encoding.js";
import Point from "./Point.jsx";
import useOrder from "../../../utils/useOrder.js";

const W = 1000, H = 1000;

/**
 *
 * @param {import('src/model/Strategy.js').Prediction[]} allPredictors
 * @param {number[][]} predictorGroups
 * @param {number[]} selectedPredictors
 * @param {number[]} comparedPredictors
 * @param {number[]} viewedPredictors
 * @param {(predIds: number[], whichGroup: 0 | 1) => void} onSelectGroup
 * @param {(predId: number) => void} onViewPredictor
 * @constructor
 */
function PredictorsProjection({
                                  allPredictors,
                                  predictorGroups,
                                  selectedPredictors,
                                  comparedPredictors,
                                  viewedPredictors,
                                  onSelectGroup,
                                  onViewPredictor,
                                  store,
                              }) {
    const points = store.predictionProjection;
    const [pointOrder, active] = useOrder(points.length);
    const {lasso, isDrawing, handleMouseDown, handleMouseUp, handleMouseMove} = useLasso();
    const shift = useKeyPressed('Shift');
    const preSelectedPointsIdx = usePointLassoSelection(points, lasso);
    const handleClear = useCallback(e => {
        e.preventDefault();
        e.stopPropagation();
        onSelectGroup([], 0);
        onSelectGroup([], 1);
    }, []);

    const tagSelection = useRef([]);
    const {menuFactory, onContextMenu} = useContextMenu();
    const handleContextMenu = pId => e => {
        e.stopPropagation();
        e.preventDefault();
        onContextMenu(e);
        tagSelection.current = pId;
    }
    const handleSelectPoint = pId => e => e.button === 0 && onSelectGroup([pId], Number(e.shiftKey));

    return <Fragment>
        <svg viewBox={`0 0 ${W} ${H}`} width={'100%'} height={'100%'}
             onContextMenu={handleClear}
             onMouseDown={handleMouseDown}
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
                                tags={store.clusterTags(g)}
                                selected={selectedPredictors}
                                onSelectGroup={onSelectGroup}
                                onContextMenu={handleContextMenu(g)}/>
                ))}
            </g>
            <g>
                {pointOrder.map((pId) => {
                    const opacity = probOpacity(allPredictors[pId].probability);
                    return <Point key={pId} pId={pId}
                                  x={points[pId][0] * W} y={points[pId][1] * H}
                                  traj={allPredictors[pId].trajectory}
                                  r={points[pId][2] * W / 20}
                                  tags={store.workerTags[pId]}
                                  opacity={opacity}
                                  selected={selectedPredictors.includes(pId)}
                                  preSelected={preSelectedPointsIdx.includes(pId)}
                                  preSelectColor={selectionColor[Number(shift)]}
                                  compared={comparedPredictors.includes(pId)}
                                  viewed={viewedPredictors.includes(pId)}
                                  isLassoing={isDrawing}
                                  onContextMenu={handleContextMenu([pId])}
                                  onClick={handleSelectPoint(pId)}
                                  onMouseEnter={() => {
                                      onViewPredictor(pId);
                                      active(pId);
                                  }}
                                  onMouseLeave={() => onViewPredictor(-1)}/>
                })}
            </g>
            {isDrawing && <LassoGroup d={'M' + lasso.map(p => `${p[0] * W} ${p[1] * H}`).join('L')}
                                      color={selectionColor[Number(shift)]}
                                      width={W / 200}/>}
        </svg>
        {menuFactory(<WorkerTagsMenu tagSelection={tagSelection.current}/>)}
    </Fragment>
}

export default inject('store')(observer(PredictorsProjection));