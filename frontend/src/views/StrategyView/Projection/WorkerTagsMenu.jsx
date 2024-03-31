import {Autocomplete, Chip, TextField} from "@mui/material";
import {inject, observer} from "mobx-react";
import {useTranslation} from "react-i18next";

const defaultTags = t => [
    t('Game.StratTag.Attack'),
    t('Game.StratTag.Defend'),
    t('Game.StratTag.AntiGank'),
    t('Game.StratTag.Farm'),
    t('Game.StratTag.Gank'),
    t('Game.StratTag.Fog'),
]

function WorkerTagsMenu({store, tagSelection}) {
    const tags = store.clusterTags(tagSelection);

    const {t} = useTranslation();

    return <Autocomplete multiple
                         value={Array.from(tags)}
                         onChange={(_, newValue) =>
                             store.setTags(tagSelection, new Set(newValue), tags)
                         }
                         options={defaultTags(t)}
                         renderTags={(tagValue, getTagProps) =>
                             tagValue.map((option, index) => (
                                 <Chip label={option}
                                       {...getTagProps({index})}/>
                             ))
                         }
                         style={{width: window.innerWidth / 4}}
                         renderInput={params => (
                             <TextField {...params}
                                        label={tagSelection.length === 0 ? ''
                                            : t('System.StrategyView.WorkerTag', {id: tagSelection.join(', ')})}
                                        placeholder={t('System.StrategyView.InputTag')}/>
                         )}/>
}

export default inject('store')(observer(WorkerTagsMenu));