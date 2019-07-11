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

Game.prototype.showReplay = function () {
    Global.replayMessage.style.display = "block";
}

Game.prototype.hideReplay = function () {
    Global.replayMessage.style.display = "none";
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
    this.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
    this.ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);
    // 方向光是从一个特定的方向的照射
    // 类似太阳，即所有光源是平行的
    // 第一个参数是关系颜色，第二个参数是光源强度
    this.shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
    this.shadowLight.position.set(150, 350, 350);
    this.shadowLight.castShadow = true;
    // 定义可见域的投射阴影
    this.shadowLight.shadow.camera.left = -400;
    this.shadowLight.shadow.camera.right = 400;
    this.shadowLight.shadow.camera.top = 400;
    this.shadowLight.shadow.camera.bottom = -400;
    this.shadowLight.shadow.camera.near = 1;
    this.shadowLight.shadow.camera.far = 1000;
    // 定义阴影的分辨率；虽然分辨率越高越好，但是需要付出更加昂贵的代价维持高性能的表现。
    this.shadowLight.shadow.mapSize.width = 2048;
    this.shadowLight.shadow.mapSize.height = 2048;
    this.scene.add(this.hemisphereLight);
    this.scene.add(this.ambientLight);
    this.scene.add(this.shadowLight);
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
    // 计算两帧之间的时间差
    Global.newTime = new Date().getTime();
    Global.deltaTime = Global.newTime - Global.oldTime;
    Global.oldTime = Global.newTime;
    if (Global.config.status == "playing") {
        // 根据飞机飞行距离周期生成金钱
        if (
            Math.floor(Global.config.distance) % Global.config.distanceForCoinsSpawn == 0 &&
            Math.floor(Global.config.distance) > Global.config.coinLastSpawn
        ) {
            Global.config.coinLastSpawn = Math.floor(Global.config.distance);
            this.coinsHolder.spawnCoins();
        }
        // 根据飞机飞行距离周期增加基础目标速度
        if (
            Math.floor(Global.config.distance) % Global.config.distanceForSpeedUpdate == 0 && 
            Math.floor(Global.config.distance) > Global.config.speedLastUpdate
        ) {
            Global.config.speedLastUpdate = Math.floor(Global.config.distance);
            Global.config.targetBaseSpeed += Global.config.incrementSpeedByTime * Global.deltaTime;
        }
        // 根据飞机飞行距离周期生成敌人
        if (
            Math.floor(Global.config.distance) % Global.config.distanceForEnnemiesSpawn == 0 && 
            Math.floor(Global.config.distance) > Global.config.ennemyLastSpawn
        ) {
            Global.config.ennemyLastSpawn = Math.floor(Global.config.distance);
            this.ennemiesHolder.spawnEnnemies();
        }
        // 根据飞机飞行距离提高游戏难度等级
        // 并重置目标速度
        if (
            Math.floor(Global.config.distance) % Global.config.distanceForLevelUpdate == 0 && 
            Math.floor(Global.config.distance) > Global.config.levelLastUpdate
        ) {
            Global.config.levelLastUpdate = Math.floor(Global.config.distance);
            Global.config.level++;
            Global.fieldLevel.innerHTML = Math.floor(Global.config.level);
            Global.config.targetBaseSpeed = Global.config.initSpeed + Global.config.incrementSpeedByLevel * Global.config.level;
        }
        // 更新飞机
        this.airplane.updatePlane();
        // 更新飞行员
        this.airplane.pilot.updateHairs();
        // 更新摄像头视角
        this.updateCameraFov();
        // 更新飞行距离
        this.updateDistance();
        // 更新血量
        this.updateEnergy();
        // 更新基础速度，基础速度根据帧时间接近目标速度
        Global.config.baseSpeed += (Global.config.targetBaseSpeed - Global.config.baseSpeed) * Global.deltaTime * 0.02;
        // 更新真实速度，真实速度等于基础速度乘以鼠标屏幕偏移
        Global.config.speed = Global.config.baseSpeed * Global.config.planeSpeed;
    } else if (Global.config.status == "gameover") {
        // 游戏结束，速度逐渐下降
        Global.config.speed *= 0.99;
        // 飞机左右摆动变慢
        this.airplane.mesh.rotation.x += 0.0003 * Global.deltaTime;
        // 飞机头逐渐向下
        this.airplane.mesh.rotation.z += (-Math.PI / 2 - this.airplane.mesh.rotation.z) * 0.0002 * Global.deltaTime;
        // 飞机受到重力作用
        Global.config.planeFallSpeed *= 1.05;
        // 飞机下坠
        this.airplane.mesh.position.y -= Global.config.planeFallSpeed * Global.deltaTime;
        // 飞机沉入海中，更新游戏状态
        if (this.airplane.mesh.position.y < -200) {
            this.showReplay();
            Global.config.status = "waitingReplay";
        }
    } else if (Global.config.status == "waitingReplay") {
    }
    // 飞机螺旋桨旋转变慢fieldLevel
    this.airplane.propeller.rotation.x += 0.2 + Global.config.planeSpeed * Global.deltaTime * 0.005;
    // 海平面转动
    this.sea.mesh.rotation.z += Global.config.speed * Global.deltaTime;
    if (this.sea.mesh.rotation.z > 2 * Math.PI) {
        this.sea.mesh.rotation.z -= 2 * Math.PI;
    }
    // 环境光强度在0.5左右微弱变化
    this.ambientLight.intensity += (0.5 - this.ambientLight.intensity) * Global.deltaTime * 0.005;
    // 金钱旋转
    this.coinsHolder.rotateCoins();
    // 敌人旋转
    this.ennemiesHolder.rotateEnnemies();
    // 判断金钱和敌人碰撞
    this.checkCollision();
    // 云群变化
    this.sky.moveClouds();
    // 波浪变化
    this.sea.moveWaves();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.loop.bind(this));
}

