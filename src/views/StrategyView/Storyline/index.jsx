import {inject, observer} from "mobx-react";
import {useRef} from "react";
import useSize from "../../../utils/useSize.js";
import {Group, Layer, Path, Rect, Stage, Text} from "react-konva";
import {styled, useTheme} from "@mui/material/styles";
import useStorylineLayout from "./useLayout.js";
import useStorylineLines from "./useLines.js";

function createPath(line) {
    let path = `M${line[0][0]} ${line[0][1]}`;
    for (let s = 1, t = 2; t < line.length; s += 2, t += 2) {
        path += `V${line[s][1]}`;
        path += `C${line[s][0]} ${line[s][1] * 0.7 + line[t][1] * 0.3} ${line[t][0]} ${line[s][1] * 0.3 + line[t][1] * 0.7} ${line[t][0]} ${line[t][1]}`
    }
    path += `V${line[line.length - 1][1]}`;
    return path;
}

const config = {
    pt: 30,
    pb: 10,
    pl: 20,
    pr: 20,
    stageMaxGap: 100,
    stageGapMaxRatio: 0.2,
    lineMaxGap: 10,
    lineGapMaxRatio: 0.2,
    defaultFontSize: 10,
    highlightFontSize: 20,
}

/**
 *
 * @param {import('src/store/store.js').Store} store
 * @return {JSX.Element}
 * @constructor
 */
function PredictorsStoryline({store}) {
    const containerRef = useRef(null);
    const {width, height} = useSize(containerRef);
    const data = store.instancesData;
    const layout = useStorylineLayout(data);
    const lines = useStorylineLines(layout, width, height, config);

    const theme = useTheme();

    return <Container ref={containerRef}>
        <Stage width={width} height={height}>
            <Layer>
                {layout.stages.map((stage, sId) => (
                    <Group key={sId}
                           x={config.pl - 5}
                           y={lines[0][sId * 2][1]}>
                        <Rect width={width - config.pl - config.pr + 10}
                              height={lines[0][sId * 2 + 1][1] - lines[0][sId * 2][1]}
                              fill={theme.palette.background.default}/>
                        <Text text={(stage.instances / layout.totalInstances * 100).toFixed(1) + '%'}
                              rotation={-90}
                              x={5 - config.pl} height={config.pl}
                              y={(lines[0][sId * 2 + 1][1] - lines[0][sId * 2][1]) / 2 + 50}
                              width={100}
                              align={'center'}
                              verticalAlign={'middle'}/>
                    </Group>

                ))}
                {lines.map((line, lId) => <Group key={lId}>
                    <Text x={line[0][0] - 15} y={line[0][1] - 8}
                          width={30} height={10}
                          align={'center'}
                          rotation={-45}
                          fontSize={store.viewedPrediction === -1
                              ? config.defaultFontSize
                              : store.viewedPrediction === lId
                                  ? config.highlightFontSize
                                  : 0}
                          text={(lId + 1).toFixed(0)}/>
                    <Path data={createPath(line)}
                          onMouseEnter={() => store.viewPrediction(lId)}
                          onMouseLeave={() => store.viewPrediction(-1)}
                          opacity={Math.min(1, store.predictions[lId]?.probability * 10)}
                          stroke={store.viewedPrediction === lId
                              ? theme.palette.secondary.main
                              : store.selectedPredictors.includes(lId)
                                  ? theme.palette.success.main
                                  : theme.palette.text.primary}
                          strokeWidth={(store.selectedPredictors.includes(lId) || store.viewedPrediction === lId) ? 4 : 2}/>
                </Group>)}
            </Layer>
        </Stage>
    </Container>
}

export default inject('store')(observer(PredictorsStoryline));

const Container = styled('div')({
    width: '100%',
    height: '100%',
    overflow: 'hidden auto',
})