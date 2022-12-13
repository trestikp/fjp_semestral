import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Stack } from '../../core/model';
import { TransformStackFrames } from '../../core/uitransofmation';
import { Wrapper } from '../general/Wrapper';

type InputProps = {
    inputTxt: string;
    setInputTXT: (newValue: string) => void;
};

export function Input(props: InputProps) {
    function handleChange(event: React.FormEvent<HTMLInputElement>) {
        props.setInputTXT(event.currentTarget.value);
    }

    return (
        <input
            style={{ width: '100%' }}
            type="text"
            value={props.inputTxt}
            onChange={handleChange}
        />
    );
}
