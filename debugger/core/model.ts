import { ExplanationMessagePart } from './highlighting';

import {
    Allocate,
    Free,
    GetValueFromHeap,
    PutValueOnHeap,
    UpdateHeapBlocks,
} from './allocator';

import i18next from 'i18next';

// ------------------------------------------- INTERFACES

export interface DataModel {
    pc: number;
    base: number;
    sp: number;

    stack: Stack;
    heap: Heap;

    input: string;
    output: string;
}

export interface Stack {
    maxSize: number;

    stackItems: StackItem[];
    stackFrames: StackFrame[];
}
export interface StackItem {
    value: number;
}
export interface StackFrame {
    index: number;
    size: number;
}

export interface Heap {
    size: number;
    values: number[];

    heapBlocks: HeapBlock[];
}

export interface HeapBlock {
    // where the data starts (aka the index the Allocate method returns)
    dataAddress: number;
    // how big the data part of the block is (the part user is supposed to use)
    dataSize: number;

    // this is the index in heap.values where the whole block starts (including the allocator info)
    blockAddress: number;
    // how big the block is incl. the allocator info
    blockSize: number;

    // whether the block is free or not
    free: boolean;

    // indices of all the cells in the block, which are used by allocator (block size, empty/free, ...)
    allocatorInfoIndices: number[];
}

export enum HeapCellType {
    NOT_ALLOCATED,
    NOT_ALLOCATED_META,
    ALLOCATED_META,
    ALLOCATED_DATA,

    UNKNOWN,
}

export enum InstructionType {
    LIT,
    OPR,
    LOD,
    STO,
    CAL,
    INT,
    JMP,
    JMC,
    RET,
    REA,
    WRI,
    NEW,
    DEL,
    LDA,
    STA,
    PLD,
    PST,
}

export enum OperationType {
    U_MINUS = 1,
    ADD = 2,
    SUB = 3,
    MULT = 4,
    DIV = 5,
    MOD = 6,
    IS_ODD = 7,
    EQ = 8,
    N_EQ = 9,
    LESS_THAN = 10,
    MORE_EQ_THAN = 11,
    MORE_THAN = 12,
    LESS_EQ_THAN = 13,
}

export interface Instruction {
    index: number;
    instruction: InstructionType;
    level: number;
    parameter: number;
    explanationParts: ExplanationMessagePart[] | null;
}

export interface InstructionStepParameters {
    model: DataModel;
    instructions: Instruction[];
    input: string;
}
export interface InstructionStepResult {
    isEnd: boolean;

    output: string;

    warnings: string[];
    inputNextStep: string;
}

export enum EmulationState {
    NOT_STARTED,
    PAUSED,
    FINISHED,
    ERROR,
}

// ------------------------------------------- INTERFACES

// ------------------------------------------- HEAP UTILITY FUNCTIONS

// ------------------------------------------- HEAP UTILITY FUNCTIONS

// ------------------------------------------- STACK UTILITY FUNCTIONS

function GetValuesFromStack(
    stack: Stack,
    index: number,
    count: number,
    decrementCurrentFrame: boolean = true
): number[] {
    let retvals: number[] = [];
    for (let i = 0; i < count; i++) {
        if (!CheckSPInBounds(index - i)) {
            throw new Error(i18next.t('core:modelStackNegativeError'));
        }
        retvals.push(stack.stackItems[index - i].value);
        if (decrementCurrentFrame) {
            stack.stackFrames[stack.stackFrames.length - 1].size--;
        }
    }
    return retvals;
}

function GetValueFromStack(stack: Stack, index: number): number {
    if (index >= stack.stackItems.length) {
        while (stack.stackItems.length - 1 != index) {
            stack.stackItems.push({ value: 0 });
            if (stack.stackItems.length > stack.maxSize) {
                throw new Error(i18next.t('core:modelMaxStackSizeError'));
            }
        }
        return 0;
    } else {
        return stack.stackItems[index].value;
    }
}

function PutOntoStack(stack: Stack, index: number, value: number) {
    if (index >= stack.stackItems.length) {
        while (stack.stackItems.length - 1 != index) {
            stack.stackItems.push({ value: 0 });
        }
    }

    if (index < 0) {
        throw new Error(i18next.t('core:modelStackNegativeError'));
    }

    if (stack.stackItems.length > stack.maxSize) {
        throw new Error(i18next.t('core:modelMaxStackSizeError'));
    }

    stack.stackItems[index].value = value;
}

function ConvertToStackItems(...values: number[]): StackItem[] {
    let items: StackItem[] = [];
    for (let i = 0; i < values.length; i++) {
        items.push({ value: values[i] });
    }
    return items;
}

