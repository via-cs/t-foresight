import {inject, observer} from "mobx-react";
import {Box, Divider, List} from "@mui/material";
import StrategyItem from "./StrategyItem.jsx";
import {styled} from "@mui/material/styles";
import PredictorsProjection from "./Projection/index.jsx";

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
                <PredictorsProjection allPredictors={store.allPredictors}
                                      selectedPredictors={store.selectedPredictors}
                                      onSelect={store.selectPredictors}/>
            </Wrapper>
        </Projection>
        <Divider sx={{m: 1}}/>
        <List sx={{overflowY: 'auto'}}>
            <StrategyItem sId={-1} strat={store.selectedPredictorsAsAStrategy}/>
        </List>
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
    paddingTop: '100%',
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