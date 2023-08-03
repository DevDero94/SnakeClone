import * as PIXI from "pixi.js"
import { InputHandler } from "./InputSystem/InputHandler"
import { Goal } from "./Enviroment"
import { Snake } from "./Snake"
const canvas = document.getElementById('pixi-canvas') as HTMLCanvasElement

const app = new PIXI.Application({
    view: canvas,
    //resizeTo: canvas,
    backgroundColor: 0x5c812f
});
let middlePoint = new PIXI.Point(app.screen.width / 2, app.screen.height / 2);

let player1 = new Snake(16, middlePoint, app.stage)
let goal = new Goal(middlePoint);

let rect: PIXI.Rectangle[] = []
rect.push(goal.obstacle.getBounds())
player1.CollisionCheck(rect)


goal.pixiScreen = middlePoint
app.stage.addChild(goal.obstacle)

let _InputHandler = new InputHandler(player1.DefaultCommands());
let interval: number = 0;
app.ticker.add((delta) => {
    player1.CollisionCheck(rect)
    _InputHandler.HandleInputs();
    player1.PreviewRotate();
    interval += delta;
    if (interval > 5) {
        player1.MoveHead()
        interval = 0
    }
})
