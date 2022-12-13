import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ExplanationMessagePart } from '../../core/highlighting';
import { Stack } from '../../core/model';
import { TransformStackFrames } from '../../core/uitransofmation';
import { HeaderWrapper } from '../general/HeaderWrapper';
import { Wrapper } from '../general/Wrapper';
import { StackFrameView } from './StackFrameView';
import { StackSplitter } from './StackSplitter';

type StackProps = {
    stack?: Stack;
    sp?: number;
    base?: number;

    stackToBeHighlighed: Map<number, string>;
};

export function Stack(props: StackProps) {
    const { t, i18n } = useTranslation();

    if (!props.stack || !props.sp) {
        return null;
    }

    return (
        <HeaderWrapper header={t('ui:headerStack')}>
            <>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                    }}
                >
                    <div>
                        {t('ui:stackSP')}: <b>{props.sp}</b>
                    </div>
                    <div>
                        {t('ui:stackBase')}: <b>{props.base}</b>
                    </div>
                </div>
                <hr />
                {TransformStackFrames(props.stack).map((sf, index) => (
                    <div key={index}>
                        <StackFrameView
                            firstIndex={sf.startIndex}
                            stackFrame={sf}
                            sp={props.sp ?? 0}
                            key={index}
                            stackToBeHighlighed={props.stackToBeHighlighed}
                        />
                        {sf.startIndex + sf.values.length == (props.sp ?? -1) + 1 && (
                            <StackSplitter />
                        )}
                    </div>
                ))}
            </>
        </HeaderWrapper>
    );
}
