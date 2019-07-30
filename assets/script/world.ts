// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class CWorld extends cc.Component {

    @property()
    worldG: number = 0;    

    @property() 
    worldFallG: number = 0;

    static G: number = 0;    
    static FallG: number = 0; 
    static GiveCoin: number = 0;
    static isPress: boolean = false;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        CWorld.G = this.__G;    
        CWorld.FallG = this.__FallG; 
    }

    start () {
        cc.director.getCollisionManager().enabled = true;
    }

    // update (dt) {}
}
