// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class CMap extends cc.Component {

    @property(cc.TiledMap)
    worldMap: cc.TiledMap = null;

    @property
    PointsName: string = 'points';

    @property
    playerName: string = 'player';

    @property
    finishName: string = 'finish';

    @property
    Wall: string = 'wall';

    @property
    Ground: string = 'ground';

    @property
    destroyable_blocksName: string = 'destroyable_blocks';

    @property
    bonus_blocksName: string = 'bonus_blocks';

    @property
    CoinsName: string = 'coins';

    @property
    enemyName: string = 'enemies';

    @property
    floorLayerName: string = 'floor';

    @property
    waterLayerName: string = 'water';

    @property
    CollisionsGroupName: string = 'physics';

    @property
    snailBlockName: string = 'snailBlock';

    @property(cc.Prefab)
    CoinsPre: cc.Prefab = null;

    @property(cc.Prefab)
    ColliderPreName: cc.Prefab = null;

    @property(cc.Prefab)
    breakableWallPre: cc.Prefab = null;

    @property(cc.Prefab)
    bonusWallPre: cc.Prefab = null;

    @property(cc.Prefab)
    enemyBeetle: cc.Prefab = null;

    @property(cc.Prefab)
    enemySnail: cc.Prefab = null;

    @property(cc.Prefab)
    castle_finish: cc.Prefab = null;

    @property(cc.Prefab)
    snailBlockPre: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        var _layerFloor: cc.TiledLayer = this.worldMap.getLayer(this.floorLayerName);
        if (!_layerFloor) return;

        var startPoint = this.worldMap.getObjectGroup(this.playerName);
        var endPoint = this.worldMap.getObjectGroup(this.finishName);
        var coinPoints = this.worldMap.getObjectGroup(this.CoinsName);
        var collisionPoints = this.worldMap.getObjectGroup(this.CollisionsGroupName);
        var destroyable_blocks = this.worldMap.getObjectGroup(this.destroyable_blocksName);
        var bonus_blocks = this.worldMap.getObjectGroup(this.bonus_blocksName);
        var enemies = this.worldMap.getObjectGroup(this.enemyName);
        var waters = this.worldMap.getObjectGroup(this.waterLayerName);
        var finish = this.worldMap.getObjectGroup(this.finishName);
        // var sni = this.worldMap.getObjectGroup(this.finishName);
        var snailBlocks = this.worldMap.getObjectGroup(this.snailBlockName);
        var finishPoint = finish.getObject('finishPoint');
        var finishNode = finishPoint.sgNode;

        var castle_finish = cc.instantiate(this.castle_finish);
        castle_finish.x = finishNode.x;
        castle_finish.y = finishNode.y + 200;
        this.node.addChild(castle_finish);

        if (!startPoint || !endPoint)
            return;

        for (var i = 1; i < 3; i++) {
            var snailBlockName = 'snailBlock' + i;
            var snailBlock = snailBlocks.getObject(snailBlockName);
            var snailBlockSgNode = snailBlock.sgNode;
            var snailBlockNode = cc.instantiate(this.snailBlockPre);
            snailBlockNode.width = snailBlockSgNode.width;
            snailBlockNode.height = snailBlockSgNode.height;
            snailBlockNode.x = snailBlockSgNode.x;
            snailBlockNode.y = snailBlockSgNode.y - snailBlockSgNode.height;
            snailBlockNode.addComponent(cc.BoxCollider);
            snailBlockNode.getComponent(cc.BoxCollider).size = cc.size(snailBlockNode.width, snailBlockNode.height);
            snailBlockNode.getComponent(cc.BoxCollider).offset = new cc.Vec2(snailBlockNode.width / 2, -snailBlockNode.height / 2);
            // console.log('watersgNode.height: '+snailBlockNode.height);
            snailBlockNode.getComponent(cc.BoxCollider).tag = 9;
            this.node.addChild(snailBlockNode);

        }
        for (var i = 1; i < 8; i++) {
            var waterName = 'water' + i;
            var waterBlock = waters.getObject(waterName);
            var watersgNode = waterBlock.sgNode;
            // var waterNode = new cc.Node();
            var waterNode = cc.instantiate(this.ColliderPreName);
            waterNode.group = 'water';
            // waterNode.setAnchorPoint(0,0);
            waterNode.width = watersgNode.width;
            waterNode.height = watersgNode.height;
            waterNode.x = watersgNode.x;
            waterNode.y = watersgNode.y - watersgNode.height;
            waterNode.addComponent(cc.BoxCollider);
            waterNode.getComponent(cc.BoxCollider).size = cc.size(waterNode.width, waterNode.height);
            waterNode.getComponent(cc.BoxCollider).offset = new cc.Vec2(waterNode.width / 2, -waterNode.height / 2);
            console.log('watersgNode.height: ' + watersgNode.height);
            waterNode.getComponent(cc.BoxCollider).tag = 6;
            this.node.addChild(waterNode);
        }
        for (var i = 1; i < 17; i++) {
            var enemyName = 'enemy' + i;
            var enemyBlock = enemies.getObject(enemyName);
            var enemyNode = enemyBlock.sgNode;
            if (5 == i || 9 == i) {
                var enemy = cc.instantiate(this.enemySnail);
            }
            else
                var enemy = cc.instantiate(this.enemyBeetle);
            enemy.x = enemyNode.x;
            enemy.y = enemyNode.y;
            this.node.addChild(enemy);
            // console.log('enemy Name'+enemy._name);

        }
        for (var i = 1; i < 30; i++) {
            var destroyable_blockName = 'destroyable_blocks' + i;
            var destroyable_block = destroyable_blocks.getObject(destroyable_blockName);
            var destroyable_blockNode = destroyable_block.sgNode;
            var breakableWall = cc.instantiate(this.breakableWallPre);
            breakableWall.x = destroyable_blockNode.x;
            // breakableWall.height = destroyable_blockNode.height;
            breakableWall.y = destroyable_blockNode.y;
            this.node.addChild(breakableWall);
        }
        for (var i = 1; i < 7; i++) {
            var bonus_blockName = 'bonus_block' + i;
            var bonus_block = bonus_blocks.getObject(bonus_blockName);
            var bonus_blockNode = bonus_block.sgNode;
            var bonusWall: cc.Node = cc.instantiate(this.bonusWallPre);
            // console.log('bonusWallPre Name: ' + bonusWall.name);
            bonusWall.zIndex = 99;
            bonusWall.x = bonus_blockNode.x;
            // bonusWall.height = bonus_blockNode.height;
            bonusWall.y = bonus_blockNode.y;
            if (bonus_block.name == 'bonus_block4') {
                bonusWall.getComponent(cc.BoxCollider).tag = 7;
            }
            this.node.addChild(bonusWall);
        }
        for (var i = 1; i < 40; i++) {
            var coinName = 'coin' + i;
            var coinPoint = coinPoints.getObject(coinName);
            var coinNode = coinPoint.sgNode;
            var coin = cc.instantiate(this.CoinsPre);
            coin.x = coinNode.x;
            // coin.height = coinNode.height;
            coin.y = coinNode.y;
            this.node.addChild(coin);
        }
        for (var i = 1; i < 31; i++) {
            // this.collisionName[i] = i.toString();
            var collisionName = i.toString();
            var collider = collisionPoints.getObject(collisionName);
            var collisionNode = collider.sgNode;
            var node = cc.instantiate(this.ColliderPreName);
            // var node = new cc.Node();
            node.setAnchorPoint(0.5, 0.5);
            node.x = collisionNode.x;
            node.height = collisionNode.height;
            node.y = collisionNode.y - collisionNode.height;
            node.width = collisionNode.width;
            node.addComponent(cc.BoxCollider);
            node.getComponent(cc.BoxCollider).size = cc.size(collisionNode.width, collisionNode.height);
            node.getComponent(cc.BoxCollider).offset = cc.v2(collisionNode.width / 2, collisionNode.height / 2);
            node.getComponent(cc.BoxCollider).tag = 5;
            this.node.addChild(node);
        }
        var rabbit = startPoint.getObject('rabbit');
        // console.log("rabbit: " + rabbit);
        var startPos = cc.p(rabbit.sgNode.x, rabbit.sgNode.y);
    }

    // update (dt) {}
}
