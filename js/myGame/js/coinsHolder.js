function CoinsHolder() {
    this.mesh = new THREE.Object3D();
    this.coinsInUse = [];
    this.coinsPool = [];
}

CoinsHolder.prototype.spawnCoins = function () {
    let nCoins = 1 + Math.floor(Math.random() * 10);
    let distance = Global.config.seaRadius + Global.config.planeDefaultHeight + (-1 + Math.random() * 2) * (Global.config.planeAmpHeight - 20);
    // 振幅
    let amplitude = 10 + Math.round(Math.random() * 10);
    for (let i = 0; i < nCoins; i++) {
        let coin = null;
        if (this.coinsPool.length) {
            coin = this.coinsPool.pop();
        } else {
            coin = new Coin();
        }
        this.mesh.add(coin.mesh);
        this.coinsInUse.push(coin);
        coin.angle = -(i * 0.02);
        coin.distance = distance + Math.cos(i * 0.5) * amplitude;
        coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;
        coin.mesh.position.y = -game.seaRadius + Math.sin(coin.angle) * coin.distance;
    }
}

CoinsHolder.prototype.rotateCoins = function () {
    for (let i = 0; this.coinsInUse.length; i++) {
        let coin = this.coinsInUse[i];
        coin.angle += Global.config.speed * Global.deltaTime * Global.config.coinsSpeed;
        if (coin.angle > Math.PI * 2) {
            coin.angle -= Math.PI * 2;
        }
        coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;
        coin.mesh.position.y = -Global.config.seaRadius + Math.sin(coin.angle) * coin.distance;
        coin.mesh.rotation.y = Math.random() * 0.1;
        coin.mesh.rotation.z = Math.random() * 0.1;
        if (coin.angle > Math.PI) {
            this.removeCoin(i);
            i--;
        }
    }
}

CoinsHolder.prototype.removeCoin = function (index) {
    let coin = this.coinsInUse[index];
    this.coinsPool.unshift(this.coinsInUse.splice(index, 1)[0]);
    this.mesh.remove(coin.mesh);
}

CoinsHolder.prototype.addItem = function (num) {
    for (let i = 0; i < num; i++) {
        let coin = new Coin();
        this.coinsPool.push(coin);
    }
}