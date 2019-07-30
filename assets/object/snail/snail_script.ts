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
    speed: cc.Vec2 = new cc.Vec2(0, 0);

    @property()
    maxSpeed: cc.Vec2 = new cc.Vec2(0, 0);

    @property
    scaleX: number = 1;

    @property
    hurtNum: number = 0;

    @property
    gravity: number = -1000;

    @property
    isAlive: boolean = true;

    @property
    canMove: boolean = true;

    @property({type: cc.AudioClip})
    dieAudio: cc.AudioClip = null;

    touchingNumber: number = 0;
    anim: cc.Animation = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.touchingNumber = 0;
        this.node.scaleX = 1;
        this.anim = this.getComponent(cc.Animation);
    }

    start() {

    }

    onCollisionEnter(other, self) {
        if (other.node.group == 'snailBlock') {
            // console.log('snailBlock.tag == 8');
            if (this.isAlive) {
                this.turn();
                this.speed.x = -this.speed.x;
                return;
            }
        }

        if (other.tag == 5)//木桩
        {
            this.touchingNumber++;
            this.speed.x = -this.speed.x;
            this.turn();
            // console.log('this.touchingNumber++: ' + this.touchingNumber++);
        }


        var otherAabb = other.world.aabb;
        var otherPreAabb = other.world.preAabb.clone();

        var selfAabb = self.world.aabb;
        var selfPreAabb = self.world.preAabb.clone();
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            if (selfPreAabb.yMax < otherPreAabb.yMax)// 兔子和蜗牛
            {
                if (other.node.group == 'player' && this.hurtNum == 0) {
                    //cc.audioEngine.play(this.dieAudio, false, Global.volume);
                }
                this.hurtNum++;
                this.anim.play('snaild');
                // console.log('this.hurtNum===========' + this.hurtNum);
                if (this.hurtNum == 1) {
                    this.canMove = false;
                    this.isAlive = false;
                } else {
                    this.canMove = true;
                    this.speed.x = 500;
                }
                console.log('this.canMove: ' + this.canMove);
            }
            if (selfPreAabb.xMax > otherPreAabb.xMax) {

                this.turn();
                this.speed.x = -this.speed.x;
            }
            if (selfPreAabb.xMin < otherPreAabb.xMin) {
                this.turn();
                this.speed.x = -this.speed.x;
            }

        }

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            if (this.speed.y < 0 && (selfPreAabb.yMax > otherPreAabb.yMax)) {
                this.node.y = otherPreAabb.yMax - this.node.parent.y;

            }
            else if (this.speed.y > 0 && (selfPreAabb.yMin < otherPreAabb.yMin)) {
                this.node.y = otherPreAabb.yMin - selfPreAabb.height - this.node.parent.y;
            }

            this.speed.y = 0;
        }
    }
    
    onCollisionExit(other) {

        if (other.tag == 5) {
            this.touchingNumber--;
        }
    }

    update(dt) {
        // console.log('this.touchingNumber-----' + this.touchingNumber);
        if (this.canMove) {
            this.node.x -= this.speed.x * dt;
        }
        if (this.touchingNumber === 0) {
            this.speed.y += this.gravity * dt;
            if (Math.abs(this.speed.y) > this.maxSpeed.y) {
                this.speed.y = this.speed.y > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
            }
        }
        this.node.y += this.speed.y * dt;
    }

    turn() {
        this.node.scaleX = -this.node.scaleX;
    }

    // update (dt) {}
}
