import { Instruction, InstructionType } from './model';

import i18next from 'i18next';

export interface ValidationResult {
    emptyInput: boolean;
    parseOK: boolean;
    validationOK: boolean;
    instructions: Instruction[];
    parseErrors: PreprocessingError[];
    validationErrors: PreprocessingError[];
}

export interface PreprocessingError {
    rowIndex: number;
    error: string;
}

export let stringInstructionMap = new Map<string, InstructionType>([
    ['LIT', InstructionType.LIT],
    ['OPR', InstructionType.OPR],
    ['LOD', InstructionType.LOD],
    ['STO', InstructionType.STO],
    ['CAL', InstructionType.CAL],
    ['INT', InstructionType.INT],
    ['JMP', InstructionType.JMP],
    ['JMC', InstructionType.JMC],
    ['RET', InstructionType.RET],
    ['REA', InstructionType.REA],
    ['WRI', InstructionType.WRI],
    ['NEW', InstructionType.NEW],
    ['DEL', InstructionType.DEL],
    ['LDA', InstructionType.LDA],
    ['STA', InstructionType.STA],
    ['PLD', InstructionType.PLD],
    ['PST', InstructionType.PST],
]);

export let instructionStringMap = new Map<InstructionType, string>([
    [InstructionType.LIT, 'LIT'],
    [InstructionType.OPR, 'OPR'],
    [InstructionType.LOD, 'LOD'],
    [InstructionType.STO, 'STO'],
    [InstructionType.CAL, 'CAL'],
    [InstructionType.INT, 'INT'],
    [InstructionType.JMP, 'JMP'],
    [InstructionType.JMC, 'JMC'],
    [InstructionType.RET, 'RET'],
    [InstructionType.REA, 'REA'],
    [InstructionType.WRI, 'WRI'],
    [InstructionType.NEW, 'NEW'],
    [InstructionType.DEL, 'DEL'],
    [InstructionType.LDA, 'LDA'],
    [InstructionType.STA, 'STA'],
    [InstructionType.PLD, 'PLD'],
    [InstructionType.PST, 'PST'],
]);

