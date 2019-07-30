// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class CPlayer extends cc.Component {

    @property(cc.Animation)
    anim: cc.Animation = null;

    @property(cc.Vec2)
    public maxSpeedV2: cc.Vec2 = new cc.Vec2(0, 0);

    @property()
    jumpSpeed: number = 0;

    public _life: number = 0;
    public _direction: number = 0;
    public _speed: cc.Vec2 = new cc.Vec2(0, 0);

    public collisionX: number = 0;
    public collisionY: number = 0;

    public isDead: boolean = false;
    public isHunker: boolean = false;
    public isJumping: boolean = false;
    public isFallDown: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {

    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.moveLeft();
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.moveRight();
                break;
            case cc.macro.KEY.w:
            case cc.macro.KEY.up:
                this.jump();
                break;
            case cc.macro.KEY.down:
            case cc.macro.KEY.s:
                this.down();
                break;
        }
    }

    onKeyUp(event) {
        switch (event.keyCode) {

            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.cancelMove();
                break;
            case cc.macro.KEY.up:
            case cc.macro.KEY.w:
                this.cancelUp();
                break;
            case cc.macro.KEY.s:
            case cc.macro.KEY.down:
                this.cancelDown();
                break;
        }
    }

    moveLeft() {
        if (this._direction !== -1 && !this.isDead) {
            this.anim.play("player_walk");
        }

        this.node.scaleX = -Math.abs(this.node.scaleX);
        this._direction = -1;
    }

    moveRight() {
        if (this._direction !== 1 && !this.isDead) {
            this.anim.play("player_walk");
        }

        this.node.scaleX = Math.abs(this.node.scaleX);
        this._direction = 1;
    }

    jump() {
        if (this.isJumping || this.isDead)
            return;

        this.anim.play("player_jump");
        this._speed.y = this.jumpSpeed;
        this.isJumping = true;
    }

    fall() {
        if (this.isJumping || this.isDead)
            return;

        this.anim.play("player_jump");
        this.isJumping = true;
    }

    down() {
        if (this.isHunker || this.isDead)
            return;

        this.anim.play("player_hunker");
        this.isHunker = true;
    }

    cancelDown() {
        if (this.isDead)
            return;

        if (this._direction !== 0) {
            this.anim.play("player_walk");
        } else {
            this.anim.play("player_idle");
        }

        this.isHunker = false;
    }

    cancelMove() {
        this._direction = 0;

        if (!this.isDead && !this.isJumping) {
            this.anim.play("player_idle");
        }
    }

    cancelUp() {

    }

    // kill enemy
    stamp() {
        this.anim.play("player_jump");
        this._speed.y = this.jumpSpeed * 0.5;
    }

    // die and kick out
    die() {
        this.anim.play("player_die");
        this._speed.y = this.jumpSpeed;
        this.isDead = true;
        this._life = 0;

        cc.director.getCollisionManager().enabled = false;
        //this.node.parent.getComponent('Cameras').isRun = false;
        setTimeout(() => { this.node.destroy() }, 2100)
    }

    life(add?: number) {
        if (null != add) {
            this._life += add;
        }

        return this._life;
    }

    speed(): cc.Vec2 {
        return this._speed;
    }

    maxSpeed(): cc.Vec2 {
        return this.maxSpeedV2;
    }

    coin(add?: number) {
    }

    play(name: string) {
        this.anim.play("player_" + name);
    }

    direction(): number {
        return this._direction;
    }

    gameOver() {
        if (this._life > 0)
            return;

        this.scheduleOnce(function () {
            cc.find('over').active = true;
        }, 2);
    }
}
