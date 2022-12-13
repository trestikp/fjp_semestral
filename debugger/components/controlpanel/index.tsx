import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { dark, light, primary } from '../../constants/Colors';
import { DataModel, EmulationState } from '../../core/model';

import {
    faStepBackward,
    faStepForward,
    faPlay,
    faRedo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonStyle, IconButton } from '../general/IconButton';
import Select, { SingleValue } from 'react-select';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { Help } from '../help';

const languageOptions = [
    { value: 'cs', label: 'Čeština' },
    { value: 'en', label: 'English' },
];

type ControlPanelProps = {
    models: DataModel[];
    model: DataModel | null;

    nextStep: () => void;
    previous: () => void;
    play: () => void;
    start: () => void;

    emulationState: EmulationState;
    canContinue: () => boolean;
};
export function ControlPanel(props: ControlPanelProps) {
    const { t, i18n } = useTranslation();

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                padding: '20px',
            }}
        >
            <div
                style={{
                    marginLeft: '10px',
                    fontSize: 'small',
                    position: 'absolute',
                    left: 0,
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <Help />
            </div>

            <div>
                <IconButton
                    onClick={props.previous}
                    disabled={!props.models || !props.models.length}
                    text={t('ui:bntBack')}
                    icon={faStepBackward}
                />
                <IconButton
                    onClick={props.nextStep}
                    disabled={!props.canContinue()}
                    text={t('ui:btnForward')}
                    icon={faStepForward}
                    style={ButtonStyle.STANDARD}
                />
                <IconButton
                    onClick={props.play}
                    disabled={!props.model}
                    text={t('ui:btnPlay')}
                    icon={faPlay}
                    style={ButtonStyle.STANDARD}
                />
                <IconButton
                    onClick={props.start}
                    disabled={!props.model}
                    text={t('ui:btnReset')}
                    icon={faRedo}
                    style={ButtonStyle.DANGER}
                />
            </div>
            {
                <div
                    style={{
                        marginRight: '30px',
                        fontSize: 'small',
                        position: 'absolute',
                        right: 0,
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <Select
                        options={languageOptions}
                        placeholder={'Vyberte jazyk'}
                        defaultValue={
                            languageOptions.filter((o) => o.value == i18next.language)[0]
                        }
                        // @ts-ignore
                        onChange={(
                            newValue: SingleValue<{
                                value: string;
                                label: string;
                            }>,
                            index: number
                        ) => {
                            i18next.changeLanguage(newValue?.value ?? 'cs');
                        }}
                    />
                </div>
            }

            {/*

            <div
                style={{
                    marginRight: '30px',
                    color: light,
                    fontSize: 'small',
                    justifySelf: 'flex-end',
                }}
            >
                Vytvořili Lukáš Vlček a Vojtěch Bartička <br />
                Semestrální práce z KIV/FJP, FAV ZČU 2021/2022
            </div>*/}
        </div>
    );
}
