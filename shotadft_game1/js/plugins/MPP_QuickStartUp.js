//=============================================================================
// MPP_QuickStartUp.js
//=============================================================================
// Copyright (c) 2018 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【ver.1.0】ゲーム起動時に読み込む画像を後で読み込んだり、
 * 不要な画像を読み込まないことで、ゲームの起動を速くします。
 * @author 木星ペンギン
 *
 * @help ▼詳細
 * --------------------------------
 *  〇ゲーム起動時の画像読み込み
 *   通常、ゲーム起動時にSystemフォルダの画像が読み込まれますが、
 *   これをニューゲーム選択時、あるいはロード画面でファイル選択時に
 *   読み込むことで、ゲームの起動を速くします。
 *
 *  〇サイドビュー戦闘ではない場合
 *   [サイドビュー戦闘を使用]していない場合、Systemフォルダの
 *   States,Weapons1～3 が読み込まれなくなります。
 *
 *  〇使用しない画像について
 *   サイドビュー戦闘ではなかったり、プラグインパラメータの設定により
 *   特定の画像を読み込まないようにした場合、それらはSystemフォルダ内から
 *   削除してかまいません。
 *   (何らかのプラグインで使用する場合は除く)
 *
 * ================================================================
 * ▼プラグインパラメータ詳細
 * --------------------------------
 *  〇Load Weapons3?(Weapons3画像を読み込むかどうか)
 *   攻撃モーション用の武器画像Weapons3を読み込むかどうかです。
 *   画像のユーザー定義を使用する場合はtrueにしてください。
 *   サイドビュー戦闘でない場合は関係ありません。
 * 
 *  〇Load Images(読み込む画像ファイル名の配列)
 *   読み込む画像を細かくカスタマイズするための項目です。
 *   通常は変更する必要はありません。
 * 
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 *
 * @param Load Weapons3?
 * @type boolean
 * @desc Weapons3画像を読み込むかどうか
 * @default false
 * 
 * @param Load Images
 * @type string[]
 * @desc 読み込む画像ファイル名の配列
 * @default ["IconSet","Balloon","Shadow1","Shadow2","Damage","States","Weapons1","Weapons2","Weapons3","ButtonSet"]
 * 
 * 
 */

(function() {

var MPPlugin = {};

(function() {
    
    var parameters = PluginManager.parameters('MPP_QuickStartUp');
    
    MPPlugin.LoadWeapons3 = !!eval(parameters['Load Weapons3?']);
    MPPlugin.LoadImages = JSON.parse(parameters['Load Images']);
    
})();

var Alias = {};

//-----------------------------------------------------------------------------
// Scene_Title

//29
Scene_Boot.loadSystemImages = function() {
    //ImageManager.requestSystem('IconSet');
};
Scene_Boot.loadSystemImages2 = function() {
    var images = MPPlugin.LoadImages;
    var exclusions = [];
    if (!$gameSystem.isSideView()) {
        exclusions.push("States", "Weapons1", "Weapons2", "Weapons3");
    } else if (!MPPlugin.LoadWeapons3) {
        exclusions.push("Weapons3");
    }
    for (var i = 0; i < images.length; i++) {
        if (!exclusions.contains(images[i])) {
            ImageManager.reserveSystem(images[i]);
        }
    }
};

//61
Alias.ScBo_start = Scene_Boot.prototype.start;
Scene_Boot.prototype.start = function() {
    Alias.ScBo_start.call(this);
    if (DataManager.isBattleTest() || DataManager.isEventTest()) {
        Scene_Boot.loadSystemImages2();
    }
};

//-----------------------------------------------------------------------------
// Scene_Title

//91
Alias.ScTi_commandNewGame = Scene_Title.prototype.commandNewGame;
Scene_Title.prototype.commandNewGame = function() {
    Alias.ScTi_commandNewGame.call(this);
    Scene_Boot.loadSystemImages2();
};

//-----------------------------------------------------------------------------
// Scene_Load

//46
Alias.ScLo_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
Scene_Load.prototype.onLoadSuccess = function() {
    Alias.ScLo_onLoadSuccess.call(this);
    Scene_Boot.loadSystemImages2();
};



})();
