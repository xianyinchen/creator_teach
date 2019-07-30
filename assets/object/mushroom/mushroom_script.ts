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
export default class NewClass extends cc.Component {

    @property()
    gravity: number = -1000;

    @property()
    jumpHeight: number = 0;//跳高

    @property()
    jumpDuring: number = 0;//持续时间

    @property()
    speed: cc.Vec2 = new cc.Vec2(0, 0);

    @property()
    maxSpeed: cc.Vec2 = new cc.Vec2(2000, 2000);

    @property({type: cc.AudioClip})
    mushroom_catch_Audio: cc.AudioClip = null;

    @property({type: cc.AudioClip})
    mushroom_appear_Audio: cc.AudioClip = null;

    touchingNumber: number = 0;
    jumpAction: cc.Action = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.touchingNumber = 0;
        cc.audioEngine.play(this.mushroom_appear_Audio, false, 1);
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);
    }

    start() {

    }

    setJumpAction() {
        var fadeIn = cc.fadeIn(0);
        // var fadeOut = cc.fadeOut(1);
        var jumpUp = cc.moveBy(this.jumpDuring, new cc.Vec2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());// 先快后慢
        // var moveRight = cc.moveBy( cc.p(10, 0));
        // var callback = cc.callFunc(this.playJumpSound,this);
        // return cc.sequence(callback,fadeIn,jumpUp, jumpDown,fadeOut);

        return cc.sequence(fadeIn, jumpUp);
    }

    onCollisionEnter(other, self) {

        var otherAabb = other.world.aabb;
        var otherPreAabb = other.world.preAabb.clone();

        var selfAabb = self.world.aabb;
        var selfPreAabb = self.world.preAabb.clone();
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;
        if (other.tag == 2 || other.tag == 3 || other.tag == 5) {
            this.touchingNumber++;
        }
        if (other.tag == 0) {
            //cc.audioEngine.play(this.mushroom_catch_Audio, false, Global.volume);
            //Global.addSpeed = 1.2;//玩家1.2倍速度
            this.scheduleOnce(function () {
                // console.log('mushroom onCollisionEnter');
                this.node.removeFromParent();
            }, 0.2);
        }
        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {

        }
    }
    onCollisionExit(other) {

        if (other.tag == 2 || other.tag == 3 || other.tag == 5) {
            this.touchingNumber--;
        }

    }

    // called every frame, uncomment this function to activate update callback
    update(dt) {
        // console.log("this.touchingNumber: " + this.touchingNumber);
        // if (this.collisionY === 0)
        if (this.touchingNumber === 0) {
            this.speed.y += this.gravity * dt;
            if (Math.abs(this.speed.y) > this.maxSpeed.y) {
                this.speed.y = this.speed.y > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
            }
        }
        // this.node.x++;
        // this.node.y += this.speed.y * dt;
    }
}
