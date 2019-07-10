function Cloud() {
    // 创建一个空的容器放置不同形状的云
    this.mesh = new THREE.Object3D();
    this.mesh.name = "cloud";
    // 创建一个正方体
    // 这个形状会被复制创建云
    this.geom = new THREE.CubeGeometry(20, 20, 20);
    // 创建材质；一个简单的白色材质就可以达到效果
    this.mat = new THREE.MeshPhongMaterial({
        color: Colors.white,
    });
    // 随机多次复制几何体
    let nBlocs = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < nBlocs; i++) {
        // 通过复制几何体创建网格
        let cloudMesh = new THREE.Mesh(this.geom.clone(), this.mat);
        // 随机设置每个正方体的位置和旋转角度
        cloudMesh.position.set(i * 15, Math.random() * 10, Math.random() * 10);
        cloudMesh.rotation.y = Math.random() * Math.PI * 2;
        cloudMesh.rotation.z = Math.random() * Math.PI * 2;
        // 随机设置正方体的大小
        let scale = 0.1 + Math.random() * 0.9;
        cloudMesh.scale.set(scale, scale, scale);
        // 允许每个正方体生成投影和接收阴影
        cloudMesh.castShadow = true;
        cloudMesh.receiveShadow = true;
        this.mesh.add(cloudMesh);
    }
}

Cloud.prototype.rotate = function () {
    let childLen = this.mesh.children.length;
    for (let i = 0; i < childLen; i++) {
        let cloudBox = this.mesh.children[i];
        cloudBox.rotation.z += Util.rand(0.005 * (i + 1));
        cloudBox.rotation.y += Util.rand(0.002 * (i + 1));
    } 
}