// Pushes StackItems onto stack
// Check if the stack if large enough and expands it if needed
// Returns new stack pointer
function PushOntoStack(
    stack: Stack,
    sp: number,
    values: StackItem[],
    increment: boolean = true
): number {
    let currentStackFrame: StackFrame = stack.stackFrames[stack.stackFrames.length - 1];
    for (let i = 0; i < values.length; i++) {
        if (increment) {
            sp++;
            currentStackFrame.size++;
        }

        if (sp > stack.stackItems.length - 1) {
            stack.stackItems.push({ value: 0 });
        }
        stack.stackItems[sp] = values[i];
    }

    if (!CheckStackSize(stack)) {
        throw new Error(i18next.t('core:modelMaxStackSizeError'));
    }

    return sp;
}

// Checks if stack size is larger than the maximum permissible value
function CheckStackSize(stack: Stack) {
    if (stack.stackItems.length > stack.maxSize) {
        return false;
    }
    return true;
}

// Checks if SP is not pointing under the stack
function CheckSPInBounds(sp: number) {
    if (sp < 0) {
        return false;
    } else {
        return true;
    }
}

function FindBase(stack: Stack, base: number, level: number): number {
    let newBase = base;
    while (level > 0) {
        newBase = stack.stackItems[newBase].value;
        level--;

        if (newBase == 0 && level != 0) {
            throw new Error(i18next.t('core:modelBaseSearchError') + level + ')');
        }
    }
    return newBase;
}

// ------------------------------------------- STACK UTILITY FUNCTIONS

// ------------------------------------------- INSTRUCTION FUNCTIONS

