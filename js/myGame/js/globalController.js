export default class GlobalController {
    static _instance = null;

    static getInstance() {
        if (!GlobalController._instance) {
            GlobalController._instance = new GlobalController();
        }
        return GlobalController._instance;
    }
}