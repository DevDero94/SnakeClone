import { ObservablePoint, Sprite, Texture, Container, ColorSource, Point } from 'pixi.js'
class CompoundObstacle {
    obj: SceneObject[] = [];
    container = new Container();
    Adopt() {
        {
            for (let index = 0; index < this.obj.length; index++) {
                let sprite = this.obj.at(index)?._sprite
                if (sprite != undefined)
                    this.container.addChild(sprite)
            }
        } this.obj
    }

}

export class Borders extends CompoundObstacle {
    Draw() {
        for (let index = 0; index < 4; index++) {
            let width = screen.width / 50
            let point = new ObservablePoint(this.callback, undefined, 0, 0)
            let currentObstacle = new SceneObject(point, Texture.EMPTY, [0, 7, 0.7, 0.7],
                screenX, width);
        }
    }
    callback() {
    }
}

class SceneObject extends Container {
    _sprite: Sprite;

    constructor(position: Point, texture: Texture,
        color: ColorSource, height: number, width: number) {
        super();
        this._sprite = new Sprite(texture);
        this._sprite.position.set(position.x, position.y);
        this._sprite.anchor.set(.5, .5);
        this._sprite.tint = color;
        this._sprite.height = height;
        this._sprite.width = width;
        this.addChild(this._sprite)
    }
}

export class Goal {
    constructor(public pixiScreen: Point) {
    }
    public obstacle: SceneObject = new SceneObject(this.RandomPosition(this.pixiScreen), Texture.WHITE, '0xff0000ff', 16, 16)

    RandomPosition(pixiScreen: Point): Point {
        const x = Math.random() * pixiScreen.x;
        const y = Math.random() * pixiScreen.y;
        return new Point(x, y);
    }
}