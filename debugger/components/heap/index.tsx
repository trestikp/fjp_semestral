import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Heap, Stack } from '../../core/model';
import { TransformStackFrames } from '../../core/uitransofmation';
import { HeaderWrapper } from '../general/HeaderWrapper';
import { Wrapper } from '../general/Wrapper';
import { HeapVisualisation } from './HeapVisualisation';

type HeapProps = {
    heap?: Heap;
    heapToBeHighlighted: Map<number, string>;
};

export function Heap(props: HeapProps) {
    const { t, i18n } = useTranslation();
    if (!props.heap) {
        return null;
    }

    return (
        <HeaderWrapper header={t('ui:headerHeap')}>
            <HeapVisualisation
                heap={props.heap}
                heapToBeHighlighted={props.heapToBeHighlighted}
            />
        </HeaderWrapper>
    );
}
