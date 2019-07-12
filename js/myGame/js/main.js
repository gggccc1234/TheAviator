import Game from "./game.js";
import {Config, Colors} from "./config.js";
import GlobalController from "./globalController.js";
import UtilFunc from "./util.js";

window.Global = GlobalController.getInstance();
window.Config = Config;
window.Colors = Colors;
window.Util = UtilFunc;

var game = new Game();

window.addEventListener('load', function () {
    Global.width = window.innerWidth;
    Global.height = window.innerHeight;
    Global.mousePos = {
        x: 0,
        y: 0
    };
    Global.container = document.getElementById('world');
    Global.fieldDistance = document.getElementById("distValue");
    Global.energyBar = document.getElementById("energyBar");
    Global.replayMessage = document.getElementById("replayMessage");
    Global.fieldLevel = document.getElementById("levelValue");
    Global.levelCircle = document.getElementById("levelCircleStroke");
    document.addEventListener('mousemove', function (event) {
        let mousePosX = -1 + (event.clientX / Global.width) * 2;
        let mousePosY = 1 - (event.clientY / Global.height) * 2;
        Global.mousePos = {
            x: mousePosX,
            y: mousePosY
        };
    }, false);
    document.addEventListener('touchmove', function (event) {
        event.preventDefault();
        let mousePosX = -1 + (event.touches[0].pageX / Global.width) * 2;
        let mousePosY = 1 - (event.touches[0].pageY / Global.height) * 2;
        Global.mousePos = {
            x: mousePosX,
            y: mousePosY
        };
    }, false);
    document.addEventListener('mouseup', function (event) {
        if (Global.config.status == "waitingReplay") {
            game.resetGame();
            game.hideReplay();
        }
    }, false);
    document.addEventListener('touchend', function (event) {
        if (Global.config.status == "waitingReplay") {
            game.resetGame();
            game.hideReplay();
        }
    }, false);
    game.init();
    Global.container.appendChild(game.renderer.domElement);
    window.addEventListener('resize', function () {
        Global.width = window.innerWidth;
        Global.height = window.innerHeight;
        game.handleWindowResize();
    });
}, false);