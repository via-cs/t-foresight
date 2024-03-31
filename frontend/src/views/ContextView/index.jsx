import {inject, observer} from "mobx-react";
import ContextGroup from "./ContextGroup.jsx";
import {Box} from "@mui/material";
import {contextSortFunctions} from "./contextSortFunctions.js";
import useContextGroups from "./useContextGroups.jsx";

/**
 *
 * @param {import('src/store/store.js').Store} store
 * @return {JSX.Element}
 * @constructor
 */
function ContextView({store}) {
    const cgs = useContextGroups(store);
    cgs.sort(contextSortFunctions[store.contextSort].comparator);

    return <Box width={'100%'} height={'100%'} overflow={'hidden auto'}>
        {cgs.map(cg => (
            <ContextGroup key={cg.key}
                          colorLabel={cg.colorLabel}
                          groupName={cg.groupName}
                          context={cg.context}
                          attention={cg.attention}
                          compAtt={cg.compAtt}/>
        ))}
    </Box>
}

export default inject('store')(observer(ContextView));

