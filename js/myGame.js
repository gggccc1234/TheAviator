function Game(container) {
    this.HEIGHT = window.innerHeight;
    this.WIDTH = window.innerWidth;
    this.config = Util.deepClone(GameConfig);
    this.container = container;
}

Game.prototype.createScene = function () {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
    this.createCamera();
    // alpha: 设置canvas背景色透明
    // antialias：开启抗锯齿
    this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(renderer.domElement);
}

Game.prototype.createCamera = function () {
    // 视角纵横比
    this.aspectRatio = this.WIDTH / this.HEIGHT;
    // 视角
    this.fieldOfView = 50;
    // 近平面
    this.nearPlane = 0.1;
    // 远平面
    this.farPlane = 10000;
    // 创建透视投影相机
    this.camera = new THREE.PerspectiveCamera(this.fieldOfView, this.aspectRatio, this.nearPlane, this.farPlane);
    this.camera.position.set(0, 200, this.config.planeDefaultHeight);
}

Game.prototype.createLights = function () {
    // 半球光就是渐变的光；
    // 第一个参数是天空的颜色，第二个参数是地上的颜色，第三个参数是光源的强度
    let hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
    // 环境光
    let ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);
    // 方向光是从一个特定的方向的照射
    // 类似太阳，即所有光源是平行的
    // 第一个参数是关系颜色，第二个参数是光源强度
    let shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
    // 设置光源的方向。  
    // 位置不同，方向光作用于物体的面也不同，看到的颜色也不同
    shadowLight.position.set(150, 350, 350);
    // 开启光源投影 
    shadowLight.castShadow = true;
    // 定义可见域的投射阴影
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;
    // 定义阴影的分辨率；虽然分辨率越高越好，但是需要付出更加昂贵的代价维持高性能的表现。
    shadowLight.shadow.mapSize.width = 4096;
    shadowLight.shadow.mapSize.height = 4096;
    // camera测试辅助
    // let ch = new THREE.CameraHelper(shadowLight.shadow.camera);

    // 为了使这些光源呈现效果，只需要将它们添加到场景中
    // this.scene.add(ch);
    this.scene.add(hemisphereLight);
    this.scene.add(shadowLight);
    this.scene.add(ambientLight);
}

Gmae.prototype.init = function () {
    // 创建场景，相机和渲染器
    this.createScene();
    // 添加光源
    this.createLights();
    // 添加对象
    this.createPlane();
    this.createSea();
    this.createSky();
    // 调用循环函数，在每帧更新对象的位置和渲染场景
    this.loop();
}

Game.prototype.handleWindowResize = function () {
    this.HEIGHT = window.innerHeight;
    this.WIDTH = window.innerWidth;
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.camera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.updateProjectionMatrix();
}

let container = document.getElementById('world');
let game = new Game(container);
window.addEventListener('load', game.init, false);
window.addEventListener('resize', game.handleWindowResize, false);

