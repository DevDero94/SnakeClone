import { Container, Point, Rectangle, Sprite, Texture } from "pixi.js";
import { KeyboardSchema, CommandBinding } from "./InputSystem/InputSchemas"

type movementInstruction = [number, Point];
type SnakeQueue = Queue<movementInstruction>;
var pixiScreen!: Point;

export class Snake extends Container {
    _deltaPos: number = 16;
    //could be changed map spesificly default going up
    readonly startingDirection: movementInstruction = [0, new Point(0, -1)]
    //processed instruction to be applied at the end of updateloop
    headInstruction: movementInstruction = this.startingDirection
    //positiontion to spawn the next part
    public get InsertionPosition(): Point {
        if (this._SnakeBodys.length > 0) {
            let p = new Point(this._SnakeBodys[this._SnakeBodys.length - 1].position.x,
                this._SnakeBodys[this._SnakeBodys.length - 1].position.y + 16)
            return (p)
        }
        else {
            return this._SnakeHead.position;
        }
    }

    _SnakeBodys: SnakeBody[] = []
    _SnakeHead = new Container();
    bodyTexture = Texture.from('SnakeBody.png');
    constructor(private headsize: number, spawnLocation: Point, private spawnContainer: Container) {
        super()
        pixiScreen = new Point(spawnLocation.x * 2, spawnLocation.y * 2)
        let SnakeTex = new Sprite(this.bodyTexture)
        SnakeTex.anchor.set(.5, 1);
        SnakeTex.height = SnakeTex.width = headsize;
        this._SnakeHead.addChild(SnakeTex)
        this._SnakeHead.position.set(spawnLocation.x, spawnLocation.y)
        this._SnakeHead.name = 'head';
        this.addChild(this._SnakeHead)
        spawnContainer.addChild(this);
        this.FirstBody()
        this.AddBody()
    }
    public CollisionCheck(obstacles: Rectangle[]) {
        let actorbounds = this._SnakeHead.getBounds();
        actorbounds.pad(5, 5);
        obstacles.forEach(obs => {console.log(obs.intersects(actorbounds))})
    }
    public MoveHead() {
        let instruction = TranslateTo(this.headInstruction[1], this._SnakeHead.position, this._deltaPos)
        if (instruction)
            this._SnakeHead.position = instruction
        this.headInstruction[0] = this._SnakeHead.rotation;
        this.UpdateQueues();
    }
    //always preview the rotation cache it on movement 
    public PreviewRotate() {
        this._SnakeHead.rotation = (Rotate(this.headInstruction[1]));
    }
    public UpdateQueues() {
        this._SnakeBodys.forEach(body => body.queue.enqueue([this.headInstruction[0], this.headInstruction[1]]))
        this._SnakeBodys.forEach(body => body.MoveBody())
    }
    //special first body to be spawned with original direction queued
    public FirstBody() {
        let queue = new Queue<movementInstruction>()
        let snakeBody = new SnakeBody(this._deltaPos, queue, this, this.bodyTexture, this.InsertionPosition);
        this._SnakeBodys.push(snakeBody);
    }
    public AddBody() {
        let queue: SnakeQueue = this._SnakeBodys[this._SnakeBodys.length - 1].queue.Clone();
        queue.enqueue([this.headInstruction[0], this.headInstruction[1]]);
        let snakeBody = new SnakeBody(this._deltaPos, queue,
            this, this.bodyTexture, this.InsertionPosition);
        this._SnakeBodys.push(snakeBody);
        console
    }
    DefaultCommands(): KeyboardSchema {
        const pointUp = (new Point(0, -1))
        const pointDown = (new Point(0, 1))
        const pointLeft = (new Point(-1, 0))
        const pointRight = (new Point(1, 0))

        const MoveUp = () => { this.headInstruction[1] = pointUp }
        const MoveDown = () => { this.headInstruction[1] = pointDown }
        const MoveRight = () => { this.headInstruction[1] = pointLeft }
        const MoveLeft = () => { this.headInstruction[1] = pointRight }

        const MoveUpCommand = new CommandBinding('w', MoveUp);
        const MoveDownCommand = new CommandBinding('s', MoveDown);
        const MoveLeftCommand = new CommandBinding('a', MoveRight);
        const MoveRightCommand = new CommandBinding('d', MoveLeft);

        return new KeyboardSchema([MoveUpCommand, MoveDownCommand, MoveLeftCommand, MoveRightCommand])
    }
}
class SnakeBody extends Container {
    public snakeBodyTex: Sprite
    constructor(private _deltaPos: number, public queue: SnakeQueue, container: Snake, bodyTexture: Texture, InsertionPosition: Point) {
        super();
        this.snakeBodyTex = new Sprite(bodyTexture)
        this.snakeBodyTex.anchor.set(.5, 0);
        this.snakeBodyTex.height = this.snakeBodyTex.width = 16
        this.position.set(InsertionPosition.x, InsertionPosition.y);
        this.addChild(this.snakeBodyTex);
        this.name = 'snakebody' + (queue.length)
        container.addChild(this);
    }
    public MoveBody() {
        let instruction = this.queue.dequeue();
        this.position = TranslateTo(instruction[1], this.position, this._deltaPos);
        this.rotation = instruction[0];
    }
}
function Mirror(inp: Point): Point {
    if (inp.x > pixiScreen.x)
        return new Point(0, inp.y)
    else if (inp.x < 0)
        return new Point(pixiScreen.x, inp.y)
    else if (inp.y > pixiScreen.y)
        return new Point(inp.x, 0)
    else if (inp.y < 0)
        return new Point(inp.x, pixiScreen.y)
    else return inp;
}
function TranslateTo(vecDeplacement: Point, vecBase: Point, Coeff: number): Point {
    let atan = Math.atan2(vecDeplacement.x, vecDeplacement.y)
    var _point = new Point(Math.sin(atan), Math.cos(atan));
    vecBase.x += _point.x * Coeff
    vecBase.y += _point.y * Coeff
    //Mirroring function to spawn the snake to opposite site
    vecBase = Mirror(vecBase)
    return vecBase;
}
function Translate(vecDeplacement: Point): Point | undefined {
    let angle = Math.atan2(vecDeplacement.x, vecDeplacement.y)
    var _point = new Point(Math.sin(angle), Math.cos(angle));
    if (vecDeplacement?.x === 0 && vecDeplacement?.y === 0)
        return undefined
    else
        return _point;
}
function Rotate(dir: Point): number {
    let num = Math.atan2(dir.x, -dir.y)
    return num;
}
class Queue<T> {
    //if not lazy instantiated head and tail cast shoul be required
    public constructor(
        private elements: Record<number, T> = {},
        private head: number = 0,
        private tail: number = 0
    ) { }
    public Clone(): Queue<T> {
        const clonedQueue = new Queue<T>();

        // Copy the elements, head, and tail properties
        clonedQueue.elements = { ...this.elements };
        clonedQueue.head = this.head;
        clonedQueue.tail = this.tail;

        return clonedQueue;
    }
    public enqueue(element: T): void {
        this.elements[this.tail] = element;
        this.tail++;
    }

    public dequeue(): T {
        let item = this.elements[this.head];
        delete this.elements[this.head];
        this.head++;

        return item;
    }

    public peek(): T {
        return this.elements[this.head];
    }
    public get length(): number {
        return this.tail - this.head;
    }
}
