var Utils = require('Utils');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        cardsSpriteAtlas: cc.SpriteAtlas,
        spawnCardsBegin: cc.Node,
        dealCardMp3: cc.AudioSource,
        title: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.vitriChiaBai = cc.v2(25, 30);//vi tri bat dau
        this.offsetChiaBai = cc.v2(41, 8);//off set x, 66.38
        this.gocChiaBai = -45;//45 do
    },
    finishOnceRep: function () {
        var cardBlock = this.spawnCardsBegin.parent;
        if (cardBlock) {            
            cardBlock.active = true;
            cardBlock.stopAllActions();
            cardBlock.scale = 1;
            cardBlock.runAction(
                cc.scaleTo(0.05, 1.05).easing(cc.easeBackIn(0.5))
            )
        }
    },
    createQuanBaiDeChia: function (data, cb) {
        this.spawnCardsBegin.destroyAllChildren();
        this.spawnCardsBegin.removeAllChildren(true);
        var offsetPosition = this.vitriChiaBai;
        //tao 2 quan chia bai
        var myCardChiaBai;
        var otherCardChiaBai;
        var defaultPositionMyChiaBai = cc.v2(0, 0);
        var defaultPositionOtherChiaBai = cc.v2(0, 0);

        for (let i = 0; i < 2; i++) {
            var card = new cc.Node();
            card.angle = this.gocChiaBai;
            var cardSprite = card.addComponent(cc.Sprite);
            cardSprite.spriteFrame = this.cardsSpriteAtlas.getSpriteFrame("card_face_down");
            card.position = offsetPosition;
            offsetPosition.addSelf(cc.v2(this.offsetChiaBai.x, this.offsetChiaBai.y));
            this.spawnCardsBegin.addChild(card);
            card.opacity = 0;
            if (i == 0) {
                card.name = "mycard";
                defaultPositionMyChiaBai = card.position;
                myCardChiaBai = card;
            } else if (i == 1) {
                card.name = "yourcard";
                defaultPositionOtherChiaBai = card.position;
                otherCardChiaBai = card;
            }
        };
        //
        if (data && data.cards && myCardChiaBai && otherCardChiaBai) {
            //tien hanh chia bai
            var cards = data.cards;
            var otherCards = cards.otherCards;
            var myCards = cards.myCards;
            if (otherCards && myCards) {
                var seqAnimationLeft = [];
                var seqAnimationRight = [];
                var _this = this;
                var delayActionMove = 0.35;
                //create left animation
                for (let i = 0; i < myCards.length; i++) {
                    var pos = myCards[i].parent.convertToWorldSpaceAR(myCards[i].position);
                    var posLocal = myCardChiaBai.parent.convertToNodeSpaceAR(pos);
                    var actionResetPosition = cc.callFunc(function (cardChiaBai) {
                        NewAudioManager.playEffectADS(_this.dealCardMp3, 1, false);
                        cardChiaBai.position = defaultPositionMyChiaBai;
                        cardChiaBai.opacity = 0;
                        cardChiaBai.angle = _this.gocChiaBai;
                        cardChiaBai.scale = 1;
                    }, myCardChiaBai);
                    var actionShowCardNumber = cc.callFunc(function () {
                        myCards[i].active = true;
                        myCards[i].runAction(cc.fadeIn(0.05));
                    });
                    var finishOddAction = cc.callFunc(function () {
                        _this.finishOnceRep();
                    });
                    var actionMove = cc.spawn(cc.moveTo(delayActionMove, posLocal), cc.fadeIn(delayActionMove), cc.rotateTo(0, 0), cc.scaleTo(delayActionMove, 0.33));
                    seqAnimationLeft.push(actionResetPosition, actionMove, actionShowCardNumber, actionResetPosition, finishOddAction);
                }
                
                //create right
                //reverse hang ma trang
                delayActionMove = delayActionMove / otherCards.length;
                otherCards = Utils.Malicious.transpose(otherCards);

                for (let i = 0; i < otherCards.length; i++) {
                    for (let j = 0; j < otherCards[i].length; j++) {
                        var pos = otherCards[i][j].parent.convertToWorldSpaceAR(otherCards[i][j].position);
                        var posLocal = myCardChiaBai.parent.convertToNodeSpaceAR(pos);
                        var actionResetPosition = cc.callFunc(function (cardChiaBai) {
                            NewAudioManager.playEffectADS(_this.dealCardMp3, 1, false);
                            cardChiaBai.position = defaultPositionOtherChiaBai;
                            cardChiaBai.opacity = 0;
                            cardChiaBai.angle = _this.gocChiaBai;
                            cardChiaBai.scale = 1;
                        }, otherCardChiaBai);
                        var actionShowCardNumber = cc.callFunc(function () {
                            otherCards[i][j].active = true;
                            otherCards[i][j].runAction(cc.fadeIn(0.05));
                        });
                        var finishOddAction = cc.callFunc(function () {
                            _this.finishOnceRep();
                        });
                        var actionMove = cc.spawn(cc.moveTo(delayActionMove, posLocal), cc.fadeIn(delayActionMove), cc.rotateTo(0, 0), cc.scaleTo(delayActionMove, 0.33));
                        seqAnimationRight.push(actionResetPosition, actionMove, actionShowCardNumber, actionResetPosition, finishOddAction);
                    }
                }
                var finishCbFunction = cc.callFunc(function () {
                    var _actionLeft = myCardChiaBai.getActionByTag(77942);
                    var _actionRight = otherCardChiaBai.getActionByTag(77943);
                    if (_actionLeft && _actionRight) {
                        if (_actionLeft.isDone() && _actionRight.isDone()) {
                            if (cb) {
                                cb(null, true);
                            }
                        }
                    } else if (_actionLeft) {
                        if (_actionLeft.isDone()) {
                            if (cb) {
                                cb(null, true);
                            }
                        }
                    } else if (_actionRight) {
                        if (_actionRight.isDone()) {
                            if (cb) {
                                cb(null, true);
                            }
                        }
                    }
                    
                });
                seqAnimationLeft.push(finishCbFunction);
                seqAnimationRight.push(finishCbFunction);
                var sequenceCCL = cc.sequence(seqAnimationLeft);
                var sequenceCCR = cc.sequence(seqAnimationRight);
                sequenceCCL.tag = 77942;
                sequenceCCR.tag = 77943;
                this.title.active = true;
                myCardChiaBai.runAction(
                    sequenceCCL
                )
                if(!data.isChiaLaiBai){
                    otherCardChiaBai.runAction(
                        sequenceCCR
                    )
                }
                

            }
        }
    }

    // update (dt) {},
});
