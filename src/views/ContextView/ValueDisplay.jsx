import {AccessTime, DarkMode, LightMode} from "@mui/icons-material";
import {formatTime, getWorldPosByLanePos, MAX_X, MAX_Y, MIN_X, MIN_Y} from "../../utils/game.js";
import {keyframes, Typography} from "@mui/material";
import {styled, useTheme} from "@mui/material/styles";
import newArr from "../../utils/newArr.js";

function LevelBar({level}) {
    const theme = useTheme();
    return <div>
        {newArr(5, r =>
            <div key={r}
                 style={{
                     display: 'flex', alignItems: 'center', justifyContent: 'center',
                     margin: '2px 0'
                 }}>
                {newArr(6, c => {
                    const l = r * 6 + c + 1;
                    const arrived = l <= level;
                    const color = [6, 11, 16].includes(l) ? theme.palette.secondary.main : theme.palette.primary.main;
                    return <div key={c}
                                style={{
                                    width: 16, height: 16, margin: '0 2px',
                                    backgroundColor: arrived ? color : theme.palette.background.paper,
                                    border: `1px solid ${color}`,
                                    borderRadius: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                        <Typography variant={'caption'}
                                    sx={{
                                        lineHeight: '16px',
                                        color: arrived ? theme.palette.getContrastText(color) : color
                                    }}>
                            {l}
                        </Typography>
                    </div>
                })}
            </div>
        )}
    </div>
}

function MiniMap({pos}) {
    const x = (pos[0] - MIN_X) / (MAX_X - MIN_X),
        y = (MAX_Y - pos[1]) / (MAX_Y - MIN_Y);
    return <div style={{position: 'relative', paddingTop: '70%', width: '70%', marginLeft: '15%', height: 0}}>
        <img style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}} src={'./minimap.jpg'}/>
        <BlinkPoint style={{top: `${y * 100}%`, left: `${x * 100}%`}}>
            <WavePoint style={{animationDelay: '1s'}}/>
            <WavePoint style={{animationDelay: '2s'}}/>
        </BlinkPoint>
    </div>
}

const Wave = keyframes(`
    0%{transform: scale(1);opacity: 0.95;}
    25%{transform: scale(2);opacity: 0.75;}
    50%{transform: scale(3);opacity: 0.5;}
    75%{transform: scale(4);opacity: 0.25;}
    100%{transform: scale(5);opacity: 0.05;}
`)

const BlinkPoint = styled('div')({
    position: 'absolute',
    transform: 'translate(-50%,-50%)',
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: 'white',
    border: '1px solid black',
})

const WavePoint = styled('div')({
    position: 'absolute',
    top: 1.5,
    left: 1.5,
    width: 5,
    height: 5,
    borderRadius: '50%',
    backgroundColor: 'red',
    animationName: Wave,
    animationDuration: '2s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
})

function HealthBar({value, max, type = 'health'}) {
    const theme = useTheme();
    return <div style={{
        position: 'relative',
        border: '1px solid black',
        marginLeft: '15%',
        width: '70%',
        height: 20,
        borderRadius: theme.shape.borderRadius,
    }}>
        <Typography variant={'caption'}
                    noWrap
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: 'black',
                    }}>
            {value.toFixed(0)} / {max.toFixed(0)}
        </Typography>
        <div style={{
            position: 'absolute',
            top: 0, left: 0,
            height: '100%', width: `${value / max * 100}%`,
            backgroundColor: 'black',
            overflow: 'hidden',
        }}>
            <Typography variant={'caption'}
                        noWrap
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: `${50 * max / value}%`,
                            transform: 'translateX(-50%)',
                            color: 'white',
                        }}>
                {value.toFixed(0)} / {max.toFixed(0)}
            </Typography>
        </div>
    </div>
}

function IconText({icon, text}) {
    return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 20}}>
        <div style={{width: 20, height: 20}}>{icon}</div>
        <Typography variant={'caption'} noWrap sx={{ml: 1}}>{text}</Typography>
    </div>
}

const config = {
    health: ([v, mv]) => <HealthBar value={v} max={mv}/>,
    mana: ([v, mv]) => <HealthBar value={v} max={mv} type={'mana'}/>,
    position: p => <MiniMap pos={p}/>,
    level: l => <LevelBar level={l}/>,
    isAlive: i => <IconText icon={i ? <Alive/> : <Dead/>} text={i ? 'alive' : 'dead'}/>,
    gold: g => <IconText icon={<Gold/>} text={g}/>,
    towerTop1: h => <HealthBar value={h} max={1800}/>,
    towerTop2: h => <HealthBar value={h} max={2500}/>,
    towerTop3: h => <HealthBar value={h} max={2500}/>,
    towerMid1: h => <HealthBar value={h} max={1800}/>,
    towerMid2: h => <HealthBar value={h} max={2500}/>,
    towerMid3: h => <HealthBar value={h} max={2500}/>,
    towerBot1: h => <HealthBar value={h} max={1800}/>,
    towerBot2: h => <HealthBar value={h} max={2500}/>,
    towerBot3: h => <HealthBar value={h} max={2500}/>,
    towerBase1: h => <HealthBar value={h} max={2600}/>,
    towerBase2: h => <HealthBar value={h} max={2600}/>,
    creepTop: r => <MiniMap pos={getWorldPosByLanePos(0, r)}/>,
    creepMid: r => <MiniMap pos={getWorldPosByLanePos(1, r)}/>,
    creepBot: r => <MiniMap pos={getWorldPosByLanePos(2, r)}/>,
    gameTime: t => <IconText icon={<AccessTime/>} text={formatTime(t)}/>,
    isNight: i => <IconText icon={i ? <LightMode/> : <DarkMode/>} text={i ? 'daytime' : 'nighttime'}/>,
    roshanHP: ([v, mv]) => <HealthBar value={v} max={mv}/>,
}

export default function ValueDisplay({valueKey, value}) {
    if (!valueKey || !config[valueKey] || !value) return null;
    return config[valueKey](value);
}

function Gold() {
    return <img width={'100%'} height={'100%'}
                src={"./icons/gold.png"}/>
}

function Alive() {
    return <img width={'100%'} height={'100%'}
                src={"./icons/alive.png"}/>
}

function Dead() {
    return <img width={'100%'} height={'100%'}
                style={{opacity: 0.5}}
                src={"./icons/dead.png"}/>
}
