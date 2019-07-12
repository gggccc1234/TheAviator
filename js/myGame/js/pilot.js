import Base from "./baseComponent.js";

export default class Pilot extends Base {
    constructor() {
        super();
        this.mesh = new THREE.Object3D();
        this.mesh.name = 'pilot';
        // angleHairs是用于后面头发的动画的属性
        this.angleHairs = 0;

        // 飞行员的身体
        let bodyGeom = new THREE.BoxGeometry(15, 15, 15);
        let bodyMat = new THREE.MeshPhongMaterial({
            color: Colors.brown,
            shading: THREE.FlatShading
        });
        let body = new THREE.Mesh(bodyGeom, bodyMat);
        body.position.set(2, -12, 0);
        this.mesh.add(body);

        // 飞行员的脸部
        let faceGeom = new THREE.BoxGeometry(10, 10, 10);
        let faceMat = new THREE.MeshLambertMaterial({
            color: Colors.pink
        });
        let face = new THREE.Mesh(faceGeom, faceMat);
        this.mesh.add(face);

        // 飞行员的头发
        let hairGeom = new THREE.BoxGeometry(4, 4, 4);
        let hairMat = new THREE.MeshLambertMaterial({
            color: Colors.brown
        });
        let hair = new THREE.Mesh(hairGeom, hairMat);
        // 调整头发的形状至底部的边界，这将使它更容易扩展.
        // 这样可以将锚点的y方向设为0，使用scale.y对头发进行缩放，底部不变，顶部缩短
        hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, 0));

        let hairs = new THREE.Object3D();
        this.hairsTop = new THREE.Object3D();
        // 创建头顶的头发并放置他们在一个3*4的网格中
        for (let i = 0; i < 12; i++) {
            let hairCopy = hair.clone();
            let col = i % 3;
            let row = Math.floor(i / 3);
            let startPosZ = -4;
            let startPosX = -4;
            hairCopy.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
            this.hairsTop.add(hairCopy);
        }
        hairs.add(this.hairsTop);

        // 创建脸庞的头发
        let hairSideGeom = new THREE.BoxGeometry(12, 4, 2);
        hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6, 0, 0));
        let hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
        let hairSideL = hairSideR.clone();
        hairSideR.position.set(8, -2, 6);
        hairSideL.position.set(8, -2, -6);
        hairs.add(hairSideR);
        hairs.add(hairSideL);

        // 创建后脑勺的头发
        let hairBackGeom = new THREE.BoxGeometry(2, 8, 10);
        let hairBack = new THREE.Mesh(hairBackGeom, hairMat);
        hairBack.position.set(-1, -4, 0)
        hairs.add(hairBack);
        hairs.position.set(-5, 5, 0);

        this.mesh.add(hairs);

        // 眼镜大概。。。
        let glassGeom = new THREE.BoxGeometry(5, 5, 5);
        let glassMat = new THREE.MeshLambertMaterial({
            color: Colors.brown
        });
        let glassR = new THREE.Mesh(glassGeom, glassMat);
        glassR.position.set(6, 0, 3);
        let glassL = glassR.clone();
        glassL.position.z = -glassR.position.z;

        let glassAGeom = new THREE.BoxGeometry(11, 1, 11);
        let glassA = new THREE.Mesh(glassAGeom, glassMat);
        this.mesh.add(glassR);
        this.mesh.add(glassL);
        this.mesh.add(glassA);

        // 两只眼睛
        let earGeom = new THREE.BoxGeometry(2, 3, 2);
        let earL = new THREE.Mesh(earGeom, faceMat);
        earL.position.set(0, 0, -6);
        let earR = earL.clone();
        earR.position.set(0, 0, 6);
        this.mesh.add(earL);
        this.mesh.add(earR);
    }
    // 头发动画
    updateHairs() {
        let hairs = this.hairsTop.children;
        let len = hairs.length;
        for (let i = 0; i < len; i++) {
            let hair = hairs[i];
            // 当angle变大cos的值在[-1, 1]之间周期变化，所以头发的长度会在[0.5, 1]之间缩放
            hair.scale.y = 0.75 + Math.cos(this.angleHairs + i / 3) * 0.25;
        }
        this.angleHairs += Global.config.speed * Global.deltaTime * 40;
    }
}