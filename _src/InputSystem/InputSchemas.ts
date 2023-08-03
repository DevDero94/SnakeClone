
export class InputSchema {
    _bindings: CommandBinding[] = []
    _image?: ImageData
    _controlSchemaWindow: any
    CheckForMissingCommands(): void { }
}
export class KeyboardSchema extends InputSchema {
    constructor(defaultBindings: CommandBinding[]) {
        super();
        this._bindings = defaultBindings
    }
    CheckForMissingCommands(): void {
        if (this._bindings.some(binding => !binding.input || !binding.command))
            console.log('missing keys');
        // add message box functuions or default key mapping here 
    }
}
export class CommandBinding {
    input?: any
    command?: any
    Invoke() {
        this.command();
    }
    constructor(inputVal: any, action: any) {
        this.command = action;
        this.input = inputVal;
    }
}