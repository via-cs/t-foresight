import {inject, observer} from "mobx-react";
import {List} from "@mui/material";
import StrategyItem from "./StrategyItem.jsx";

/**
 *
 * @param {import('src/store/store.js').Store} store
 * @returns {JSX.Element}
 * @constructor
 */

function StrategyView({store}) {
    return <List sx={{overflowY: 'auto', height: '100%'}}>
        {store.strategies.map((_, sId) => (
            <StrategyItem key={sId}
                          sId={sId}/>
        ))}
    </List>
}

export default inject('store')(observer(StrategyView));