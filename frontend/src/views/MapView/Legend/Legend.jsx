import {Moving, MultipleStop} from "@mui/icons-material";
import {styled} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import {HeatmapColorMap} from "../Heatmap/useHeatmap.js";
import {Radio, Typography} from "@mui/material";
import {inject, observer} from "mobx-react";

function Legend({store}) {
    const {t} = useTranslation();
    return <div style={{width: 160}}>
        <LegendItem>
            <Moving sx={{mr: 1}} color={'secondary'}/>
            <Typography variant={'caption'}>{t('System.MapView.RealTraj')}</Typography>
        </LegendItem>

        <LegendItem>
            <MultipleStop sx={{mr: 1}} color={'secondary'}/>
            <Typography variant={'caption'}>{t('System.MapView.PredTraj')}</Typography>
        </LegendItem>

        <LegendItem style={{justifyContent: 'space-between', flexWrap: 'wrap'}}>
            <Typography sx={{width: '100%'}} variant={'caption'}>{t('System.MapView.PossibleDest')}:</Typography>
            <HeatmapColorMap style={{height: 10, width: '100%'}}/>
            <Typography sx={{width: '50%'}}
                        variant={'caption'}>{t('System.MapView.LowPossibility')}</Typography>
            <Typography sx={{width: '50%', textAlign: 'right'}}
                        variant={'caption'}>{t('System.MapView.HighPossibility')}</Typography>
        </LegendItem>

        <LegendItem style={{justifyContent: 'space-between', flexWrap: 'wrap'}}>
            <Typography sx={{width: '100%'}} variant={'caption'}>{t('System.MapView.MapStyle')}:</Typography>
            <div>
                <Radio sx={{p: 0}}
                       color={"default"}
                       checked={store.mapStyle === 'colored'}
                       onClick={() => store.setMapStyle('colored')}/>
                <Typography variant={'caption'}>{t('System.MapView.ColoredMap')}:</Typography>
            </div>
            <div>
                <Radio sx={{p: 0}}
                       color={'default'}
                       checked={store.mapStyle === 'sketch'}
                       onClick={() => store.setMapStyle('sketch')}/>
                <Typography variant={'caption'}>{t('System.MapView.SketchMap')}:</Typography>
            </div>
            <div>
                <Radio sx={{p: 0}}
                       color={'default'}
                       checked={store.mapStyle === 'grey'}
                       onClick={() => store.setMapStyle('grey')}/>
                <Typography variant={'caption'}>{t('System.MapView.GreyMap')}:</Typography>
            </div>
        </LegendItem>
    </div>
}

export default inject('store')(observer(Legend));

const LegendItem = styled('div')(({theme}) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(1, 0),
}))