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
import {useTranslation} from "react-i18next";

// React本质上就是用函数表达从数据到视图的映射，每一个不同的映射称为一个组件。
// 当数据发生变化时，React会自动处理视图的变化，并刷新组件的渲染。
// 因此写React代码时，需要着重考虑的问题在于：1. 数据应该怎么变化；2. 不同的数据会渲染出怎样的结果。
// 省略掉的内容在于：数据变化后，视图应该如何变化。

/**
 * @param {import('src/store/store').Store} store
 * @returns {JSX.Element}
 */
function App({store}) {
    // React推荐使用hooks的方式组织数据，复用计算逻辑
    const {
        mapSize,
        appTitleBarWidth,
        mapViewPos,
        strategyViewPos,
        contextViewPos,
    } = useLayout();
    // 用于翻译
    const {t} = useTranslation();

    // 使用类似HTML的方式（即JSX的方式），形象地返回结果（和D3相比，更容易看懂了）
    // Root是下方定义的styled component，TitleBar/View/Waiting都是其他文件定义的组件
    return <Root>
        <TitleBar width={appTitleBarWidth}/>
        <View title={t('System.MapView')} {...mapViewPos}
              tools={[
                  <PlayerSelection team={0}/>,
                  <PlayerSelection team={1}/>
              ]}>
            <MapRenderer size={mapSize}/>
            <Divider sx={{m: .5}}/>
            <Timeline/>
        </View>
        <View title={t('System.StrategyView')} {...strategyViewPos}/>
        <View title={t('System.ContextView')} {...contextViewPos}/>
        <Waiting open={store.waiting}/>
    </Root>
}

// inject用于将数据中心store和组件绑定，我们在组件中就可以访问到store中的数据。
// observer是监听组件，看组件引用了store中的哪些变量。当引用的变量改变时，组件就能自动刷新。
export default inject('store')(observer(App));

// styled component就是将css样式和html元素做绑定，例如，此处定义了一个特定背景颜色的div元素。
const Root = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.background.default,
}))
