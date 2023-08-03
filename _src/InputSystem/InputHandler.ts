import { InputSchema } from './InputSchemas'
import { Keyboard, InputDevice } from './InputDevices'
export class InputHandler {
    public isDebug: boolean = false;
    private inputDevices: InputDevice[] = []
    //Callbacks to add device into binds
    // As browsers dont have direct hardwareCheck, first input type dictate type of IO/device
    //TODO: check touch available scenerio and keyboard => controller scenerio
    constructor(InitSchema: InputSchema) {
        this.InitInputHandlers(InitSchema);
    }
    private InitInputHandlers(InitSchema: InputSchema) {

        window.addEventListener('gamepadconnected', (e) => {
            console.log(
                "Gamepad connected at index %d: %s. %d buttons, %d axes.",
                e.gamepad.index,
                e.gamepad.id,
                e.gamepad.buttons.length,
                e.gamepad.axes.length,
            );
        });
        
        const ControllerCallback = () => {
            //ctor controller instance here
            this.AssignAllCallbacks();
            //removecontroller listeener
        };
        const KeyboardCallback = (event: KeyboardEvent) => {
            let keyboard = new Keyboard(this.isDebug, InitSchema);
            this.inputDevices.push(keyboard);
            this.AssignAllCallbacks();
            document.removeEventListener('keyup', KeyboardCallback);
        };

        document.addEventListener('keyup', KeyboardCallback)
        document.addEventListener('gamepadconnected', ControllerCallback);
    }
    private AssignAllCallbacks() {
        //Foreach device AssignCallbacks any game logic or controller bind settings can go here
        this.inputDevices.forEach(device => device.AssignCallbacks())
    }
    public HandleInputs() {
        this?.inputDevices.some(device => device.DispatchCommands(true))
    }
    public BindSchema<schematype extends InputSchema>(schema: schematype) {
        //this?.inputDevices.forEach(device => device.)
    }
}


