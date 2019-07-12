import Ennemy from "./ennemy.js";
import Base from "./baseComponent.js"; 

export default class EnnemiesHolder extends Base {
    constructor() {
        super();
        this.mesh = new THREE.Object3D();
        // 使用中的对象
        this.ennemiesInUse = [];
        // 对象池
        this.ennemiesPool = [];
    }
    /**
     * 生成对象
     */
    spawnEnnemies() {
        let nEnnemies = Global.config.level;
        for (let i = 0; i < nEnnemies; i++) {
            let ennemy;
            if (this.ennemiesPool.length) {
                ennemy = this.ennemiesPool.pop();
            } else {
                ennemy = new Ennemy();
            }
            // 敌人距离视角中心(0,-100,0);
            // 以海为中心旋转计算敌人位置，由于海中心y为-600，计算y坐标后减去600
            ennemy.angle = -(i * 0.1);
            ennemy.distance = Global.config.seaRadius + Global.config.planeDefaultHeight + (-1 + Math.random() * 2) * (Global.config.planeDefaultHeight - 20);
            ennemy.mesh.position.x = Math.cos(ennemy.angle) * ennemy.distance;
            ennemy.mesh.position.y = -Global.config.seaRadius + Math.sin(ennemy.angle) * ennemy.distance;
            this.mesh.add(ennemy.mesh);
            this.ennemiesInUse.push(ennemy);
        }
    }

    rotateEnnemies() {
        for (let i = 0; i < this.ennemiesInUse.length; i++) {
            let ennemy = this.ennemiesInUse[i];
            ennemy.angle += Global.config.speed * Global.deltaTime * Global.config.ennemiesSpeed;
            ennemy.mesh.position.x = Math.cos(ennemy.angle) * ennemy.distance;
            ennemy.mesh.position.y = -Global.config.seaRadius + Math.sin(ennemy.angle) * ennemy.distance;
            ennemy.mesh.rotation.y += Math.random() * 0.1;
            ennemy.mesh.rotation.z += Math.random() * 0.1;
            if (ennemy.angle > Math.PI) {
                this.removeEnnemy(i);
                i--;
            }
        }
    }

    removeEnnemy(index) {
        let ennemy = this.ennemiesInUse[index];
        this.ennemiesPool.unshift(this.ennemiesInUse.splice(index, 1)[0]);
        this.mesh.remove(ennemy.mesh);
    }

    addItem(num) {
        for (let i = 0; i < num; i++) {
            let ennemy = new Ennemy();
            this.ennemiesPool.push(ennemy);
        }
    }
}