Game.prototype.updateCameraFov = function () {
    this.camera.fov = Util.normalize(Global.mousePos.x, -1, 1, 40, 80);
    this.camera.updateProjectionMatrix();
    this.camera.position.y += (this.airplane.mesh.position.y - this.camera.position.y) * Global.deltaTime * Global.config.cameraSensivity;
}

Game.prototype.updateDistance = function () {
    Global.config.distance += Global.config.speed * Global.deltaTime * Global.config.ratioSpeedDistance;
    Global.fieldDistance.innerHTML = Math.floor(Global.config.distance);
    let percent = 502 * (1 - (Global.config.distance % Global.config.distanceForLevelUpdate) / Global.config.distanceForLevelUpdate);
    Global.levelCircle.setAttribute('stroke-dashoffset', percent);
}

Game.prototype.updateEnergy = function () {
    Global.config.energy -= Global.config.speed * Global.deltaTime * Global.config.ratioSpeedEnergy;
    Global.config.energy = Math.max(0, Global.config.energy);
    Global.energyBar.style.right = (100 - Global.config.energy) + '%';
    Global.energyBar.style.backgroundColor = (Global.config.energy < 50) ? "#f25346" : "#68c3c0";
    if (Global.config.energy < 30) {
        Global.energyBar.style.animationName = 'blinking';
    } else {
        Global.energyBar.style.animationName = 'none';
    }
    if (Global.config.energy < 1) {
        Global.config.status = 'gameover';
    }
}

Game.prototype.addEnergy = function () {
    Global.config.energy += Global.config.coinValue;
    Global.config.energy = Math.min(Global.config.energy, 100);
}

Game.prototype.removeEnergy = function () {
    Global.config.energy -= Global.config.ennemyValue;
    Global.config.energy = Math.max(0, Global.config.energy);
}

// 碰撞检测
Game.prototype.checkCollision = function () {
    // 敌人碰撞检测
    for (let i = 0; i < this.ennemiesHolder.ennemiesInUse.length; i++) {
        let ennemy = this.ennemiesHolder.ennemiesInUse[i];
        let diffPos = this.airplane.mesh.position.clone().sub(ennemy.mesh.position.clone());
        let distance = diffPos.length();
        // 重心距离碰撞
        if (distance < Global.config.ennemyDistanceTolerance) {
            // 移除敌人
            this.ennemiesHolder.removeEnnemy(i);
            // 放粒子动画
            this.particlesHolder.spawnParticles(ennemy.mesh.position.clone(), 15, Colors.red, 3);
            Global.config.planeCollisionSpeedX = 100 * diffPos.x / distance;
            Global.config.planeCollisionSpeedY = 100 * diffPos.y / distance;
            // 光强变亮
            this.ambientLight.intensity = 2;
            this.removeEnergy();
            i--;
        }
    }
    // 金钱碰撞检测
    for (let i = 0; i < this.coinsHolder.coinsInUse.length; i++) {
        let coin = this.coinsHolder.coinsInUse[i];
        let diffPos = this.airplane.mesh.position.clone().sub(coin.mesh.position.clone());
        let distance = diffPos.length();
        // 重心距离碰撞
        if (distance < Global.config.coinDistanceTolerance) {
            this.coinsHolder.removeCoin(i);
            // 放粒子动画
            this.particlesHolder.spawnParticles(coin.mesh.position.clone(), 5, 0x999999, 0.8);
            this.addEnergy();
            i--;
        }
    }
}

