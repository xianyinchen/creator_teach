import CWorld from "./world";

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

    @property()
    public maxSpeedV2: cc.Vec2 = new cc.Vec2(0, 0);

    @property({ type: cc.AudioClip })
    dieAudio: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    jumpAudio: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    player_decrease_Audio: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    hit_block_Audio: cc.AudioClip = null;

    @property()
    jumpSpeed: number = 0;

    public _life: number = 1;
    public _direction: number = 0;
    public _speed: cc.Vec2 = new cc.Vec2(0, 0);

    public collisionX: number = 0;
    public collisionY: number = 0;

    public isDead: boolean = false;
    public isHunker: boolean = false;
    public isJumping: boolean = false;
    public isFallDown: boolean = false;

    private jumpCount: number = 0;
    private touchingNumber: number = 0;
    private isWallCollisionCount: number = 0;
    private buttonIsPressed: boolean = false;

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
                this.playerLeft();
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.playerRight();
                break;
            case cc.macro.KEY.w:
            case cc.macro.KEY.up:
                this.playerUp();
                break;
            case cc.macro.KEY.down:
            case cc.macro.KEY.s:
                this.playerDown();
                break;
        }
    }

    onKeyUp(event) {
        switch (event.keyCode) {

            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.noLRControlPlayer();
                break;
            case cc.macro.KEY.up:
            case cc.macro.KEY.w:
                this.noUpControlPlayer();
                break;
            case cc.macro.KEY.s:
            case cc.macro.KEY.down:
                this.noDownControlPlayer();
                break;
        }
    }
    noDownControlPlayer() {
        if (this.touchingNumber === 0) {
            return;
        }
        if (!this.isDead) {
            if (this._direction !== 0) {
                this.player_walk();
            } else {
                this.player_idle();
            }
            this.isHunker = false;
        }
    }

    noLRControlPlayer() {
        this._direction = 0;
        if (!this.isDead && this.jumpCount == 0)//jumpCount 跳跃次数 落地为0 落地之后才可以再跳
        {
            this.player_idle();
        }
        this.buttonIsPressed = false;
    }

    noUpControlPlayer() {
        if (this.touchingNumber !== 0) {
            // this.isJumping = false; //是否在跳状态
        }
    }

    playerLeft() {
        if (this._direction !== -1 && this.jumpCount == 0 && !this.isDead) {
            this.player_walk();
        }
        this.buttonIsPressed = true;
        this.turnLeft();
        this._direction = -1;
    }

    playerRight() {
        if (this._direction !== 1 && this.jumpCount == 0 && !this.isDead) {
            this.player_walk();
        }
        this.buttonIsPressed = true;
        this.turnRight();
        this._direction = 1;
    }

    playerUp() {
        console.log('this.isJumping: ' + this.isJumping);
        console.log('this.jumpCount: ' + this.jumpCount);
        if (!this.isJumping && this.jumpCount == 0 && !this.isDead)// 如果活着的没在跳跃状态，并且玩家着地
        {

            this.player_jump();
            this._speed.y = this.jumpSpeed;
            this.isJumping = true;
        }
    }

    playerDown() {
        if (this.touchingNumber === 0) {
            return;
        }
        if (!this.isHunker && !this.isDead) {
            this.player_hunker();
            this.isHunker = true;
        }
    }

    player_idle() {
        this.anim.play("player_idle");
    }

    player_walk() {
        this.anim.play("player_walk");
    }

    player_jump() {
        cc.audioEngine.play(this.jumpAudio, false, 1);
        this.anim.play("player_jump");
    }

    player_hunker() {
        this.anim.play("player_hunker");
    }

    rabbitJump() {//玩家踩到敌人的跳跃
        this.anim.play("player_jump");
        this._speed.y = this.jumpSpeed * 0.5;
    }

    rabbitDieJump() {
        cc.director.getCollisionManager().enabled = false;
        cc.audioEngine.play(this.dieAudio, false, 1);
        this.anim.play("player_die");
        this._speed.y = this.jumpSpeed;
        this.touchingNumber = 0;
        this.isDead = true;
        this._life = 0;
        this.node.parent.getComponent('camera').isRun = false;
        this.node.runAction(cc.sequence(cc.delayTime(2.1), cc.callFunc(() => { this.node.destroy() })))
    }

    OverNodeLoad() {
        if (this._life == 0) {
            this.scheduleOnce(function () {
                // 这里的 this 指向 component
                // cc.find('over').active = true;
                cc.game.restart();
            }, 2);
        }
    }

    onCollisionEnter(other, self) {
        if (this.touchingNumber == 0) {
            if (this.buttonIsPressed) // 左右按键
                this.player_walk();// 有按键时，快要落地之前为walk状态
            else
                this.player_idle();// 没有按键时，快要落地之前为idle状态
        }
        switch (other.tag) {
            case 1://coin.tag = 1
                this.collisionCoinEnter(other, self);
                break;
            case 2://bonusblock6.tag = 2
            case 3://breakableWall = 3
            case 7: //bonusblock6withMushroom.tag = 7
                this.collisionBonusWallEnter(other, self);
                break;
            case 4://enemy.tag = 4
                this.collisionEnemyEnter(other, self);
                break;
            case 5://platform.tag = 5
                this.collisionPlatformEnter(other, self);
                break;
            case 6://water.tag = 6
                this.collisionWaterEnter(other, self);
                break;
            case 8://mushroom.tag = 8
                this.collisionMushroomEnter(other, self);
                break;
        }
    }

    collisionMushroomEnter(other, self) {
        var actionBy = cc.scaleBy(1, 5 / 3);
        this.node.runAction(actionBy);
        this._life = 2;
    }

    collisionEnemyEnter(other, self) {
        // 1st step
        // get pre aabb, go back before collision
        var otherAabb = other.world.aabb;
        var otherPreAabb = other.world.preAabb.clone();

        var selfAabb = self.world.aabb;
        var selfPreAabb = self.world.preAabb.clone();

        // 2nd step
        // forward x-axis, check whether collision on x-axis
        selfPreAabb.x = selfAabb.x;
        otherPreAabb.x = otherAabb.x;
        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            if (this._life == 2) {
                cc.audioEngine.play(this.player_decrease_Audio, false, 1);
                var actionBy = cc.scaleBy(1, 3 / 5);
                this.node.runAction(actionBy);
                this._life--;
            } else if (this._life == 1) {
                this.anim.play("player_die");
                this.rabbitDieJump();
                // this._life = 0
                this.OverNodeLoad();
                return;
            }


            if (this._speed.x < 0 && (selfPreAabb.xMax > otherPreAabb.xMax)) {

                // this.node.x = otherPreAabb.xMax - this.node.parent.x;
                this.node.x += Math.floor(Math.abs(otherAabb.xMax - selfAabb.xMin));
                this.collisionX = -1;
                // this.node.y= this.node.y;

            }
            else if (this._speed.x > 0 && (selfPreAabb.xMin < otherPreAabb.xMin)) {
                // this.node.y= this.node.y;
                // this.anim.play("player_die");
                // this.node.x = otherPreAabb.xMin - selfPreAabb.width - this.node.parent.x;
                this.node.x -= Math.floor(Math.abs(otherAabb.xMin - selfAabb.xMax));
                // console.log("this.node.x:     " + Math.abs(otherAabb.xMin - selfAabb.xMax));
                this.collisionX = 1;
                // console.log("this.anim.play player_die");

            }

            this._speed.x = 0;
            other.touchingX = true;
            return;
        }

        // 3rd step
        // forward y-axis, check whether collision on y-axis
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            if (this._speed.y < 0 && (selfPreAabb.yMax > otherPreAabb.yMax)) {
                this.rabbitJump(); //玩家踩到敌人的跳跃
                return;
            }
            if (this._speed.y > 0 && (selfPreAabb.yMax < otherPreAabb.yMax)) {
                // this.node.removeFromParent();
                if (this._life == 2) {
                    var actionBy = cc.scaleBy(1, 3 / 5);
                    this.node.runAction(actionBy);
                    this._life--;
                } else if (this._life == 1) {
                    this.anim.play("player_die");
                    this.rabbitDieJump();
                    // this._life = 0
                    this.OverNodeLoad();
                    return;
                }
            }
            this._speed.y = 0;
            other.touchingY = true;
        }
        this.isWallCollisionCount++;
    }

    collisionCoinEnter(other, self) {
        other.node.removeFromParent();
        //this.Score.addCoin();
        // this.uiLayerComonent.addGold();
    }

    collisionWaterEnter(other, self) {
        var otherAabb = other.world.aabb;
        var otherPreAabb = other.world.preAabb.clone();

        var selfAabb = self.world.aabb;
        var selfPreAabb = self.world.preAabb.clone();
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            console.log('other: ' + other.tag);
        }
        cc.audioEngine.play(this.dieAudio, false, 1);
        this.anim.play("player_die");
        this.rabbitDieJump();

        this._life = 0;
        this.OverNodeLoad();
        // cc.find('over').active = true;
        // cc.director.pause();
        this.scheduleOnce(function () {
            this.node.removeFromParent();
        }, 2);
        this.node.parent.getComponent('camera').isRun = false;
        return;
    }

    collisionBonusWallEnter(other, self) {
        this.touchingNumber++;
        this.jumpCount = 0;
        var otherAabb = other.world.aabb;
        var otherPreAabb = other.world.preAabb.clone();

        var selfAabb = self.world.aabb;
        var selfPreAabb = self.world.preAabb.clone();
        selfPreAabb.x = selfAabb.x;
        otherPreAabb.x = otherAabb.x;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            if (this._speed.x < 0 && (selfPreAabb.xMax > otherPreAabb.xMax)) {
                if (Math.abs(selfPreAabb.yMin - otherPreAabb.yMax) < 0.3) {
                    this.collisionX = 0;
                }
                else
                    this.collisionX = -1;
            }
            else if (this._speed.x > 0 && (selfPreAabb.xMin < otherPreAabb.xMin)) {
                if (Math.abs(selfPreAabb.yMin - otherPreAabb.yMax) < 0.3) {
                    this.collisionX = 0;
                }
                else
                    this.collisionX = 1;
            }

            other.touchingX = true;
            if (selfPreAabb.yMin < otherPreAabb.yMax) {
                this._speed.x = 0;
                return;
            }
        }
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            if (this._speed.y < 0 && (selfPreAabb.yMax > otherPreAabb.yMax)) {
                this.node.y = otherPreAabb.yMax - this.node.parent.y;
                this.isJumping = false;// 碰到砖块不用跳
                this.collisionY = -1;
            }
            else if (this._speed.y > 0 && (selfPreAabb.yMin < otherPreAabb.yMin)) {
                this.node.y = otherPreAabb.yMin - selfPreAabb.height - this.node.parent.y;
                this.collisionY = 1;
                this.isFallDown = true;
            }
            else if ((selfPreAabb.xMax == otherPreAabb.xMin)) {
                this.isFallDown = true;
            }

            this._speed.y = 0;
            other.touchingY = true;
        }

        this.isWallCollisionCount++;
    }

    collisionPlatformEnter(other, self) {
        // this.node.color = cc.Color.RED;
        this.touchingNumber++;
        this.jumpCount = 0;
        // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        var otherAabb = other.world.aabb;
        // 上一次计算的碰撞组件的 aabb 碰撞框
        var otherPreAabb = other.world.preAabb.clone();
        var selfAabb = self.world.aabb;
        var selfPreAabb = self.world.preAabb.clone();
        selfPreAabb.x = selfAabb.x;
        otherPreAabb.x = otherAabb.x;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {

            if (this._speed.x < 0 && (selfPreAabb.xMax > otherPreAabb.xMax)) {
                this.node.x += Math.floor(Math.abs(otherAabb.xMax - selfAabb.xMin));
                this.collisionX = -1;
            }
            else if (this._speed.x > 0 && (selfPreAabb.xMin < otherPreAabb.xMin)) {
                this.node.x -= Math.floor(Math.abs(otherAabb.xMin - selfAabb.xMax));
                this.collisionX = 1;
            } else if (this._speed.x == 0 && (selfPreAabb.xMax == otherPreAabb.xMin)) {
                this.isFallDown = true;
            }

            this._speed.x = 0;
            other.touchingX = true;
            return;
        }
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            if (this._speed.y < 0 && (selfPreAabb.yMax > otherPreAabb.yMax)) {
                this.node.y = otherPreAabb.yMax - this.node.parent.y;
                this.isJumping = false;//下落碰到地面或砖块木桩等
                this.collisionY = -1;
            }
            else if (this._speed.y > 0 && (selfPreAabb.yMin < otherPreAabb.yMin)) {
                cc.audioEngine.play(this.hit_block_Audio, false, 1);
                this.node.y = otherPreAabb.yMin - selfPreAabb.height - this.node.parent.y;
                this.collisionY = 1;
            }

            this._speed.y = 0;
            other.touchingY = true;
        }
        this.isWallCollisionCount++;

    }

    onCollisionStay(other, self) {
        this.jumpCount = 0;
        if (this.collisionY === -1) {
            if (other.node.group === 'Platform') {
                var motion = other.node.getComponent('PlatformMotion');
                if (motion) {
                    this.node.x += motion._movedDiff;
                }
            }
        }
    }

    onCollisionExit(other) {
        this.isFallDown = false;
        if (other.node.group == 'platform') {
            console.log("this.touchingNumber: " + this.touchingNumber);
            this.touchingNumber--;
        }
        this.jumpCount = 1;
        if (this.jumpCount !== 0 && this.touchingNumber === 0) // 非着陆状态
        {
            this.anim.play("player_jump");
        }
        if (this.touchingNumber === 0) {
            // this.node.color = cc.Color.WHITE;
            this.isJumping = true;// 在空中设为跳跃状态
        }

        if (other.touchingX) {
            this.collisionX = 0;
            other.touchingX = false;
        }
        else if (other.touchingY) {
            this.collisionY = 0;
            other.touchingY = false;
        }
        this.isWallCollisionCount--;
    }

    update(dt) {
        if (this.touchingNumber === 0 || this.isFallDown || this.touchingNumber === -1) {
            this._speed.y += CWorld.G * dt;
            if (Math.abs(this._speed.y) > this.maxSpeedV2.y) {
                this._speed.y = this._speed.y > 0 ? this.maxSpeedV2.y : -this.maxSpeedV2.y;
            }
        }
        if (this.node.y > 600) {
            this.touchingNumber = 0
        }
        if (this._direction === 0) {
            if (this._speed.x > 0) {
                this._speed.x -= CWorld.WalkA * dt;
                if (this._speed.x <= 0) this._speed.x = 0;
            }
            else if (this._speed.x < 0) {
                this._speed.x += CWorld.WalkA * dt;
                if (this._speed.x >= 0) this._speed.x = 0;
            }
        }
        else {
            this._speed.x += (this._direction > 0 ? 1 : -1) * CWorld.WalkA * dt;
            if (Math.abs(this._speed.x) > this.maxSpeedV2.x) {
                this._speed.x = this._speed.x > 0 ? this.maxSpeedV2.x : -this.maxSpeedV2.x;
            }
        }

        if (this._speed.x * this.collisionX > 0) {
            this._speed.x = 0;
        }

        this.node.x += this._speed.x * dt * CWorld.AddSpeed;
        this.node.y += this._speed.y * dt;
    }

    turnLeft() {
        this.node.scaleX = -Math.abs(this.node.scaleX);
    }

    turnRight() {
        this.node.scaleX = Math.abs(this.node.scaleX);
    }
}
