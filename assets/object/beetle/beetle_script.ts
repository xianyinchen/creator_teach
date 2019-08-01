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
export default class enemy extends cc.Component {

    @property()
    speed: cc.Vec2 = new cc.Vec2(0, 0);

    @property
    scaleX: number = 1;

    @property
    canMove: boolean = true;

    @property({ type: cc.AudioClip })
    dieAudio: cc.AudioClip = null;

    anim: cc.Animation = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.scaleX = 1;
        this.anim = this.getComponent(cc.Animation);
    }

    start() {

    }

    onCollisionEnter(other, self) {
        if (other.tag == 5) {
            this.turn();
            this.speed.x = -this.speed.x;
        }

        var otherAabb = other.world.aabb;
        var otherPreAabb = other.world.preAabb.clone();

        var selfAabb = self.world.aabb;
        var selfPreAabb = self.world.preAabb.clone();
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            if (selfPreAabb.yMax < otherPreAabb.yMax && other.node.group == 'player') {
                this.todie();
            }
        }
    }

    todie() {
        //cc.audioEngine.play(this.dieAudio, false, Global.volume);
        this.anim.play('beetled');
        this.canMove = false;
        this.node.height = this.node.height * 0.3;
        // this.node.y = 0.5*this.node.y;
        // var action = cc.fadeOut(1.0);
        this.node.runAction(cc.fadeOut(.5));

        this.scheduleOnce(function () {
            // 这里的 this 指向 component
            this.node.removeFromParent();
        }, 0.5);
    }

    update(dt) {
        if (this.canMove) {
            this.node.x -= this.speed.x * dt;
        }
    }

    turn() {
        // this.speedX = -100;
        this.node.scaleX = -this.node.scaleX;
    }

    // update (dt) {}
}
