function Game() {
}

Game.prototype.init = function () {
    this.resetGame();
    // 创建场景，相机和渲染器
    this.createScene();
    // 添加光源
    this.createLights();
    // 添加对象
    this.createPlane();
    this.createSea();
    this.createSky();
    this.createCoins();
    this.createEnnemies();
    this.createParticle();
    // 调用循环函数，在每帧更新对象的位置和渲染场景
    this.loop();
}

/**
 * 重置游戏参数
 */
Game.prototype.resetGame = function () {
    Global.config = Util.clone(Config);
    Global.fieldLevel.innerHTML = Math.floor(Global.config.level);
    Global.deltaTime = 0;
    Global.newTime = new Date().getTime();
    Global.oldTime = Global.newTime;
}

Game.prototype.createScene = function () {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
    let aspectRatio = Global.width / Global.height;
    let fieldOfView = 50;
    let nearPlane = 0.1;
    let farPlane = 10000;
    /**
     * PerspectiveCamera 透视相机
     * @param fieldOfView 视角
     * @param aspectRatio 纵横比
     * @param nearPlane 近平面
     * @param farPlane 远平面
     */
    this.camera = new THREE.PerspectiveCamera(
        fieldOfView, 
        aspectRatio, 
        nearPlane, 
        farPlane
    );
    // camera的镜头在(0,100,200)处;
    this.camera.position.set(0, Global.config.planeDefaultHeight, 200);
    this.renderer = new THREE.WebGLRenderer({
        // 设置背景色透明显示渐变色
        alpha: true,
        // 开启抗锯齿，但这样会降低性能。
        antialias: true,
    });
    this.renderer.setSize(Global.width, Global.height);
    this.renderer.shadowMap.enabled = true;
}

Game.prototype.handleWindowResize = function () {
    // 更新渲染器的高度和宽度以及相机的纵横比
    this.renderer.setSize(Global.width, Global.height);
    this.camera.aspect = Global.width / Global.height;
    this.camera.updateProjectionMatrix();
}

Game.prototype.createLights = function () {
    // 半球光就是渐变的光；
    // 第一个参数是天空的颜色，第二个参数是地上的颜色，第三个参数是光源的强度
    let hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
    let ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);
    // 方向光是从一个特定的方向的照射
    // 类似太阳，即所有光源是平行的
    // 第一个参数是关系颜色，第二个参数是光源强度
    let shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
    shadowLight.position.set(150, 350, 350);
    shadowLight.castShadow = true;
    // 定义可见域的投射阴影
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;
    // 定义阴影的分辨率；虽然分辨率越高越好，但是需要付出更加昂贵的代价维持高性能的表现。
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;
    this.scene.add(hemisphereLight);
    this.scene.add(ambientLight);
    this.scene.add(shadowLight);
}

Game.prototype.createSea = function () {
    this.sea = new Sea();
    // 海向下以动半径的长度(600)
    // 所以海的圆柱体的圆心离视角中心700
    this.sea.mesh.position.y = -Global.config.seaRadius;
    this.scene.add(this.sea.mesh);
}

Game.prototype.createSky = function () {
    this.sky = new Sky();
    this.sky.mesh.position.y = -Global.config.seaRadius;
    this.scene.add(this.sky.mesh);
}

Game.prototype.createPlane = function () {
    this.airplane = new AirPlane();
    this.airplane.mesh.scale.set(0.25, 0.25, 0.25);
    this.airplane.mesh.position.y = Global.config.planeDefaultHeight;
    this.scene.add(this.airplane.mesh);
}

Game.prototype.createCoins = function () {
    this.coinsHolder = new CoinsHolder();
    this.coinsHolder.addItem(20);
    this.scene.add(this.coinsHolder.mesh);
}

Game.prototype.createEnnemies = function () {
    this.ennemiesHolder = new EnnemiesHolder();
    this.ennemiesHolder.addItem(10);
    this.scene.add(this.ennemiesHolder.mesh);
}

Game.prototype.createParticle = function () {
    this.particlesHolder = new ParticlesHolder();
    this.particlesHolder.addItem(10);
    this.scene.add(this.particlesHolder.mesh);
}

