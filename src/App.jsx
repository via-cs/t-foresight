import View from "./components/View";
import TitleBar from "./views/TitleBar";
import {useLayout} from "./utils/layout";
import {styled} from "@mui/material/styles";
import PlayerSelection from "./views/MapView/PlayerSelection";
import {Divider} from "@mui/material";
import Timeline from "./views/MapView/Timeline.jsx";
import MapRenderer from "./views/MapView/MapRenderer.jsx";
import {inject, observer} from "mobx-react";
import Waiting from "./components/Waiting.jsx";
import PlayerLayer from "./views/MapView/PlayerLayer.jsx";

/**
 * @param {import('src/store/store').Store} store
 * @returns {JSX.Element}
 * @constructor
 */
function App({store}) {
    const {
        mapSize,
        appTitleBarWidth,
        mapViewPos,
        strategyViewPos,
        contextViewPos,
    } = useLayout();

    return <Root>
        <TitleBar width={appTitleBarWidth}/>
        <View title={'Map View'} {...mapViewPos}
              tools={[
                  <PlayerSelection team={0}/>,
                  <PlayerSelection team={1}/>
              ]}>
            <MapRenderer size={mapSize}
                         layers={[
                             ({scaleBalance}) => <PlayerLayer mapSize={mapSize} scaleBalance={scaleBalance}/>
                         ]}/>
            <Divider sx={{m: .5}}/>
            <Timeline/>
        </View>
        <View title={'Strategy View'} {...strategyViewPos}/>
        <View title={'Context View'} {...contextViewPos}/>
        <Waiting open={store.waiting}/>
    </Root>
}

export default inject('store')(observer(App));

const Root = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.background.default,
}))
