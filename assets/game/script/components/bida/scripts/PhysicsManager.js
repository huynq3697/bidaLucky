var Linker = require('Linker');
var BiDaConstant = require('BiDaConstant');
cc.Class({
    extends: cc.Component,

    properties: {
        active: {
            default: true,
            tooltip: '是否启用物理引擎',
        },
        aabb: {
            default: true,
            tooltip: '是否显示包围盒',
        },
        pair: {
            default: true,
        },
        centerOfMass: {
            default: true,
            tooltip: '是否显示中心点'
        },
        joint: {
            default: false,
            tooltip: '是否显示关节连接线'
        },
        shape: {
            default: true,
            tooltip: '是否填充形状'
        },
        mouseJoint: {
            default: false,
            tooltip: '是否开启鼠标关节，可以拖动动态刚体'
        },
        gravity: {
            default: cc.v2(0, 0),
            tooltip: '重力'
        }
    },
    onLoad: function () {
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.YEU_CAU_KHOI_TAO_WORLD_VAT_LY, this.activePhysicWorld, this);
    },
    activePhysicWorld: function (event) {
        if (event && event.hasOwnProperty("isActive")) {
            if (event.isActive) {
                cc.log("Kich hoat vat ly...");
                this.onEnable();
            } else {
                cc.log("Ngung kich hoat vat ly...");
                this.onDisable();
            }
        }
    },
    onEnable() {
        //开启或关闭物理系统
        var physicsManager2D = cc.director._physicsManager;
        if (physicsManager2D) {
            physicsManager2D.enabled = true;
            //    if (!this.world2D) {
            //    this.world2D = cc.director._physicsManager._world;
            //    }
            //    cc.director._physicsManager._world = this.world2D;
        }
        var physicsManager3D = cc.director._physics3DManager;
        if (physicsManager3D) {
            physicsManager3D.enabled = true;
            //    if (!this.world3D) {
            //        this.world3D = cc.director._physics3DManager.physicsWorld._world;
            //    }
            //    cc.director._physics3DManager.physicsWorld._world  = this.world3D;
        }
        if (physicsManager2D.enabled && this.active) {
            // cc.log('The physical 2D system is enabled！');
        }
        physicsManager2D.enabled = this.active;
        // cc.log('The physical 3D system is enabled！');
        if (!this.active) {
            return;
        }
        //设置物理系统的重力属性
        physicsManager2D.gravity = cc.v2(0, 0);
        physicsManager2D.joint = false;
        physicsManager2D.mouseJoint = false;

        physicsManager2D.enabledAccumulator = true;
        physicsManager2D.FIXED_TIME_STEP = 1 / 30;
        physicsManager2D.VELOCITY_ITERATIONS = 8;
        physicsManager2D.POSITION_ITERATIONS = 8;
        physicsManager2D.PTM_RATIO = 32;
        //设置调试标志
        let drawBits = cc.PhysicsManager.DrawBits;
        //on off show debugger
        CC_PREVIEW = false;
        if (CC_PREVIEW) {
            physicsManager2D.debugDrawFlags =
                (this.aabb && drawBits.e_aabbBit) |
                (this.pair && drawBits.e_pairBit) |
                (this.centerOfMass && drawBits.e_centerOfMassBit) |
                (this.joint && drawBits.e_jointBit) |
                (this.shape && drawBits.e_shapeBit);
        } else {
            physicsManager2D.debugDrawFlags = 0;
        }
    },

    onDisable() {
        var physicsManager2D = cc.director._physicsManager;
        if (physicsManager2D) {
            physicsManager2D.enabled = false;
            // this.world2D = physicsManager2D._world;
            // physicsManager2D._world = null;
        }
        var physicsManager3D = cc.director._physics3DManager;
        if (physicsManager3D) {
            physicsManager3D.enabled = false;
            // this.world3D = physicsManager3D.physicsWorld._world;
            // physicsManager3D.physicsWorld._world = null;
        }
    }
});
