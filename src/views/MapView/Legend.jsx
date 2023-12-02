import {Moving, MultipleStop} from "@mui/icons-material";
import {styled} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import {HeatmapColorMap} from "./useHeatmap.js";
import {Typography} from "@mui/material";

function Legend({}) {
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
    </div>
}

export default Legend;

const LegendItem = styled('div')(({theme}) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(1, 0),
}))