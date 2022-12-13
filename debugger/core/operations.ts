import {
    DataModel,
    InstructionStepParameters,
    InstructionStepResult,
    DoStep,
} from './model';

export function InitModel(stackMaxSize: number, heapSize: number): DataModel {
    let values: number[] = [];
    for (let i = 0; i < heapSize; i++) {
        values.push(0);
    }
    values[0] = heapSize - 2;

    const m: DataModel = {
        pc: 0,
        base: 0,
        sp: -1,

        input: '',
        output: '',

        stack: {
            maxSize: stackMaxSize,
            stackItems: [{ value: 0 }, { value: 0 }, { value: 0 }],
            stackFrames: [{ index: 0, size: 0 }],
        },

        heap: {
            size: heapSize,
            values: values,
            heapBlocks: [
                {
                    blockAddress: 0,
                    blockSize: heapSize,
                    dataAddress: 2,
                    dataSize: heapSize - 2,
                    allocatorInfoIndices: [0, 1],
                    free: true,
                },
            ],
        },
    };

    return m;
}

export function NextStep(pars: InstructionStepParameters): InstructionStepResult {
    //pars.model.pc++;
    var res = DoStep(pars);
    return {
        isEnd: res.isEnd,
        inputNextStep: res.inputNextStep,
        output: res.output,
        warnings: res.warnings,
    };
}
