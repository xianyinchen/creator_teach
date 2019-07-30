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

    @property
    jumpHeight: number = 0;

    @property
    jumpDuring: number = 0;

    @property({type:cc.AudioClip})
    jumpAudio: cc.AudioClip = null;

    jumpAction: cc.Action = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.jumpAction = this.setJumpAction();

        this.node.runAction(this.jumpAction);
        // this.node.removeFromParent();
        this.scheduleOnce(function () {
            // 这里的 this 指向 component
            this.node.removeFromParent();
        }, 1);
        // var seq = cc.sequence(cc.moveBy(1, 0, 200), cc.moveBy(1, 0,-200));
        // this.node.runAction(seq);        
    }

    start() {

    }

    setJumpAction() {
        var fadeIn = cc.fadeIn(0);
        var fadeOut = cc.fadeOut(1);
        var jumpUp = cc.moveBy(this.jumpDuring, new cc.Vec2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());// 先快后慢
        var jumpDown = cc.moveBy(this.jumpDuring, new cc.Vec2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());//缓动 先慢后快
        // var callback = cc.callFunc(this.playJumpSound,this);
        // return cc.sequence(callback,fadeIn,jumpUp, jumpDown,fadeOut);
        return cc.sequence(fadeIn, jumpUp, jumpDown, fadeOut);
    }

    // update (dt) {}
}
