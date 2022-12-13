import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button } from 'react-bootstrap';
import styles from '../../styles/buttons.module.css';

export enum ButtonStyle {
    STANDARD,
    DANGER,
    SECONDARY,
}
type ButtonProps = {
    text: string;
    icon: IconDefinition;
    style?: ButtonStyle;
    onClick: () => void;
    disabled?: boolean;
    className?: any;
};
export function IconButton(props: ButtonProps) {
    return (
        <Button
            className={`${styles.buttonBase} ${
                props.style === ButtonStyle.STANDARD
                    ? styles.buttonStandard
                    : props.style === ButtonStyle.DANGER
                    ? styles.buttonDanger
                    : props.style === ButtonStyle.SECONDARY
                    ? styles.buttonSecondary
                    : styles.buttonStandard
            } ${props.className}`}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            <div>
                <FontAwesomeIcon
                    width={'20px'}
                    color={'white'}
                    icon={props.icon}
                    style={{ marginRight: '10px' }}
                />
                {props.text}
            </div>
        </Button>
    );
}
