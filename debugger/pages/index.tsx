import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/layout.module.css';
import * as core from '../core/index';
import React, { useEffect, useState } from 'react';
import {
    DataModel,
    EmulationState,
    Instruction,
    InstructionStepParameters,
    InstructionStepResult,
    InstructionType,
} from '../core/model';
import { InitModel } from '../core/operations';
import { Instructions } from '../components/instructions';
import { PreprocessingError } from '../core/validator';
import { Stack } from '../components/stack';
import { Button } from 'react-bootstrap';
import { Heap } from '../components/heap';
import { Footer } from '../components/footer';
import { ExplainInstruction } from '../core/explainer';
import { IO } from '../components/io';
import { WarningsView } from '../components/io/Warnings';
import { ControlPanel } from '../components/controlpanel';
import {
    HeapToBeHighlighted,
    InstructionsToBeHighlighted,
    SplitExplanationMessageParts,
    StackToBeHighlighted,
} from '../core/highlighting';
import i18next from 'i18next';
import dynamic from "next/dynamic";

const Home: NextPage = () => {
    const [model, setModel] = useState<DataModel | null>(null);
    const [models, setModels] = useState<DataModel[]>([]);

    const [version, setVersion] = useState<number>(0);
    const [explainerVersion, setExplainerVersion] = useState<number>(0);

    const [inputTxt, setInputTxt] = useState<string>('');
    const [output, setOutputTxt] = useState<string>('');
    const [warnings, setWarnings] = useState<string[]>([]);

    const [instructions, setInstructions] = useState<Instruction[]>([]);
    const [validationOK, setValidationOK] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<PreprocessingError[]>([]);

    const [emulationState, setEmulationState] = useState<EmulationState>(
        EmulationState.NOT_STARTED
    );
	
	const Integration = dynamic(
		() => {
			return import("../components/integration");
		},
		{ ssr: false }
	);

    useEffect(() => {
        if (!model) {
            return;
        }
        let shouldUpdate: boolean = !instructions[model.pc]?.explanationParts;

        explainNextInstruction();
        if (shouldUpdate) {
            setVersion(version + 1);
        }
    }, [model, version]);

    useEffect(() => {
        if (!model) {
            return;
        }

        explainNextInstruction();
    }, [model, version, inputTxt]);

    function instructionsLoaded(
        instructions: Instruction[],
        validationOK: boolean,
        validationErrors: PreprocessingError[]
    ) {
        setValidationOK(validationOK);
        setValidationErrors(validationErrors);

        setInstructions(instructions);

        start();
    }

    function start() {
        const m = InitModel(1024, 250);
        setEmulationState(EmulationState.NOT_STARTED);

        resetInstructionsExplanations();

        // empty models (todo better?)
        models.splice(0, models.length);

        models.push(JSON.parse(JSON.stringify(m)));
        setModel({ ...m });

        explainNextInstruction();
    }
    function play() {
        let result = nextStep();

        while (result && !result.isEnd) {
            result = nextStep();
        }
    }
    function getNextStepParameters(): InstructionStepParameters | null {
        if (!model) {
            return null;
        }
        return {
            model,
            instructions,
            input: inputTxt,
        };
    }
    function nextStep() {
        models.push(JSON.parse(JSON.stringify(model)));
        let result: InstructionStepResult | null = null;

        try {
            if (!model) {
                return;
            }

            model.input = inputTxt;
            const pars: InstructionStepParameters | null = getNextStepParameters();
            if (!pars) {
                return;
            }

            result = core.Operations.NextStep(pars);

            if (result.isEnd) {
                setEmulationState(EmulationState.FINISHED);
            } else {
                setEmulationState(EmulationState.PAUSED);
            }

            setInputTxt(result.inputNextStep);
            setOutputTxt(result.output);
            setWarnings([...warnings, ...result.warnings]);

            explainNextInstruction();
        } catch (e) {
            alert((e as Error).message);
            setEmulationState(EmulationState.ERROR);
        }

        //setModel({ ...model });
        setVersion(version + 1);

        return result;
    }
    function previous() {
        setModel(models[models.length - 1]);
        setEmulationState(EmulationState.PAUSED);
        models.pop();
    }

    function ableToContinue(): boolean {
        if (!model || model.pc >= instructions.length) {
            return false;
        }

        return (
            emulationState === EmulationState.PAUSED ||
            emulationState === EmulationState.NOT_STARTED
        );
    }
    function explainNextInstruction() {
        if (!ableToContinue() || !model || model.pc >= instructions.length) return;

        const pars: InstructionStepParameters | null = getNextStepParameters();
        if (!pars) {
            return;
        }

        const explanation = ExplainInstruction(pars);
        const parseParts = SplitExplanationMessageParts(
            explanation.message,
            explanation.placeholders
        );
        instructions[model.pc].explanationParts = parseParts;

        setExplainerVersion(explainerVersion + 1);
    }

    function resetInstructionsExplanations() {
        for (const instruction of instructions) {
            instruction.explanationParts = [];
        }
        setVersion(version + 1);
    }

    return (
        <main className={styles.layoutwrapper}>
            <Head>
                <title>{i18next.t('ui:title')}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.header}>
                <ControlPanel
                    models={models}
                    model={model}
                    nextStep={nextStep}
                    previous={previous}
                    play={play}
                    start={start}
                    emulationState={emulationState}
                    canContinue={ableToContinue}
                />
            </div>
            <div className={styles.instructions}>
                <Instructions
                    instructions={instructions}
                    validationErrors={[]}
                    validationOK={true}
                    instructionsLoaded={instructionsLoaded}
                    pc={model?.pc ?? null}
                    instructionsToBeHighlighted={
                        model == null
                            ? null
                            : InstructionsToBeHighlighted(
                                  instructions[model?.pc ?? 0]?.explanationParts
                              )
                    }
                />

                <Integration
                    instructions={instructions}
                    validationErrors={[]}
                    validationOK={true}
                    instructionsLoaded={instructionsLoaded}
                    pc={model?.pc ?? null}
                    instructionsToBeHighlighted={
                        model == null
                            ? null
                            : InstructionsToBeHighlighted(
                                  instructions[model?.pc ?? 0]?.explanationParts
                              )
                    }
                />
            </div>

            {model && (
                <>
                    <div className={styles.stack}>
                        <Stack
                            sp={model?.sp}
                            stack={model?.stack}
                            base={model?.base}
                            stackToBeHighlighed={
                                model == null
                                    ? new Map<number, string>()
                                    : StackToBeHighlighted(
                                          instructions[model?.pc ?? 0]?.explanationParts
                                      )
                            }
                        />
                    </div>
                    <div className={styles.heap}>
                        <Heap
                            heap={model?.heap}
                            heapToBeHighlighted={
                                model == null
                                    ? new Map<number, string>()
                                    : HeapToBeHighlighted(
                                          instructions[model?.pc ?? 0]?.explanationParts
                                      )
                            }
                        />
                    </div>
                    <div className={styles.io}>
                        <IO
                            inputTxt={inputTxt}
                            setInputTXT={setInputTxt}
                            outputTxt={output}
                        />
                    </div>
                    <div className={styles.warnings}>
                        <WarningsView warnings={warnings} />
                    </div>
                </>
            )}
            {
                <div className={styles.footer}>
                    <Footer />
                </div>
            }
        </main>
    );
};

export default Home;
