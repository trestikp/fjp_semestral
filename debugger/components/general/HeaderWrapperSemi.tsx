import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { primary } from '../../constants/Colors';
import { Instruction } from '../../core/model';
import { PreprocessingError } from '../../core/validator';

type WrapperProps = {
    children: JSX.Element | JSX.Element[];
    header: string;
    style?: any;
};

export function HeaderWrapperSemi(props: WrapperProps) {
    return (
        <div
            style={{
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
                ...props.style,
            }}
        >
            <div className="panelNH">
                <div className="panelHeader" style={{ backgroundColor: primary }}>
                    {props.header}
                </div>
                {props.children}
            </div>
        </div>
    );
}
