function AirPlane () {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "airPlane";
    // 创建机舱
    let geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
    geomCockpit.vertices[4].y-=10;
    geomCockpit.vertices[4].z+=20;
    geomCockpit.vertices[5].y-=10;
    geomCockpit.vertices[5].z-=20;
    geomCockpit.vertices[6].y+=30;
    geomCockpit.vertices[6].z+=20;
    geomCockpit.vertices[7].y+=30;
    geomCockpit.vertices[7].z-=20;
    let matCockpit = new THREE.MeshPhongMaterial({
        color: Colors.red,
    });
    this.cockpit = new THREE.Mesh(geomCockpit, matCockpit);
    this.cockpit.castShadow = true;
    this.cockpit.receiveShadow = true;
    this.mesh.add(this.cockpit);

    // 创建引擎
    let geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
    let matEngine = new THREE.MeshPhongMaterial({
        color: Colors.white,
        shading: THREE.FlatShading,
    });
    this.engine = new THREE.Mesh(geomEngine, matEngine);
    this.engine.position.x = 40;
    this.engine.castShadow = true;
    this.engine.receiveShadow = true;
    this.mesh.add(this.engine);

    // 创建机尾
    let geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
    let matTailPlane = new THREE.MeshPhongMaterial({
        color: Colors.red,
        shading: THREE.FlatShading,
    });
    this.tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
    this.tailPlane.position.set(-35, 25, 0);
    this.tailPlane.castShadow = true;
    this.tailPlane.receiveShadow = true;
    this.mesh.add(this.tailPlane);

    // 创建机翼
    let geomSideWing = new THREE.BoxGeometry(40, 3, 150, 1, 1, 1);
    let matSideWing = new THREE.MeshPhongMaterial({
        color: Colors.red,
        shading: THREE.FlatShading,
    });
    this.sideWingTop = new THREE.Mesh(geomSideWing, matSideWing);
    this.sideWingTop.position.y = 10;
    this.sideWingTop.castShadow = true;
    this.sideWingTop.receiveShadow = true;
    this.sideWingBottom = this.sideWingTop.clone();
    this.sideWingBottom.position.x = 14;
    this.sideWingBottom.position.y = -2;
    this.sideWingBottom.castShadow = true;
    this.sideWingBottom.receiveShadow = true;
    this.mesh.add(this.sideWingTop);
    this.mesh.add(this.sideWingBottom);

    // 挡风玻璃
    let geomWindshield = new THREE.BoxGeometry(3, 15, 20, 1, 1, 1);
    let matWindshield = new THREE.MeshPhongMaterial({
        color: Colors.white, 
        transparent: true,
        opacity: .3,
        shading: THREE.FlatShading,
    })
    this.windshield = new THREE.Mesh(geomWindshield, matWindshield);
    this.windshield.position.set(5,27,0);
    this.windshield.castShadow = true;
    this.windshield.receiveShadow = true;
    this.mesh.add(this.windshield);

    // 创建螺旋桨
    let geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
    geomPropeller.vertices[4].y-=5;
    geomPropeller.vertices[4].z+=5;
    geomPropeller.vertices[5].y-=5;
    geomPropeller.vertices[5].z-=5;
    geomPropeller.vertices[6].y+=5;
    geomPropeller.vertices[6].z+=5;
    geomPropeller.vertices[7].y+=5;
    geomPropeller.vertices[7].z-=5;
    let matPropeller = new THREE.MeshPhongMaterial({
        color: Colors.brown,
        shading: THREE.FlatShading
    });
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;

    // 创建螺旋桨的桨叶
    let geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
    let matBlade = new THREE.MeshPhongMaterial({
        color: Colors.brownDark,
        shading: THREE.FlatShading
    });
    this.bladeVertical = new THREE.Mesh(geomBlade, matBlade);
    this.bladeVertical.position.set(8, 0, 0);
    this.bladeVertical.castShadow = true;
    this.bladeVertical.receiveShadow = true;
    this.bladeHorizontal = this.bladeVertical.clone();
    this.bladeHorizontal.rotation.x = Math.PI / 2;
    this.bladeHorizontal.castShadow = true;
    this.bladeHorizontal.receiveShadow = true;
    this.propeller.add(this.bladeVertical);
    this.propeller.add(this.bladeHorizontal);
    this.propeller.position.set(50, 0, 0);
    this.mesh.add(this.propeller);

    // 飞机右前车轮盖
    let wheelProtecGeom = new THREE.BoxGeometry(30, 15, 10, 1, 1, 1);
    let wheelProtecMat = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
    this.wheelProtecR = new THREE.Mesh(wheelProtecGeom, wheelProtecMat);
    this.wheelProtecR.position.set(25, -20, 25);
    this.mesh.add(this.wheelProtecR);

    // 右前车轮
    // let wheelTireGeom = new THREE.BoxGeometry(24, 24, 4);
    let wheelTireGeom = new THREE.CylinderGeometry(12, 12, 4, 24, 1, false);
    let wheelTireMat = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});
    this.wheelTireR = new THREE.Mesh(wheelTireGeom, wheelTireMat);
    this.wheelTireR.position.set(25,-28,25);

    // 右前车轴
    let wheelAxisGeom = new THREE.BoxGeometry(10, 6, 10);
    // let wheelAxisGeom = new THREE.CylinderGeometry(5, 5, 6, 24, 1, false);
    let wheelAxisMat = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
    this.wheelAxis = new THREE.Mesh(wheelAxisGeom, wheelAxisMat);
    // 车轮和车轴会联动
    this.wheelTireR.add(this.wheelAxis);
    this.wheelTireR.rotation.x = -Math.PI / 2;
    this.mesh.add(this.wheelTireR);

    // 左边车轮部分
    this.wheelProtecL = this.wheelProtecR.clone();
    this.wheelProtecL.position.z = -this.wheelProtecR.position.z;
    this.mesh.add(this.wheelProtecL);

    this.wheelTireL = this.wheelTireR.clone();
    this.wheelTireL.position.z = -this.wheelTireR.position.z;
    this.mesh.add(this.wheelTireL);

    // 后车轮
    this.wheelTireB = this.wheelTireR.clone();
    this.wheelTireB.scale.set(0.5, 0.5, 0.5);
    this.wheelTireB.position.set(-35, -5, 0);
    this.mesh.add(this.wheelTireB);

    // 后轮连接杆
    let suspensionGeom = new THREE.BoxGeometry(4,20,4);
    suspensionGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,10,0));
    let suspensionMat = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
    this.suspension = new THREE.Mesh(suspensionGeom, suspensionMat);
    this.suspension.position.set(-35, -5, 0);
    this.suspension.rotation.z = -0.3;
    this.mesh.add(this.suspension);

    this.pilot = new Pilot();
    this.pilot.mesh.position.set(-10, 27, 0);
    this.mesh.add(this.pilot.mesh);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
}