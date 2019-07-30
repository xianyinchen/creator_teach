// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import CPlayer from "./player"
import CWorld from "./world"

const { ccclass, property } = cc._decorator;

@ccclass
export default class CBehavior extends cc.Component {

    @property(CPlayer)
    player: CPlayer = null;

    @property(cc.PolygonCollider)
    public colliders: cc.PolygonCollider = null;

    collisionX: number = 0;
    collisionY: number = 0;
    jumpCount: number = 0;
    touchingNumber: number = 0;
    isWallCollisionCount: number = 0;
    jumping: boolean = false;
    fallDown: boolean = true;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    onCollisionEnter(other, self) {
        if (this.touchingNumber == 0) {
            if (CWorld.isPress) {
                this.player.play("walk");
            }
            else {
                this.player.play("idle");
            }
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
        var colliders = this.getComponents(cc.PolygonCollider);
        colliders[0].enabled = true;
        colliders[1].enabled = false;
        var actionBy = cc.scaleBy(1, 5 / 3);
        this.node.runAction(actionBy);

        if (this.player.life() <= 1) {
            this.player.life(1);
        }
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
            if (this.player.life() == 2) {
                //cc.audioEngine.play(this.player_decrease_Audio, false, Global.volume);
                var actionBy = cc.scaleBy(1, 3 / 5);
                this.node.runAction(actionBy);
                this.player.life(-1);
            } else if (this.player.life() == 1) {
                this.player.die();
                return;
            }


            if (this.player.speed().x < 0 && (selfPreAabb.xMax > otherPreAabb.xMax)) {

                // this.node.x = otherPreAabb.xMax - this.node.parent.x;
                this.node.x += Math.floor(Math.abs(otherAabb.xMax - selfAabb.xMin));
                this.collisionX = -1;
                // this.node.y= this.node.y;

            }
            else if (this.player.speed().x > 0 && (selfPreAabb.xMin < otherPreAabb.xMin)) {
                // this.node.y= this.node.y;
                // this.anim.play("player_die");
                // this.node.x = otherPreAabb.xMin - selfPreAabb.width - this.node.parent.x;
                this.node.x -= Math.floor(Math.abs(otherAabb.xMin - selfAabb.xMax));
                // console.log("this.node.x:     " + Math.abs(otherAabb.xMin - selfAabb.xMax));
                this.collisionX = 1;
                // console.log("this.anim.play player_die");

            }

            this.player.speed().x = 0;
            other.touchingX = true;
            return;
        }

        // 3rd step
        // forward y-axis, check whether collision on y-axis
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            if (this.player.speed().y < 0 && (selfPreAabb.yMax > otherPreAabb.yMax)) {
                this.player.stamp(); //玩家踩到敌人的跳跃
                return;
            }
            if (this.player.speed().y > 0 && (selfPreAabb.yMax < otherPreAabb.yMax)) {
                // this.node.removeFromParent();
                if (this.player.life() == 2) {
                    var actionBy = cc.scaleBy(1, 3 / 5);
                    this.node.runAction(actionBy);
                    this.player.life(-1);
                } else if (this.player.life() == 1) {
                    this.player.die();
                    return;
                }
            }
            this.player.speed().y = 0;
            other.touchingY = true;
        }
        this.isWallCollisionCount++;
    }

    collisionCoinEnter(other, self) {
        other.node.removeFromParent();
        this.player.coin(1);
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
        //cc.audioEngine.play(this.dieAudio, false, Global.volume);
        this.player.die();
        this.node.parent.getComponent('Cameras').isRun = false;
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
            if (this.player.speed().x < 0 && (selfPreAabb.xMax > otherPreAabb.xMax)) {
                if (Math.abs(selfPreAabb.yMin - otherPreAabb.yMax) < 0.3) {
                    this.collisionX = 0;
                }
                else
                    this.collisionX = -1;
            }
            else if (this.player.speed().x > 0 && (selfPreAabb.xMin < otherPreAabb.xMin)) {
                if (Math.abs(selfPreAabb.yMin - otherPreAabb.yMax) < 0.3) {
                    this.collisionX = 0;
                }
                else
                    this.collisionX = 1;
            }

            this.player.speed().x = 0;
            other.touchingX = true;

            return;
        }
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            if (CWorld.GiveCoin > 0) {
                this.player.coin(CWorld.GiveCoin);
                CWorld.GiveCoin = 0;;
            }
            if (this.player.speed().y < 0 && (selfPreAabb.yMax > otherPreAabb.yMax)) {
                this.node.y = otherPreAabb.yMax - this.node.parent.y;
                this.jumping = false;// 碰到砖块不用跳
                this.collisionY = -1;
            }
            else if (this.player.speed().y > 0 && (selfPreAabb.yMin < otherPreAabb.yMin)) {
                this.node.y = otherPreAabb.yMin - selfPreAabb.height - this.node.parent.y;
                this.collisionY = 1;
            }
            else if ((selfPreAabb.xMax == otherPreAabb.xMin)) {
                this.fallDown = true;
            }

            this.player.speed().y = 0;
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

            if (this.player.speed().x < 0 && (selfPreAabb.xMax > otherPreAabb.xMax)) {
                this.node.x += Math.floor(Math.abs(otherAabb.xMax - selfAabb.xMin));
                this.collisionX = -1;
            }
            else if (this.player.speed().x > 0 && (selfPreAabb.xMin < otherPreAabb.xMin)) {
                this.node.x -= Math.floor(Math.abs(otherAabb.xMin - selfAabb.xMax));
                this.collisionX = 1;
            } else if (this.player.speed().x == 0 && (selfPreAabb.xMax == otherPreAabb.xMin)) {
                this.fallDown = true;
            }

            this.player.speed().x = 0;
            other.touchingX = true;
            return;
        }
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            if (this.player.speed().y < 0 && (selfPreAabb.yMax > otherPreAabb.yMax)) {
                this.node.y = otherPreAabb.yMax - this.node.parent.y;
                this.jumping = false;//下落碰到地面或砖块木桩等
                this.collisionY = -1;
            }
            else if (this.player.speed().y > 0 && (selfPreAabb.yMin < otherPreAabb.yMin)) {
                //cc.audioEngine.play(this.hit_block_Audio, false, Global.volume);
                this.node.y = otherPreAabb.yMin - selfPreAabb.height - this.node.parent.y;
                this.collisionY = 1;
            }

            this.player.speed().y = 0;
            other.touchingY = true;
        }
        this.isWallCollisionCount++;

    }

    onCollisionStay(other, self) {
        if (this.player.life() <= 0) {
            if (other.tag !== 6) {
                this.player.die();
            } else {
                //cc.audioEngine.play(this.dieAudio, false, Global.volume);
            }
        }

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
        this.fallDown = false;
        if (other.node.group == 'platform') {
            console.log("this.touchingNumber: " + this.touchingNumber);
            this.touchingNumber--;
        }
        this.jumpCount = 1;
        if (this.jumpCount !== 0 && this.touchingNumber === 0) // 非着陆状态
        {
            this.player.play("jump");
        }
        if (this.touchingNumber === 0) {
            // this.node.color = cc.Color.WHITE;
            this.jumping = true;// 在空中设为跳跃状态
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
        if (this.touchingNumber === 0 || this.fallDown || this.touchingNumber === -1) {
            this.player.speed().y += CWorld.G * dt;
            if (Math.abs(this.player.speed().y) > this.player.maxSpeed().y) {
                this.player.speed().y = this.player.speed().y > 0 ? this.player.maxSpeed().y : -this.player.maxSpeed().y;
            }
        }
        if (this.node.y > 600) {
            this.touchingNumber = 0
        }
        if (this.player.direction() === 0) {
            if (this.player.speed().x > 0) {
                this.player.speed().x -= CWorld.FallG * dt;
                if (this.player.speed().x <= 0) this.player.speed().x = 0;
            }
            else if (this.player.speed().x < 0) {
                this.player.speed().x += CWorld.FallG * dt;
                if (this.player.speed().x >= 0) this.player.speed().x = 0;
            }
        }
        else {
            this.player.speed().x += (this.player.direction() > 0 ? 1 : -1) * CWorld.FallG * dt;
            if (Math.abs(this.player.speed().x) > this.player.maxSpeed().x) {
                this.player.speed().x = this.player.speed().x > 0 ? this.player.maxSpeed().x : -this.player.maxSpeed().x;
            }
        }

        if (this.player.speed().x * this.collisionX > 0) {
            this.player.speed().x = 0;
        }

        this.node.x += this.player.speed().x * dt;
        this.node.y += this.player.speed().y * dt;
    }
}
