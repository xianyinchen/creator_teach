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

    @property(cc.Node)
    worldPlayer: cc.Node = null;

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

    onLoad () {

    }

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
        var snailBlocks = this.worldMap.getObjectGroup(this.snailBlockName);
        var finishPoint = finish.getObject('finishPoint');
    
        var castle_finish = cc.instantiate(this.castle_finish);
        castle_finish.x = finishPoint.x;
        castle_finish.y = finishPoint.y + 200;
        this.node.addChild(castle_finish);

        if (!startPoint || !endPoint)
            return;

        for (var i = 1; i < 3; i++) {
            var snailBlockName = 'snailBlock' + i;
            var snailBlock = snailBlocks.getObject(snailBlockName);
            var snailBlockNode = cc.instantiate(this.snailBlockPre);
            snailBlockNode.width = snailBlock.width;
            snailBlockNode.height = snailBlock.height;
            snailBlockNode.x = snailBlock.x;
            snailBlockNode.y = snailBlock.y - snailBlock.height;
            snailBlockNode.addComponent(cc.BoxCollider);
            snailBlockNode.getComponent(cc.BoxCollider).size = cc.size(snailBlockNode.width, snailBlockNode.height);
            snailBlockNode.getComponent(cc.BoxCollider).offset = new cc.Vec2(snailBlockNode.width / 2, -snailBlockNode.height / 2);
            snailBlockNode.getComponent(cc.BoxCollider).tag = 9;
            this.node.addChild(snailBlockNode);

        }
        for (var i = 1; i < 8; i++) {
            var waterName = 'water' + i;
            var waterBlock = waters.getObject(waterName);
            var waterNode = cc.instantiate(this.ColliderPreName);
            waterNode.group = 'water';
            waterNode.width = waterBlock.width;
            waterNode.height = waterBlock.height;
            waterNode.x = waterBlock.x;
            waterNode.y = waterBlock.y - waterBlock.height;
            waterNode.addComponent(cc.BoxCollider);
            waterNode.getComponent(cc.BoxCollider).size = cc.size(waterNode.width, waterNode.height);
            waterNode.getComponent(cc.BoxCollider).offset = new cc.Vec2(waterNode.width / 2, -waterNode.height / 2);
            console.log('waterBlock.height: ' + waterBlock.height);
            waterNode.getComponent(cc.BoxCollider).tag = 6;
            this.node.addChild(waterNode);
        }
        for (var i = 1; i < 17; i++) {
            var enemyName = 'enemy' + i;
            var enemyBlock = enemies.getObject(enemyName);
            if (5 == i || 9 == i) {
                var enemy = cc.instantiate(this.enemySnail);
            }
            else
                var enemy = cc.instantiate(this.enemyBeetle);
            enemy.x = enemyBlock.x;
            enemy.y = enemyBlock.y;
            this.node.addChild(enemy);

        }
        for (var i = 1; i < 30; i++) {
            var destroyable_blockName = 'destroyable_blocks' + i;
            var destroyable_block = destroyable_blocks.getObject(destroyable_blockName);
            var breakableWall = cc.instantiate(this.breakableWallPre);
            breakableWall.x = destroyable_block.x;
            breakableWall.y = destroyable_block.y;
            this.node.addChild(breakableWall);
        }
        for (var i = 1; i < 7; i++) {
            var bonus_blockName = 'bonus_block' + i;
            var bonus_block = bonus_blocks.getObject(bonus_blockName);
            var bonusWall: cc.Node = cc.instantiate(this.bonusWallPre);
            bonusWall.zIndex = 99;
            bonusWall.x = bonus_block.x;
            bonusWall.y = bonus_block.y;
            if (bonus_block.name == 'bonus_block4') {
                bonusWall.getComponent(cc.BoxCollider).tag = 7;
            }
            this.node.addChild(bonusWall);
        }
        for (var i = 1; i < 40; i++) {
            var coinName = 'coin' + i;
            var coinPoint = coinPoints.getObject(coinName);
            var coin = cc.instantiate(this.CoinsPre);
            coin.x = coinPoint.x;
            // coin.height = coinNode.height;
            coin.y = coinPoint.y;
            this.node.addChild(coin);
        }
        for (var i = 1; i < 31; i++) {
            // this.collisionName[i] = i.toString();
            var collisionName = i.toString();
            var collider = collisionPoints.getObject(collisionName);
            var node = cc.instantiate(this.ColliderPreName);
            // var node = new cc.Node();
            node.setAnchorPoint(0.5, 0.5);
            node.x = collider.x;
            node.height = collider.height;
            node.y = collider.y - collider.height;
            node.width = collider.width;
            node.addComponent(cc.BoxCollider);
            node.getComponent(cc.BoxCollider).size = cc.size(collider.width, collider.height);
            node.getComponent(cc.BoxCollider).offset = cc.v2(collider.width / 2, collider.height / 2);
            node.getComponent(cc.BoxCollider).tag = 5;
            this.node.addChild(node);
        }
    }
}
