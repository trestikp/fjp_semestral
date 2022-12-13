import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Stack } from '../../core/model';
import { TransformStackFrames } from '../../core/uitransofmation';
import { Wrapper } from '../general/Wrapper';

type InputProps = {
    outputTxt: string;
};

export function Output(props: InputProps) {
    return (
        <textarea
            style={{ width: '100%', flexGrow: 1 }}
            value={props.outputTxt}
            onChange={() => {}}
            readOnly={true}
        />
    );
}
