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

    @property(cc.Prefab)
    CoinJump: cc.Prefab = null;

    @property(cc.Prefab)
    mushroom: cc.Prefab = null;

    @property()
    isCollisionable: boolean = true;

    anim: cc.Animation = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        this.node.scaleX = 1;
        this.node.zIndex = 1;
        // this.Score = this.ScoreBar.getComponent('Score');
    }

    start() {

    }

    onCollisionEnter(other, self) {
        var otherAabb = other.world.aabb;
        var otherPreAabb = other.world.preAabb.clone();

        var selfAabb = self.world.aabb;
        var selfPreAabb = self.world.preAabb.clone();
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {

            if (selfPreAabb.yMin > otherPreAabb.yMin) {

                if (this.isCollisionable) {
                    if (self.tag == 7)//mushroom
                    {
                        var bonus = cc.instantiate(this.mushroom);
                    }
                    else {
                        //Global.isGotCoin = true;
                        var bonus = cc.instantiate(this.CoinJump);
                    }

                    bonus.position = this.node.parent.convertToNodeSpace(new cc.Vec2(selfAabb.x + 30, selfAabb.y + 30));
                    this.node.parent.addChild(bonus);
                    this.isCollisionable = false;
                }

                this.anim.play('bonusBlocked');
            }
        }
    }

    // update (dt) {}
}
