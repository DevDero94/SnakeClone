interface InputElement {
    inputValue: string | null
    duration: number | null
}
export class Key implements InputElement {
    readonly inputValue: string = ""
    readonly duration: number = 0;
    constructor(event: KeyboardEvent) {
        this.inputValue = event.key
    }
}
// compare inputs on a given parameter context and return element on match, returns null otherwise
export function CompareInputs<i extends InputElement, k extends keyof i>(InputBuffer: i[],
    InputParameter: k, Value: i[k]): i | undefined {
    var element = InputBuffer.find(input => input[InputParameter] === Value)
    if (element === undefined)
        return;
    else
        return element;

}