export function DoStep(params: InstructionStepParameters): InstructionStepResult {
    if (params.model.pc >= params.instructions.length) {
        throw new Error(i18next.t('core:modelNonExistentInstructionError'));
    }

    let instruction = params.instructions[params.model.pc];
    let op = instruction.instruction;
    let level = instruction.level;
    let parameter = instruction.parameter;

    let heap = params.model.heap;
    let stack = params.model.stack;

    let inputString = params.input;
    let warnings: string[] = [];
    let isEnd = false;

    switch (op) {
        case InstructionType.LIT:
            params.model.sp = PushOntoStack(
                stack,
                params.model.sp,
                ConvertToStackItems(parameter)
            );
            params.model.pc++;
            break;
        case InstructionType.OPR:
            params.model.sp = PerformOPR(stack, parameter, params.model.sp);
            params.model.pc++;
            break;
        case InstructionType.INT:
            params.model.sp = PerformINT(stack, params.model.sp, parameter);
            params.model.pc++;
            break;
        case InstructionType.JMP:
            if (parameter >= params.instructions.length) {
                throw new Error(
                    i18next.t('core:modelInstructionOutOfBounds1') +
                        parameter +
                        i18next.t('core:modelInstructionOutOfBounds2')
                );
            }
            params.model.pc = parameter;
            break;
        case InstructionType.JMC:
            var operands = GetValuesFromStack(stack, params.model.sp, 1);
            params.model.sp--;
            if (operands[0] == 0) {
                if (parameter >= params.instructions.length) {
                    throw new Error(
                        i18next.t('core:modelInstructionOutOfBounds1') +
                            parameter +
                            i18next.t('core:modelInstructionOutOfBounds2')
                    );
                }
                params.model.pc = parameter;
            } else {
                params.model.pc++;
            }
            break;
        case InstructionType.CAL:
            let newBase = FindBase(stack, params.model.base, level);
            PushOntoStack(
                stack,
                params.model.sp + 1,
                ConvertToStackItems(newBase),
                false
            );
            PushOntoStack(
                stack,
                params.model.sp + 2,
                ConvertToStackItems(params.model.base),
                false
            );
            PushOntoStack(
                stack,
                params.model.sp + 3,
                ConvertToStackItems(params.model.pc + 1),
                false
            );

            if (parameter >= params.instructions.length) {
                throw new Error(
                    i18next.t('core:modelInstructionOutOfBounds1') +
                        parameter +
                        i18next.t('core:modelInstructionOutOfBounds2')
                );
            }

            stack.stackFrames.push({ index: params.model.sp + 1, size: 0 });

            params.model.base = params.model.sp + 1;
            params.model.pc = parameter;
            break;
        case InstructionType.RET:
            if (params.model.base == 0) {
                isEnd = true;
                break;
            }

            var res: number[] = GetValuesFromStack(
                params.model.stack,
                params.model.base + 2,
                2,
                false
            );

            params.model.sp = params.model.base - 1;
            params.model.pc = res[0];
            params.model.base = res[1];
            params.model.stack.stackFrames.pop();
            break;
        case InstructionType.LOD:
            var base = FindBase(stack, params.model.base, level);
            var address = base + parameter;
            params.model.sp = PushOntoStack(
                stack,
                params.model.sp,
                ConvertToStackItems(GetValueFromStack(stack, address))
            );
            params.model.pc++;
            break;
        case InstructionType.STO:
            var base = FindBase(stack, params.model.base, level);
            var address = base + parameter;
            var res = GetValuesFromStack(stack, params.model.sp, 1);
            PutOntoStack(stack, address, res[0]);
            params.model.sp--;
            params.model.pc++;
            break;
        case InstructionType.WRI:
            var code = GetValuesFromStack(stack, params.model.sp, 1);

            if (code[0] < 0 || code[0] > 255) {
                throw new Error(i18next.t('core:modelReadInvalidInput'));
            }

            params.model.output += String.fromCharCode(code[0]);
            inputString = inputString.substring(1);
            params.model.sp--;
            params.model.pc++;
            break;
        case InstructionType.REA:
            if (inputString.length == 0) {
                throw new Error(i18next.t('core:modelReadInputEmpty'));
            }

            params.model.sp = PushOntoStack(
                stack,
                params.model.sp,
                ConvertToStackItems(inputString.charCodeAt(0))
            );
            inputString = inputString.slice(1);
            params.model.pc++;
            break;
        case InstructionType.NEW:
            var count = GetValuesFromStack(stack, params.model.sp, 1);
            params.model.sp--;

            if (count[0] <= 0 || count[0] > params.model.heap.size) {
                params.model.sp = PushOntoStack(
                    stack,
                    params.model.sp,
                    ConvertToStackItems(-1)
                );
            } else {
                params.model.sp = PushOntoStack(
                    stack,
                    params.model.sp,
                    ConvertToStackItems(Allocate(heap, count[0]))
                );
            }
            params.model.pc++;
            break;
        case InstructionType.DEL:
            var addr = GetValuesFromStack(stack, params.model.sp, 1);
            params.model.sp--;
            params.model.pc++;
            if (Free(heap, addr[0]) != 0) {
                throw new Error(
                    i18next.t('core:modelFreeBlockNotAllocated1') +
                        addr +
                        i18next.t('core:modelFreeBlockNotAllocated2')
                );
            }
            break;
        case InstructionType.LDA:
            var addr: number[] = GetValuesFromStack(stack, params.model.sp, 1);
            params.model.sp--;
            var val = GetValueFromHeap(heap, addr[0]);
            if (val === null) {
                throw new Error(
                    i18next.t('core:modelHeapAccessUndefined1') +
                        addr[0] +
                        i18next.t('core:modelHeapAccessUndefined2') +
                        heap.size
                );
            } else if (Number.isNaN(val)) {
                throw new Error(i18next.t('core:modelHeapAccessUnallocated') + addr[0]);
            }
            params.model.sp = PushOntoStack(
                stack,
                params.model.sp,
                ConvertToStackItems(val)
            );
            params.model.pc++;
            break;
        case InstructionType.STA:
            var addr: number[] = GetValuesFromStack(stack, params.model.sp, 2);
            params.model.sp -= 2;
            var r = PutValueOnHeap(heap, addr[1], addr[0]);
            if (r == -1) {
                throw new Error(
                    i18next.t('core:modelHeapAccessUndefined1') +
                        addr[1] +
                        i18next.t('core:modelHeapAccessUndefined2') +
                        heap.size
                );
            } else if (r == -2) {
                throw new Error(i18next.t('core:modelHeapAccessUnallocated') + addr[0]);
            }
            params.model.pc++;
            break;
        case InstructionType.PLD:
            var values: number[] = GetValuesFromStack(stack, params.model.sp, 2);
            params.model.sp -= 2;
            var base = FindBase(stack, params.model.base, values[1]);
            params.model.sp = PushOntoStack(
                stack,
                params.model.sp,
                ConvertToStackItems(GetValueFromStack(stack, base + values[0]))
            );
            params.model.pc++;
            break;
        case InstructionType.PST:
            var values: number[] = GetValuesFromStack(stack, params.model.sp, 3);
            params.model.sp -= 3;
            var base = FindBase(stack, params.model.base, values[1]);
            PutOntoStack(stack, base + values[0], values[2]);
            params.model.pc++;
            break;
        default:
            throw new Error(i18next.t('core:modelNonExistentInstructionError'));
    }

    if (params.model.pc >= params.instructions.length) {
        isEnd = true;
    }

    UpdateHeapBlocks(heap);

    return {
        warnings: warnings,
        isEnd: isEnd,
        output: params.model.output,
        inputNextStep: inputString,
    };
}

