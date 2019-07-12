import Cloud from "./cloud.js";
import Base from "./baseComponent.js"; 

export default class Sky extends Base {
    constructor() {
        super();
        // 创建一个空的容器
        this.mesh = new THREE.Object3D();
        // 选取若干朵云散布在天空中
        this.nClouds = 20;
        this.clouds = [];
        // 把云均匀地散布
        // 我们需要根据统一的角度放置它们
        let stepAngle = Math.PI * 2 / this.nClouds;
        // 创建云对象
        for (let i = 0; i < this.nClouds; i++) {
            let cloud = new Cloud();
            this.clouds.push(cloud);
            // 设置每朵云的旋转角度和位置
            // 因此我们使用了一点三角函数
            let angle = stepAngle * i;
            let height = Global.config.seaRadius + 150 + Math.random() * 200;
            // 我们简单地把极坐标转换成笛卡坐标
            cloud.mesh.position.x = Math.cos(angle) * height;
            cloud.mesh.position.y = Math.sin(angle) * height;
            // 为了有更好的效果，我们把云放置在场景中的随机深度位置
            cloud.mesh.position.z = Util.rand(-800, -300);
            // 根据云的位置旋转它
            cloud.mesh.rotation.z = angle + Math.PI / 2;
            let scale = 1 + Math.random() * 2;
            // 为每朵云设置一个随机大小
            cloud.mesh.scale.set(scale, scale, scale);
            this.mesh.add(cloud.mesh);
        }
    }
    moveClouds() {
        for (let i = 0; i < this.nClouds; i++) {
            let cloud = this.clouds[i];
            cloud.rotate();
        }
        this.mesh.rotation.z += Global.config.speed * Global.deltaTime;
    }
}


