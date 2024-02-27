import {inject, observer} from "mobx-react";
import {useRef} from "react";
import {Group, Layer, Path, Rect, Stage, Text} from "react-konva";
import {styled, useTheme} from "@mui/material/styles";
import useStorylineLayout from "./useLayout.js";
import useStorylineVisualElements from "./useLines.js";
import {selectionColor} from "../../../utils/theme.js";
import {probOpacity} from "../../../utils/encoding.js";

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
    pl: 30,
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
 * @param {number} width
 * @param {number} height
 * @return {JSX.Element}
 * @constructor
 */
function PredictorsStoryline({store, width, height}) {
    const containerRef = useRef(null);
    const data = store.instancesData;
    const layout = useStorylineLayout(data);
    const {lines, groups, lineGap} = useStorylineVisualElements(layout, width, height, config);

    const theme = useTheme();

    return <Container ref={containerRef}>
        <Stage width={width} height={height}>
            <Layer>
                {groups.map((g, gId) => (
                    <Group key={gId}>
                        <Rect x={g.x - lineGap * 2 / 3} y={g.y} width={g.width + lineGap * 4 / 3} height={g.height}
                              fill={theme.palette.background.default}
                              cornerRadius={lineGap / 2}/>
                    </Group>
                ))}
                {layout.stages.map((stage, sId) => stage.instances >= layout.totalInstances * 0.05 && (
                    <Group key={sId}
                           x={config.pl - 5}
                           y={lines[0][sId * 2][1]}>
                        <Text text={(stage.instances / layout.totalInstances * 100).toFixed(1) + '%'}
                              rotation={-90}
                              x={5 - config.pl} height={config.pl}
                              y={(lines[0][sId * 2 + 1][1] - lines[0][sId * 2][1]) / 2 + 50}
                              width={100}
                              align={'center'}
                              verticalAlign={'middle'}/>
                    </Group>

                ))}
                {lines.map((line, lId) => {
                    const selected = store.selectedPredictors.includes(lId),
                        compared = store.comparedPredictors.includes(lId),
                        viewed = store.viewedPredictions.includes(lId);
                    return <Group key={lId}>
                        <Text x={line[0][0] - 15} y={line[0][1] - 8}
                              width={30} height={10}
                              align={'center'}
                              rotation={-45}
                              fontSize={store.viewedPredictions.length === 0 ? config.defaultFontSize
                                  : viewed ? config.highlightFontSize
                                      : 0}
                              text={(lId + 1).toFixed(0)}/>
                        <Path data={createPath(line)}
                              onMouseEnter={() => store.viewPredictions([lId])}
                              onMouseLeave={() => store.viewPredictions([])}
                              opacity={probOpacity(store.predictions[lId]?.probability)}
                              stroke={viewed ? theme.palette.secondary.main
                                  : selected ? selectionColor[0]
                                      : compared ? selectionColor[1]
                                          : theme.palette.text.primary}
                              strokeWidth={(selected || compared || viewed) ? 1 : 1}/>
                    </Group>
                })}
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