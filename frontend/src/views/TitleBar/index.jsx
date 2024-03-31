/**
 *
 * @param {number} width
 * @constructor
 */
import {Button, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import {viewSize} from "../../utils/layout.js";
import {inject, observer} from "mobx-react";
import {readJSONFile, selectFile} from "../../utils/file.js";
import {useTranslation} from "react-i18next";
import {Signpost} from "@mui/icons-material";
import {useState} from "react";
import Settings from "./Settings.jsx";

/**
 * @param {number} width
 * @param {import('src/store/store').Store} store
 * @returns {JSX.Element}
 * @constructor
 */
function TitleBar({width, store}) {
    const {t} = useTranslation();
    const [settings, setSettings] = useState(false);
    const handleOpenSettings = () => setSettings(true);
    const handleCloseSettings = () => setSettings(false);

    const handleImportData = () => {
        selectFile()
            .then(file => {
                store.setWaiting(true);
                return readJSONFile(file);
            })
            .catch(window.alert)
            .then(data => store.setData(data.filename, data.data))
            .finally(() => store.setWaiting(false));
    }
    const handleImportCase = () => {
        selectFile()
            .then(file => {
                store.setWaiting(true);
                return readJSONFile(file);
            })
            .catch(window.alert)
            .then(data => {
                if (data.data.match_id !== store.gameData.gameInfo.match_id)
                    throw new Error("The case is not for this match!");
                store.setCase(data.data);
            })
            .catch(window.alert)
            .finally(() => store.setWaiting(false));
    }
    const handleSaveCase = () => store.saveCase();

    return <Bar style={{width}}>
        <Button color={store.devMode ? 'secondary' : 'inherit'}
                onClick={handleOpenSettings}>
            <Signpost/>
        </Button>
        <Typography variant={'h5'}>{t('System.SystemName')}</Typography>
        <div style={{flex: 1}}/>
        <Button variant={'contained'}
                disabled={store.focusedPlayer === -1 || store.focusedTeam === -1 || store.gameData === null || !store.playerLifeStates[store.focusedTeam][store.focusedPlayer]}
                onClick={store.predict}>
            {t('System.StrategyView.Predict')}
        </Button>
        <Button variant={'contained'}
                sx={{mr: 1}}
                disabled={!store.gameData}
                onClick={handleImportCase}>{t('System.Actions.importCase')}</Button>
        <Button variant={'contained'}
                disabled={!store.gameData}
                sx={{mr: 1}}
                onClick={handleSaveCase}>{t('System.Actions.saveCase')}</Button>
        <Button variant={'contained'}
                sx={{mr: 1}}
                onClick={handleImportData}>{t('System.Actions.importData')}</Button>
        <Settings open={settings} onClose={handleCloseSettings}/>
    </Bar>
}

export default inject('store')(observer(TitleBar));

const Bar = styled('div')(({theme}) => ({
    position: 'absolute',
    left: 0,
    top: 0,
    height: viewSize.appTitleBarHeight,
    backgroundColor: theme.palette.primary.main,
    borderBottomRightRadius: theme.shape.borderRadius,
    color: theme.palette.primary.contrastText,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}))
