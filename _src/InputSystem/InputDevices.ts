import { InputSchema, KeyboardSchema } from './InputSchemas'
import { Key } from "./InputElements"
import { CompareInputs } from "./InputElements"
export class Keyboard implements InputDevice {

    private pressedKeys: Key[] = []
    currentSchema: InputSchema
    public _OnDebugMode: boolean = false

    constructor(isDebug: boolean, schema: KeyboardSchema) {
        this._OnDebugMode = isDebug
        this.currentSchema = schema
    }
    AssignCallbacks(): void {
        document.addEventListener('keydown', (event) => this.RegisterKey(event));
        document.addEventListener('keyup', (event) => this.RemoveKey(event));
    }
    RegisterKey(keyboardEvent: KeyboardEvent) {
        if (CompareInputs(this.pressedKeys, 'inputValue', keyboardEvent.key) !== undefined) {
            return;
            // increment inputvalue,count time or any magic  
        }
        else {
            let newKey = new Key(keyboardEvent);
            this.pressedKeys.push(newKey);
        }
        this.DebugInput();
    }
    RemoveKey(keyboardEvent: KeyboardEvent) {
        let currentKey = CompareInputs(this.pressedKeys, 'inputValue', keyboardEvent.key)

        if (currentKey) {
            this.pressedKeys.splice(this.pressedKeys.indexOf(currentKey), 1)
        }
        else
            throw new Error("Trying to remove an unpressed key?");
    }
    DispatchCommands(lastOnly?: boolean) {
        if (lastOnly) {
            this.currentSchema._bindings.forEach(binding => {
                if (this.pressedKeys.at(this.pressedKeys.length - 1)?.inputValue === binding.input) {
                    binding.Invoke()
                }
            })
            this.pressedKeys.forEach(input => this.currentSchema._bindings.entries)
        }
        else {
            this.currentSchema._bindings.forEach(binding => this.pressedKeys.some(keys => {
                if (keys.inputValue === binding.input)
                    binding.Invoke()
            }))
        }
    }
    DebugInput(): void {
        if (this._OnDebugMode) {
            console.log(this.pressedKeys.values())
        }
    }
}
export interface InputDevice {
    _OnDebugMode: boolean;
    currentSchema: InputSchema
    RegisterKey(InputEvent: any): void;
    RemoveKey(InputEvent: any): void;
    AssignCallbacks(): void;
    DebugInput(): void;
    DispatchCommands(constaint?: any): void;
}