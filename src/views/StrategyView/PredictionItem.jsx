import {inject, observer} from "mobx-react";
import VisualItem from "./VisualItem.jsx";
import {useCallback} from "react";
import PredictionMapRenderer from "./MapRenderer/PredictionMapRenderer.jsx";

/**
 *
 * @param {number} sId
 * @param {number} pId
 * @param {import('src/store/store.js').Store} store
 * @param {import('src/model/Strategy.d.ts').Strategy} strat
 * @param {import('src/model/Strategy.d.ts').Prediction} pred
 * @returns {JSX.Element}
 * @constructor
 */
function PredictionItem({sId, pId, store, strat, pred}) {
    const handleView = useCallback(() => store.viewPrediction(sId, pId), [sId, pId]);

    return <VisualItem name={`Pred. ${pId + 1}`}
                       size={'small'}
                       selected={store.viewedStrategy === sId && store.viewedPrediction === pId} onSelect={handleView}
                       mapSlice={<PredictionMapRenderer sId={sId} pId={pId} strat={strat} pred={pred}/>}
                       prob={pred.probability}/>
}

export default inject('store')(observer(PredictionItem))
