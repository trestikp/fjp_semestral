import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../styles/stack.module.css';

export function StackSplitter() {
    const { t, i18n } = useTranslation();
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '60px',
            }}
            title={t('ui:stackSPSeparator')}
        >
            <div className={styles.stackSplitter} />
        </div>
    );
}