Game.prototype.loop = function () {
    Global.newTime = new Date().getTime();
    Global.deltaTime = Global.newTime - Global.oldTime;
    Global.oldTime = Global.newTime;
    if (Global.config.status == "playing") {
        if (
            Math.floor(Global.config.distance) % Global.config.distanceForCoinsSpawn == 0 &&
            Math.floor(Global.config.distance) > Global.config.coinLastSpawn
        ) {
            Global.config.coinLastSpawn = Math.floor(Global.config.distance);
            this.coinsHolder.spawnCoins();
        }
        if (
            Math.floor(Global.config.distance) % Global.config.distanceForSpeedUpdate == 0 && 
            Math.floor(Global.config.distance) > Global.config.speedLastUpdate
        ) {
            Global.config.speedLastUpdate = Math.floor(Global.config.distance);
            Global.config.targetBaseSpeed += Global.config.incrementSpeedByTime * Global.deltaTime;
        }
        if (
            Math.floor(Global.config.distance) % Global.config.distanceForEnnemiesSpawn == 0 && 
            Math.floor(Global.config.distance) > Global.config.ennemyLastSpawn
        ) {
            Global.config.ennemyLastSpawn = Math.floor(Global.config.distance);
            ennemiesHolder.spawnEnnemies();
        }
        if (
            Math.floor(Global.config.distance) % Global.config.distanceForLevelUpdate == 0 && 
            Math.floor(Global.config.distance) > Global.config.levelLastUpdate
        ) {
            Global.config.levelLastUpdate = Math.floor(Global.config.distance);
            Global.config.level++;
            fieldLevel.innerHTML = Math.floor(Global.config.level);
            Global.config.targetBaseSpeed = Global.config.initSpeed + Global.config.incrementSpeedByLevel*Global.config.level
        }
        this.updatePlane();
        this.updateDistance();
        this.updateEnergy();
        
    } else if (Global.config.status == "playing") {
        
    } else if (Global.config.status == "waitingReplay") {

    }

    }
    
    this.updateCameraFov();
    this.sea.moveWaves();
    this.sea.mesh.rotation.z += Global.config.speed * Global.deltaTime;//*game.seaRotationSpeed;

    if ( this.sea.mesh.rotation.z > 2*Math.PI)  this.sea.mesh.rotation.z -= 2*Math.PI;
    this.sky.mesh.rotation.z += 0.01;
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.loop.bind(this));
}

Game.prototype.updatePlane = function () {
    Global.planeSpeed = Util.normalize(
        Global.mousePos.x, 
        -0.5, 
        0.5, 
        game.planeMinSpeed, 
        game.planeMaxSpeed
    );
    let targetX = Util.normalize(
        Global.mousePos.x, 
        -1, 
        1, 
        -Global.config.planeAmpWidth * 0.7,
        -Global.config.planeAmpWidth
    );
    let targetY = Util.normalize(
        Global.mousePos.y, 
        -0.75, 
        0.75, 
        Global.config.planeDefaultHeight - Global.config.planeAmpHeight, 
        Global.config.planeDefaultHeight + Global.config.planeAmpHeight, 
    );
    Global.config.planeCollisionDisplacementX += Global.config.planeCollisionSpeedX;
    targetX += Global.config.planeCollisionDisplacementX;
    Global.config.planeCollisionDisplacementY += Global.config.planeCollisionSpeedY;
    targetY += Global.config.planeCollisionDisplacementY;
    this.airplane.mesh.position.x += (targetX - this.airplane.mesh.position.x) * Global.deltaTime * Global.config.planeMoveSensivity;
    this.airplane.mesh.position.y += (targetY - this.airplane.mesh.position.y) * Global.deltaTime * Global.config.planeMoveSensivity;
    this.airplane.mesh.rotation.z = (targetY - this.airplane.mesh.position.y) * Global.deltaTime * Global.config.planeRotXSensivity;
    this.airplane.mesh.rotation.x = (this.airplane.mesh.position.y - targetY) * Global.deltaTime * Global.config.planeRotZSensivity;
    this.airplane.propeller.rotation.x += 0.3;
    this.airplane.pilot.updateHairs();
}

Game.prototype.updateCameraFov = function () {
    this.camera.fov = Util.normalize(Global.mousePos.x, -1, 1, 40, 80);
    this.camera.updateProjectionMatrix();
    this.camera.position.y += (this.airplane.mesh.position.y - this.camera.position.y) * Global.deltaTime * Global.config.cameraSensivity;
}

Game.prototype.addEnergy = function () {
    Global.config.energy += Global.config.coinValue;
    Global.config.energy = Math.min(Global.config.energy, 100);
}

Game.prototype.removeEnergy = function () {
    Global.config.energy -= game.ennemyValue;
    Global.config.energy = Math.max(0, Global.config.energy);
}

Game.prototype.checkCollision = function () {
    for (let i = 0; i < this.ennemiesHolder.ennemiesInUse.length; i++) {
        let ennemy = this.ennemiesHolder.ennemiesInUse[i];
        let diffPos = this.airplane.mesh.position.clone().sub(ennemy.mesh.position.clone());
        let distance = diffPos.length();
        if (distance < Global.config.ennemyDistanceTolrance) {
            this.ennemiesHolder.removeEnergy(i);
            Global.config.planeCollisionSpeedX = 100 * diffPos.x / distance;
            Global.config.planeCollisionSpeedY = 100 * diffPos.y / distance;
            this.ambientLight.intensity = 2;
            this.removeEnergy();
            i--;
        }
    }
    for (let i = 0; i < this.coinsHolder.coinsInUse.length; i++) {
        let coin = this.coinsHolder.coinsInUse[i];
        let diffPos = this.airplane.mesh.position.clone().sub(coin.mesh.position.clone(), 15, Colors.red, 3);
        let distance = diffPos.length();
        if (distance < Global.config.coinDistanceTolrance) {
            this.coinsHolder.removeCoin(i);
            this.particlesHolder.spawnPartices(coin.mesh.position.clone(), 5, 0x999999, 0.8);
            this.addEnergy();
            i--;
        }
    }
}

