import {inject, observer} from "mobx-react";
import {Divider} from "@mui/material";
import {styled} from "@mui/material/styles";
import PredictorsProjection from "./Projection/index.jsx";
import PredictorsMatrix from "./Matrix/index.jsx";
import PredictorsStoryline from "./Storyline/index.jsx";

/**
 *
 * @param {import('src/store/store.js').Store} store
 * @returns {JSX.Element}
 * @constructor
 */

function StrategyView({store}) {
    return <Container>
        <Projection>
            <Wrapper>
                <PredictorsProjection allPredictors={store.predictions}
                                      predictorGroups={store.predictionGroups}
                                      selectedPredictors={store.selectedPredictors}
                                      viewedPredictor={store.viewedPrediction}
                                      onSelectGroup={store.selectPredictors}
                                      onViewPredictor={store.viewPrediction}/>
            </Wrapper>
        </Projection>
        <Divider sx={{m: 1}}/>
        <Detail>
            {store.strategyViewDesign === 'storyline' && <PredictorsStoryline/>}
            {store.strategyViewDesign === 'matrix' && <PredictorsMatrix/>}
        </Detail>
    </Container>
}

export default inject('store')(observer(StrategyView));

const Container = styled('div')({
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
})

const Projection = styled('div')({
    position: 'relative',
    paddingTop: '75%',
    width: '100%',
    height: 0,
})

const Wrapper = styled('div')({
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
})

const Detail = styled('div')({
    position: 'relative',
    flex: 1,
    width: '100%',
    overflow: 'hidden',
})