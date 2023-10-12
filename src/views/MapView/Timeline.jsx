import {inject, observer} from "mobx-react";
import {Slider, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import {viewSize} from "../../utils/layout.js";

/**
 * @param {import('src/store/store').Store} store
 * @constructor
 */
function Timeline({
                      store,
                  }) {
    return <Root>
        <Typography>{formatTime(store.curTime)}</Typography>
        <Slider min={1}
                max={store.numFrames}
                value={store.frame + 1}
                onChange={e => store.setFrame(e.target.value - 1)}
                valueLabelDisplay={'auto'}/>
    </Root>
}

export default inject('store')(observer(Timeline))

const Root = styled('div')(({theme}) => ({
    height: viewSize.timelineHeight,
    padding: theme.spacing(1),
}))

function formatTime(t) {
    const sign = t < 0 ? '-' : '';
    t = Math.abs(t);
    const h = Math.floor(t / 3600)
    t -= h * 3600;
    const m = Math.floor(t / 60)
    t -= m * 60;
    const s = Math.floor(t);

    const str = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    if (h === 0) return `${sign}${str}`;
    else return `${sign}${h}:${str}`;
}
