var Global = require('Global');
var Linker = require('Linker');
var DataManger = require('DataManger');
var AudioManager = {

    _isMute: false,
    _isMuteBG: false,
    audioIDBG: null,
    audiocClick: null,
    audioBiVaCham: null,
    audioBiRoiXuongLo: null,
    sound: {
        background: "background",
        click: "button-click",
        ball_touch_ball: "ball_touch_ball",
        BallHit: "BallHit",
        bi_lan_tren_tham: "bi_lan_tren_tham",
        CueHit: "CueHit",
        Fine_Tuning: "Fine_Tuning",
        gay_danh_vao_bi: "gay_danh_vao_bi",
        lose_2: "lose_2",
        money_fly: "money_fly",
        nhat: "nhat",
        Pocket: "Pocket",
        win: "win",
    },

    SOUND: {
        VI: {
            ENTER_HOME: [
                `bida/sound/sound_vi/v1`,
                `bida/sound/sound_vi/v3`
            ],
            ENTER_LOBBY: `bida/sound/sound_vi/v5`,
            START_GAME: `bida/sound/sound_vi/v6`,
            FIRST_TURN: `bida/sound/sound_vi/v10`,
            WIN: `bida/sound/sound_vi/v12`,
            LOSE: `bida/sound/sound_vi/v15`,
            SCRORED: `bida/sound/sound_vi/v17`,
            NOT_SCORED: `bida/sound/sound_vi/v20`,
            MY_TURN: `bida/sound/sound_vi/v24`,
            GUILTY: `bida/sound/sound_vi/v28`,
            TIME_OUT: `bida/sound/sound_vi/v30`,
            SLIDE_POWER: "bida/sound/sound_vi/v31",
            COFFER: `bida/sound/sound_vi/v38`,
            OPEN_BUY_CUE: `bida/sound/sound_vi/v39`,
            STRIPE_BALL: `bida/sound/sound_vi/v42`,
            SOLID_BALL: `bida/sound/sound_vi/v43`,
            TOPUP: `bida/sound/sound_vi/v44`,
            GET_REWARD: "bida/sound/sound_vi/v59",
        },
        EN: {
            ENTER_HOME: [
                `bida/sound/sound_en/v1`,
                `bida/sound/sound_en/v3`
            ],
            ENTER_LOBBY: `bida/sound/sound_en/v5`,
            START_GAME: `bida/sound/sound_en/v6`,
            FIRST_TURN: `bida/sound/sound_en/v10`,
            WIN: `bida/sound/sound_en/v12`,
            LOSE: `bida/sound/sound_en/v15`,
            SCRORED: `bida/sound/sound_en/v17`,
            NOT_SCORED: `bida/sound/sound_en/v20`,
            MY_TURN: `bida/sound/sound_en/v24`,
            GUILTY: `bida/sound/sound_en/v28`,
            TIME_OUT: `bida/sound/sound_en/v30`,
            SLIDE_POWER: "bida/sound/sound_en/v31",
            COFFER: `bida/sound/sound_en/v38`,
            OPEN_BUY_CUE: `bida/sound/sound_en/v39`,
            STRIPE_BALL: `bida/sound/sound_en/v42`,
            SOLID_BALL: `bida/sound/sound_en/v43`,
            TOPUP: `bida/sound/sound_en/v44`,
            GET_REWARD: "bida/sound/sound_vi/v59",
        }
    },

    SOUND_POINT_TO_BALL: [
        [
            "bida/sound/sound_vi/b_01",
            "bida/sound/sound_vi/b_02",
            "bida/sound/sound_vi/b_03",
            "bida/sound/sound_vi/b_04",
            "bida/sound/sound_vi/b_05",
            "bida/sound/sound_vi/b_06",
            "bida/sound/sound_vi/b_07",
            "bida/sound/sound_vi/b_08",
            "bida/sound/sound_vi/b_09",
            "bida/sound/sound_vi/b_10",
            "bida/sound/sound_vi/b_11",
            "bida/sound/sound_vi/b_12",
            "bida/sound/sound_vi/b_13",
            "bida/sound/sound_vi/b_14",
            "bida/sound/sound_vi/b_15",
        ],
        [
            "bida/sound/sound_en/b_01",
            "bida/sound/sound_en/b_02",
            "bida/sound/sound_en/b_03",
            "bida/sound/sound_en/b_04",
            "bida/sound/sound_en/b_05",
            "bida/sound/sound_en/b_06",
            "bida/sound/sound_en/b_07",
            "bida/sound/sound_en/b_08",
            "bida/sound/sound_en/b_09",
            "bida/sound/sound_en/b_10",
            "bida/sound/sound_en/b_11",
            "bida/sound/sound_en/b_12",
            "bida/sound/sound_en/b_13",
            "bida/sound/sound_en/b_14",
            "bida/sound/sound_en/b_15",
        ]
    ],

    stopAllSoundEffect: function () {
        cc.audioEngine.stopAll();
    },

    stopSoundBackground: function () {
        this.audioIDBG = null;
        this.audiocClick = null;
        cc.audioEngine.stopAll();
    },

    muteSound: function (isMuted) {
        this._isMute = isMuted;
    },

    muteMusic: function (isMuted) {
        this._isMuteBG = isMuted;

        if (isMuted) {
            this.stopSoundBackground();
        }
    },

    playCountDown: function (filePath) {
        if (!filePath) {
            return;
        }
        this.checkLocalStorageSound();
        if (this._isMute) return;
        this.stopSoundBackground();

        var url = cc.url.raw(filePath);
        cc.audioEngine.play(url, true, 0.8);
    },

    playEffect: function (filePath, isLoop) {
        if (!filePath) {
            return;
        }
        this.checkLocalStorageSound();
        if (this._isMute) return;

        if (isLoop == undefined) {
            isLoop = false;
        }

        var url = cc.url.raw(filePath);
        return cc.audioEngine.play(url, isLoop, 0.8);
    },

    playBackground: function () {
        var isMusic = DataManger.UserData.getMusic();
        if (isMusic) {
            var audioClip = this.getAudioSound(this.sound.background);
            if (audioClip) {
                cc.audioEngine.play(audioClip, true, 0.7);
            }
        } else {
            cc.audioEngine.stopAll();
        }
    },

    playClick: function () {
        var isSound = DataManger.UserData.getSound();
        if (isSound) {
            var audioClip = this.getAudioSound(this.sound.click);
            if (audioClip) {
                cc.audioEngine.play(audioClip, false, 1);
            }
        } 
    },

    playSound: function (name) {
        var isSound = DataManger.UserData.getSound();
        if (isSound) {
            var audioClip = this.getAudioSound(name);
            if (audioClip) {
                cc.audioEngine.play(audioClip, false, 1);
            }
        } 
    },

    LoadSoundGame(cb) {
        var that = this;
        var path = `sounds`;
        cc.resources.loadDir(path, cc.AudioClip, (error, resourcesArr) => {
            if (!error) {
                that.listSoundGame = resourcesArr;
                cb(false);
            } else {
                // cc.Global.showMessage(error);
                cb(true);
                cc.log("Lỗi không thể load được resource âm thanh...", error);
            }
        })
    },

    getAudioSound(name) {
        if (this.listSoundGame && name) {
            for (var i = 0; i < this.listSoundGame.length; i++) {
                if (this.listSoundGame[i].name == name) {
                    return this.listSoundGame[i];
                }
            }
        }
        return null;
    },
    
    playAudioSource: function (name, volume, loop) {
        this.checkLocalStorageSound();
        if (!this._isMute) {
            if (Global.XocDiaMini.soundData.hasOwnProperty(name)) {
                if (!volume) {
                    volume = 1.0;
                }
                if (!loop) {
                    loop = false;
                }
                Global.XocDiaMini.soundData[name].volume = volume;
                Global.XocDiaMini.soundData[name].loop = loop;
                Global.XocDiaMini.soundData[name].play();
            }
        }
    },
    stopAudioSource: function (name) {
        if (Global.XocDiaMini.soundData.hasOwnProperty(name)) {
            Global.XocDiaMini.soundData[name].stop();
        }
    },
    playEffectADS: function (audioSource, volume, loop) {
        if (audioSource) {
            this.checkLocalStorageSound();
            if (this._isMute || audioSource.isPlaying || !audioSource) {
                return
            }
            if (!volume) {
                volume = 1;
            }
            if (!loop) {
                loop = false;
            }
            audioSource.loop = loop;
            audioSource.volume = volume;
            audioSource.play();
        }

    },
    playEffectBallHit: function (idBi, audioSource, volume, loop) {
        if (audioSource) {
            var isSound = DataManger.UserData.getSound();
            if (!isSound || audioSource.isPlaying || !audioSource) {
                return;
            }
            if (!volume) {
                volume = 1;
            }
            if (!loop) {
                loop = false;
            }
            audioSource.loop = loop;
            audioSource.volume = volume;
            audioSource.play();
        }

    },
    LoadSound(languageCode) {
        var that = this;
        if (this.listSound) {
            this.listSound = [];
        }
        var index = 0;
        if (languageCode == "en") index = 1;
        var listSoundToLoad = this.SOUND_POINT_TO_BALL[index];

        cc.resources.load(listSoundToLoad, cc.AudioClip, (error, resourcesArr) => {
            if (!error) {
                that.listSound = resourcesArr;
                that.soundPointToBall = that.listSound;
                that.listSound = [];
            } else {
                // cc.Global.showMessage(error);
                cc.log("Lỗi không thể load được resource âm thanh...", error);
            }
        })
    },

    PlaySoundPointToBall(idBi) {
        if (isNaN(parseInt(idBi)) == false) {
            var _sound = this.getSoundByName(idBi);
            if (_sound) {
                this.Play(this.soundPointToBall[idBi - 1]);
            }
        }
    },
    getSoundByName: function (idBi) {
        if (idBi && this.soundPointToBall.length > 0) {
            for (let i = 0; i < this.soundPointToBall.length; i++) {
                var nameSound = this.soundPointToBall[i].name;
                var idBiName = "b_" + ((idBi > 0 && idBi < 10) ? "0" + idBi : idBi);
                if (idBiName == nameSound) {
                    return this.soundPointToBall[i];
                }
            }
        }
        return null;
    },
    LoadOtherSound(languageCode) {

    },

    Play(clip) {
        this.checkLocalStorageSound();
        if (this._isMute) {
            return;
        }
        if (this.lastAudio) {
            cc.audioEngine.stop(this.lastAudio);
        }
        this.lastAudio = cc.audioEngine.play(clip, false, 0.5);
    },
    checkLocalStorageSound: function () {
        //setting mute
        var _userData = Linker.Local.readUserData();
        if (_userData) {
            var _isSound = _userData.isSound;
            var _isMusic = _userData.isMusic;
            if (_isMusic && _isSound) {
                this._isMute = false;
            } else {
                this._isMute = true;
            }
        } else {
            this._isMute = false;
        }
    },
    PlayUrl(url) {
        this.checkLocalStorageSound();
        if (this._isMute) {
            return;
        }
        var that = this;
        if (this.lastPlayUrl) {
            cc.audioEngine.stop(this.lastPlayUrl);
        }
        if (url) {
            //phát sinh một số trường hợp chứa .mp3
            url = url.replace(/\.[^/.]+$/, "");
        }
        cc.resources.load(url, cc.AudioClip, (error, audio) => {
            if (!error) {
                that.lastPlayUrl = cc.audioEngine.play(audio, false, 0.5);
            } else {
                // cc.Global.showMessage(error);
                cc.log("Lỗi không thể play được file âm thanh...", error);
            }
        })
    }
};


module.exports = AudioManager;