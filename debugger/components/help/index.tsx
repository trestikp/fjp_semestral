import React, { useEffect, useState } from 'react';
import { Badge, Button, Modal, Table } from 'react-bootstrap';
import { Instruction } from '../../core/model';
import { ParseAndValidate, PreprocessingError } from '../../core/validator';
import { ShowToast } from '../../utils/alerts';
import { OKView } from '../general/OKView';
import styles from '../../styles/instructions.module.css';
import { ButtonStyle, IconButton } from '../general/IconButton';

import { faEdit, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

export function Help() {
    const { t, i18n } = useTranslation();
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    return (
        <>
            <IconButton onClick={handleShow} text={t('ui:help')} icon={faQuestion} />

            <Modal scrollable={true} show={showModal} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{t('ui:help')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{}}>
                        <h2>Instructions</h2>

                        {
                            <Table>
                                <thead>
                                    <tr>
                                        <th style={{ width: '35px' }}></th>
                                        <th style={{ width: '50px' }}>
                                            {t('ui:instructionsTableInstruction')}
                                        </th>
                                        <th style={{ width: '35px' }}>
                                            {t('ui:instructionsTableLevel')}
                                        </th>
                                        <th style={{ width: '35px' }}>
                                            {t('ui:instructionsTablePar')}
                                        </th>
                                        <th>{t('ui:instructionsTableExplanation')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td>LIT</td>
                                        <td>0</td>
                                        <td>value</td>
                                        <td>Pushes value to the top of the stack</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>INT</td>
                                        <td>0</td>
                                        <td>value</td>
                                        <td>
                                            Increases or decreases the stack pointer.
                                            Increasing beyond already generated stack
                                            creates 0s. Cannot decrease stack pointer
                                            under the current stack frame or under -1.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>OPR</td>
                                        <td>0</td>
                                        <td>operation</td>
                                        <td>
                                            Performs operation (logic or arithmetic). The
                                            instruction behaves just like the referece
                                            interpreter (operations 1 - 13). If the
                                            operation uses two values from stack, the
                                            first value is the one with the lower index
                                            and the second value is the one on top of the
                                            stack.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>JMP</td>
                                        <td>0</td>
                                        <td>address</td>
                                        <td>
                                            Jumps to the instruction specified by address.
                                            If the jump would end up on a non-existent
                                            instruction, an exception is thrown.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>JMC</td>
                                        <td>0</td>
                                        <td>address</td>
                                        <td>
                                            If there is 0 on the top of the stack, jumps
                                            to the instruction specified by the address.
                                            If the jump would end up on a non-existent
                                            instruction, an exception is thrown.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>LOD</td>
                                        <td>level</td>
                                        <td>address</td>
                                        <td>
                                            Loads a value from level, address on the stack
                                            and pushes it into the stack. If the level is
                                            too high (the target stack frame would end up
                                            under the first stack frame) an exception is
                                            thrown.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>STO</td>
                                        <td>level</td>
                                        <td>address</td>
                                        <td>
                                            Stores the value on top of the stack to level,
                                            address on stack. If the level is too high
                                            (the target stack frame would end up under the
                                            first stack frame) an exception is thrown.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>CAL</td>
                                        <td>level</td>
                                        <td>address</td>
                                        <td>
                                            <p>
                                                Creates a new stack frame with static base
                                                (SB) at relative index 0, dynamic base
                                                (DB) at relative index 1 and program
                                                counter at relative index 2 (PC).
                                            </p>
                                            <p>
                                                The static base is set levels down, so
                                                when the level is 0, the static base is
                                                set as the caller's current base, and when
                                                the level is 1 the static base is set as
                                                the current caller's static base.
                                                Otherwise, the static base is resolved by
                                                iterating over the static bases of the
                                                stack frames under the caller.
                                            </p>
                                            <p>
                                                The dynamic base is set as the caller's
                                                current base. The program counter is set
                                                as the next instruction to be executed (PC
                                                + 1).
                                            </p>
                                            <p>
                                                Then a jump is made to the instruction
                                                specified by address. The stack pointer
                                                has to be increased trough the INT
                                                instruction (same as the reference
                                                interpreter).
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>RET</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>
                                            <p>
                                                Sets the program counter (PC) to the value
                                                stored on the stack frame's index 2. Sets
                                                the stack pointer to current base - 1 (the
                                                top of previous stack frame). Sets the
                                                current base to the dynamic base (DB)
                                                stored on the stack frame's index 1.
                                            </p>
                                            <p>
                                                If the instruction is executed while the
                                                current base is 0 (aka the first stack
                                                frame), the program exits.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>REA</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>
                                            <p>
                                                Reads one character from the input field,
                                                converts is to a number and pushes it into
                                                the stack. The character is expected to be
                                                ASCII (or Extended ASCII, simply 8 byte
                                                value). If there is no character in the
                                                input field or the character is not
                                                Extended ASCII character, an exception is
                                                thrown.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>WRI</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>
                                            <p>
                                                Writes the value from the top of the stack
                                                into the output field as a character. If
                                                the value is not in range {'<'}0, 255{'>'}
                                                , an exception is thrown.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>NEW</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>
                                            <p>
                                                Takes the value on top of the stack as the
                                                number of heap cells to allocate.
                                                Allocates that many cells continuously (in
                                                one continuous block) and pushes the
                                                address of the block onto the stack. If
                                                the cells cannot be allocated, -1 is
                                                pushed onto the stack (e.g. not enough
                                                free cells, invalid value).
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>DEL</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>
                                            <p>
                                                Takes the value on top of the stack as the
                                                address of the heap block to deallocate.
                                                The heap block is deallocated in its
                                                entirety. On failure throws an exception.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>LDA</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>
                                            <p>
                                                Takes the value on top of the stack as the
                                                address of the heap cell. Pushes the value
                                                in the heap cell onto the stack. Throws an
                                                exception on failure.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>STA</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>
                                            <p>
                                                Takes the value on top of the stack as the
                                                value to store and the value under it (SP
                                                - 1) as the address to store it at. Stores
                                                the value at the address in heap. On
                                                failure throws an exception.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>PLD</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>
                                            <p>
                                                Essentially a dynamic LOD, where the level
                                                is the value on top of the stack and the
                                                address the value under it (SP - 1).
                                                Pushes the value on level, address of the
                                                stack onto the stack.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>PST</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>
                                            <p>
                                                Essentially a dynamic STO, where the level
                                                is the value on top of the stack, the
                                                address the value under it (SP - 1) and
                                                the value to be stored is on the index SP
                                                - 2. Stores the value into level, address
                                                of the stack.
                                            </p>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        {t('ui:ok')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