function PerformINT(stack: Stack, sp: number, count: number) {
    let currentStackFrame: StackFrame = stack.stackFrames[stack.stackFrames.length - 1];
    if (count >= 0) {
        sp += count;
        currentStackFrame.size += count;
        let toAdd = sp - stack.stackItems.length + 1;
        for (let i = 0; i < toAdd; i++) {
            stack.stackItems.push({ value: 0 });
        }
    } else {
        if (sp + count < -1) {
            throw new Error(i18next.t('core:modelINTStackLow'));
        } else if (sp + count < currentStackFrame.index) {
            throw new Error(i18next.t('core:modelINTStackFrameLow'));
        } else {
            sp += count;
            currentStackFrame.size += count;
        }
    }

    if (!CheckStackSize(stack)) {
        throw new Error(i18next.t('core:modelMaxStackSizeError') + stack.maxSize + ')');
    }

    return sp;
}

function PerformOPR(stack: Stack, operation: number, sp: number): number {
    let e_op = operation as OperationType;
    let operands: number[];
    switch (e_op) {
        case OperationType.U_MINUS:
            stack.stackItems[sp].value *= -1;
            break;
        case OperationType.ADD:
            operands = GetValuesFromStack(stack, sp, 2);
            sp -= 2;
            sp = PushOntoStack(stack, sp, ConvertToStackItems(operands[0] + operands[1]));
            break;
        case OperationType.SUB:
            operands = GetValuesFromStack(stack, sp, 2);
            sp -= 2;
            sp = PushOntoStack(stack, sp, ConvertToStackItems(operands[1] - operands[0]));
            break;
        case OperationType.MULT:
            operands = GetValuesFromStack(stack, sp, 2);
            sp -= 2;
            sp = PushOntoStack(stack, sp, ConvertToStackItems(operands[0] * operands[1]));
            break;
        case OperationType.DIV:
            operands = GetValuesFromStack(stack, sp, 2);
            sp -= 2;
            sp = PushOntoStack(
                stack,
                sp,
                ConvertToStackItems(Math.floor(operands[1] / operands[0]))
            );
            break;
        case OperationType.MOD:
            operands = GetValuesFromStack(stack, sp, 2);
            sp -= 2;
            sp = PushOntoStack(
                stack,
                sp,
                ConvertToStackItems(Math.floor(operands[1] % operands[0]))
            );
            break;
        case OperationType.IS_ODD:
            operands = GetValuesFromStack(stack, sp, 1);
            sp -= 1;
            sp = PushOntoStack(stack, sp, ConvertToStackItems(operands[0] % 2));
            break;
        case OperationType.EQ:
            operands = GetValuesFromStack(stack, sp, 2);
            sp -= 2;
            sp = PushOntoStack(
                stack,
                sp,
                ConvertToStackItems(operands[0] === operands[1] ? 1 : 0)
            );
            break;
        case OperationType.N_EQ:
            operands = GetValuesFromStack(stack, sp, 2);
            sp -= 2;
            sp = PushOntoStack(
                stack,
                sp,
                ConvertToStackItems(operands[0] === operands[1] ? 0 : 1)
            );
            break;
        case OperationType.LESS_THAN:
            operands = GetValuesFromStack(stack, sp, 2);
            sp -= 2;
            sp = PushOntoStack(
                stack,
                sp,
                ConvertToStackItems(operands[1] < operands[0] ? 1 : 0)
            );
            break;
        case OperationType.MORE_EQ_THAN:
            operands = GetValuesFromStack(stack, sp, 2);
            sp -= 2;
            sp = PushOntoStack(
                stack,
                sp,
                ConvertToStackItems(operands[1] >= operands[0] ? 1 : 0)
            );
            break;
        case OperationType.MORE_THAN:
            operands = GetValuesFromStack(stack, sp, 2);
            sp -= 2;
            sp = PushOntoStack(
                stack,
                sp,
                ConvertToStackItems(operands[1] > operands[0] ? 1 : 0)
            );
            break;
        case OperationType.LESS_EQ_THAN:
            operands = GetValuesFromStack(stack, sp, 2);
            sp -= 2;
            sp = PushOntoStack(
                stack,
                sp,
                ConvertToStackItems(operands[1] <= operands[0] ? 1 : 0)
            );
            break;
        default:
            throw new Error(i18next.t('core:modelUnknownOPR') + OperationType[e_op]);
    }

    return sp;
}

// ------------------------------------------- INSTRUCTION FUNCTIONS
