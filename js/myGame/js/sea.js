function Sea() {
    // 创建一个圆柱几何体
    // 参数为：顶面半径，底面半径，高度，半径分段，高度分段
    let geom = new THREE.CylinderGeometry(
        Global.config.seaRadius, 
        Global.config.seaRadius, 
        Global.config.seaLength, 
        40, 
        10
    );
    // 在 x 轴旋转几何体
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    // 创建材质
    geom.mergeVertices();
    let vertexLen = geom.vertices.length;
    this.waves = [];
    for (let i = 0; i < vertexLen; i++) {
        let vertex = geom.vertices[i];
        this.waves.push({
            // 每次都使用最初的坐标做变化，防止变化累加图形坍塌
            x: vertex.x,
            y: vertex.y,
            z: vertex.z,
            // 随机角度
            angle: Math.random() * Math.PI * 2,
            // 随机距离，这里的距离的方向是由海的圆柱体的圆心线指向当先顶点，配合角度使x,y方向分量的变化更加均匀。
            distance: Util.rand(Global.config.wavesMinAmp, Global.config.wavesMaxAmp),
            // 在0.016至0.048度/帧之间的随机速度
            speed: Util.rand(Global.config.wavesMinSpeed, Global.config.wavesMaxSpeed),
        });
    }
    let mat = new THREE.MeshPhongMaterial({
        color: Colors.blue,
        transparent: true,
        opacity: 0.8,
        shading: THREE.FlatShading,
    });
    // 为了在 Three.js 创建一个物体，我们必须创建网格用来组合几何体和一些材质
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.name = "waves";
    // 允许大海对象接收阴影
    this.mesh.receiveShadow = true;
}

Sea.prototype.moveWaves = function () {
    let vertices = this.mesh.geometry.vertices;
    let vertexLen = vertices.length;
    for (let i = 0; i < vertexLen; i++) {
        let vertex = vertices[i];
        let nextStepProps = this.waves[i];
        vertex.x = nextStepProps.x + Math.cos(nextStepProps.angle) * nextStepProps.distance;
        vertex.y = nextStepProps.y + Math.sin(nextStepProps.angle) * nextStepProps.distance;
        // // 下一帧自增一个角度，使顶点在distance内周期变化。
        nextStepProps.angle += nextStepProps.speed * Global.deltaTime;
        this.mesh.geometry.verticesNeedUpdate = true;
    }
    // 告诉渲染器代表大海的几何体发生改变
    // 事实上，为了维持最好的性能
    // Three.js 会缓存几何体和忽略一些修改
    // 除非加上这句
}

