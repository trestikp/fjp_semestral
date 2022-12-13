import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Stack } from '../../core/model';
import { TransformStackFrames } from '../../core/uitransofmation';
import { HeaderWrapper } from '../general/HeaderWrapper';
import { Wrapper } from '../general/Wrapper';

type WarningsViewProps = {
    warnings: string[];
};

export function WarningsView(props: WarningsViewProps) {
    const { t, i18n } = useTranslation();
    return (
        <HeaderWrapper header={t('ui:headerWarnings')}>
            <>
                {props.warnings?.map((w, index) => (
                    <code style={{ display: 'block' }}>
                        {index + 1}: {w}
                    </code>
                ))}
            </>
        </HeaderWrapper>
    );
}
