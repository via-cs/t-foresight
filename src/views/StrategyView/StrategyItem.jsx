import {inject, observer} from "mobx-react";
import {Collapse, List} from "@mui/material";
import {Fragment, useCallback} from "react";
import PredictionItem from "./PredictionItem.jsx";
import VisualItem from "./VisualItem.jsx";
import StrategyMapRenderer from "./MapRenderer/StrategyMapRenderer.jsx";
import {useTranslation} from "react-i18next";

/**
 *
 * @param {number} sId the index of the strategy
 * @param {import('src/store/store.js').Store} store
 * @returns {JSX.Element}
 * @constructor
 */
function StrategyItem({sId, store, strat = null}) {
    const open = sId === store.expandedStrategy;
    const handleView = useCallback(() => store.viewStrategy(sId), [sId]);
    const handleOpen = useCallback(() => store.expandStrategy(sId), [sId]);
    const {t} = useTranslation()
    if (strat === null) strat = store.strategies[sId];

    return <Fragment>
        <VisualItem name={t('translation:System.StrategyView.SID', {sId: sId + 1})}
                    size={'large'}
                    selected={store.viewedStrategy === sId} onSelect={handleView}
                    expanded={store.expandedStrategy === sId}
                    expandLabel={t('translation:System.StrategyView.PredNum', {num: strat.predictors.length})}
                    onExpand={handleOpen}
                    shallow={store.expandedStrategy !== -1 && store.expandedStrategy !== sId}
                    mapSlice={<StrategyMapRenderer sId={sId} strat={strat}/>}
                    prob={strat.predictors.reduce((p, c) => p + c.probability, 0)}/>
        <Collapse in={open} timeout={'auto'} unmountOnExit>
            <List component={'div'} disablePadding>
                {strat.predictors.map((pred, pId) => (
                    <PredictionItem key={pId}
                                    sId={sId}
                                    pId={pId}
                                    strat={strat}
                                    pred={pred}/>
                ))}
            </List>
        </Collapse>
    </Fragment>
}

export default inject('store')(observer(StrategyItem))