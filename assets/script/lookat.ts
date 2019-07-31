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

    @property(cc.Node)
    target: cc.Node = null;

    @property(cc.Node)
    map: cc.Node = null;

    boundingBox: cc.Rect = null;
    screenMiddle: cc.Vec2 = null;

    minX: number = 0;
    maxX: number = 0;
    minY: number = 0;
    maxY: number = 0;

    isRun: boolean = true;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.boundingBox = new cc.Rect(0, 0, this.map.width, this.map.height);
        let winsize = cc.winSize;
        this.screenMiddle = new cc.Vec2(winsize.width / 2, winsize.height / 2);
        this.minX = -(this.boundingBox.xMax - winsize.width);
        this.maxX = this.boundingBox.xMin;
        this.minY = -(this.boundingBox.yMax - winsize.height);
        this.maxY = this.boundingBox.yMin;
    }

    update() {
        if (!this.isRun) 
            return;
            
        //将一个点转换到世界空间坐标系。结果以 Vec2 为单位。
        let pos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        // console.log('pos：'+pos);
        let targertPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        // console.log('targertPos：'+targertPos);
        let dis = pos.sub(targertPos);
        // console.log('dis：'+dis);
        let dest = this.screenMiddle.add(dis);
        // console.log('dest：'+dest);
        dest.x = cc.misc.clampf(dest.x, this.minX, this.maxX);//限定dest.x的最大最小值。
        dest.y = this.minY;
        // dest.y = cc.clampf(dest.y, this.minY, this.maxY);
        this.node.position = this.node.parent.convertToNodeSpaceAR(dest);
    }
}