export function ParseAndValidate(input: string): ValidationResult {
    let lines = input.split(/\r?\n/);

    if (lines.length == 1 && lines[0] == '') {
        return {
            emptyInput: true,
            validationOK: false,
            parseOK: false,
            parseErrors: [],
            validationErrors: [],
            instructions: [],
        };
    }

    let parseOK = true;
    let validationOK = true;
    let instructions: Instruction[] = [];
    let validationErrors: PreprocessingError[] = [];
    let parseErrors: PreprocessingError[] = [];

    for (let i = 0; i < lines.length; i++) {
        let splitLine = lines[i].trim().split(/\s+/);

        if (splitLine.length < 4) {
            parseOK = false;
            parseErrors.push({
                rowIndex: i,
                error: i18next.t('core:validatorLessThan4'),
            });
            continue;
        } else if (splitLine.length > 4) {
            parseOK = false;
            parseErrors.push({
                rowIndex: i,
                error: i18next.t('core:validatorMoreThan4'),
            });
            continue;
        }

        let index = Number(splitLine[0]);
        if (Number.isNaN(index)) {
            parseOK = false;
            parseErrors.push({
                rowIndex: i,
                error: i18next.t('core:validatorIndexInteger'),
            });
            continue;
        }
        let level = Number(splitLine[2]);
        if (Number.isNaN(level)) {
            parseOK = false;
            parseErrors.push({
                rowIndex: i,
                error: i18next.t('core:validatorLevelInteger'),
            });
            continue;
        }
        let parameter = Number(splitLine[3]);
        if (Number.isNaN(parameter)) {
            parseOK = false;
            parseErrors.push({
                rowIndex: i,
                error: i18next.t('core:validatorParInteger'),
            });
            continue;
        }
        let op: string = splitLine[1];
        if (!stringInstructionMap.has(op.toUpperCase())) {
            parseOK = false;
            parseErrors.push({
                rowIndex: i,
                error: i18next.t('core:validatorUnkInstruction'),
            });
            continue;
        }

        if (!parseOK) {
            continue;
        }

        let instruction: Instruction = {
            index: index,
            // @ts-ignore
            instruction: stringInstructionMap.get(op.toUpperCase()),
            level: level,
            parameter: parameter,
            explanation: null,
        };
        instructions.push(instruction);
    }

    for (let i = 0; i < instructions.length; i++) {
        let instruction: Instruction = instructions[i];
        if (instruction.index != i) {
            validationOK = false;
            validationErrors.push({
                rowIndex: i,
                error: i18next.t('core:validatorBadIndex'),
            });
            continue;
        }

        if (instruction.level < 0) {
            validationOK = false;
            validationErrors.push({
                rowIndex: i,
                error: i18next.t('core:validatorNegLevel'),
            });
            continue;
        }

        if (instruction.instruction == InstructionType.LIT && instruction.level != 0) {
            validationOK = false;
            validationErrors.push({
                rowIndex: i,
                error: i18next.t('core:validatorLitLevel'),
            });
            continue;
        } else if (instruction.instruction == InstructionType.OPR) {
            if (instruction.level != 0) {
                validationOK = false;
                validationErrors.push({
                    rowIndex: i,
                    error: i18next.t('core:validatorOprLevel'),
                });
                continue;
            } else if (instruction.parameter < 1 || instruction.parameter > 13) {
                validationOK = false;
                validationErrors.push({
                    rowIndex: i,
                    error: i18next.t('core:validatorOprParam'),
                });
                continue;
            }
        } else if (
            instruction.instruction == InstructionType.CAL &&
            instruction.parameter < 0
        ) {
            validationOK = false;
            validationErrors.push({
                rowIndex: i,
                error: i18next.t('core:validatorCalParam'),
            });
            continue;
        } else if (instruction.instruction == InstructionType.JMP) {
            if (instruction.level != 0) {
                validationOK = false;
                validationErrors.push({
                    rowIndex: i,
                    error: i18next.t('core:validatorJmpLevel'),
                });
                continue;
            } else if (instruction.parameter < 0) {
                validationOK = false;
                validationErrors.push({
                    rowIndex: i,
                    error: i18next.t('core:validatorJmpParam'),
                });
                continue;
            }
        } else if (instruction.instruction == InstructionType.JMC) {
            if (instruction.level != 0) {
                validationOK = false;
                validationErrors.push({
                    rowIndex: i,
                    error: i18next.t('core:validatorJmcLevel'),
                });
                continue;
            } else if (instruction.parameter < 0) {
                validationOK = false;
                validationErrors.push({
                    rowIndex: i,
                    error: i18next.t('core:validatorJmcParam'),
                });
                continue;
            }
        } else if (
            instruction.instruction == InstructionType.INT &&
            instruction.level != 0
        ) {
            validationOK = false;
            validationErrors.push({
                rowIndex: i,
                error: i18next.t('core:validatorIntLevel'),
            });
            continue;
        } else if (instruction.instruction == InstructionType.RET) {
            if (instruction.level != 0 || instruction.parameter != 0) {
                validationOK = false;
                validationErrors.push({
                    rowIndex: i,
                    error: i18next.t('core:validatorRet'),
                });
                continue;
            }
        } else if (instruction.instruction == InstructionType.REA) {
            if (instruction.level != 0 || instruction.parameter != 0) {
                validationOK = false;
                validationErrors.push({
                    rowIndex: i,
                    error: i18next.t('core:validatorRea'),
                });
                continue;
            }
        } else if (instruction.instruction == InstructionType.WRI) {
            if (instruction.level != 0 || instruction.parameter != 0) {
                validationOK = false;
                validationErrors.push({
                    rowIndex: i,
                    error: i18next.t('core:validatorWri'),
                });
                continue;
            }
        } else if (instruction.instruction == InstructionType.NEW) {
            if (instruction.level != 0 || instruction.parameter != 0) {
                validationOK = false;
                validationErrors.push({
                    rowIndex: i,
                    error: i18next.t('core:validatorNew'),
                });
                continue;
            }
        } else if (instruction.instruction == InstructionType.DEL) {
            if (instruction.level != 0 || instruction.parameter != 0) {
                validationOK = false;
                validationErrors.push({
                    rowIndex: i,
                    error: i18next.t('core:validatorDel'),
                });
                continue;
            }
        } else if (instruction.instruction == InstructionType.LDA) {
            if (instruction.level != 0 || instruction.parameter != 0) {
                validationOK = false;
                validationErrors.push({
                    rowIndex: i,
                    error: i18next.t('core:validatorLda'),
                });
                continue;
            }
        } else if (instruction.instruction == InstructionType.STA) {
            if (instruction.level != 0 || instruction.parameter != 0) {
                validationOK = false;
                validationErrors.push({
                    rowIndex: i,
                    error: i18next.t('core:validatorSta'),
                });
                continue;
            }
        } else if (instruction.instruction == InstructionType.PLD) {
            if (instruction.level != 0 || instruction.parameter != 0) {
                validationOK = false;
                validationErrors.push({
                    rowIndex: i,
                    error: i18next.t('core:validatorPld'),
                });
                continue;
            }
        } else if (instruction.instruction == InstructionType.PST) {
            if (instruction.level != 0 || instruction.parameter != 0) {
                validationOK = false;
                validationErrors.push({
                    rowIndex: i,
                    error: i18next.t('core:validatorPst'),
                });
                continue;
            }
        }
    }

    if (!parseOK) {
        instructions = [];
    }

    return {
        emptyInput: false,
        parseOK: parseOK,
        validationOK: validationOK,
        validationErrors: validationErrors,
        parseErrors: parseErrors,
        instructions: instructions,
    };
}
