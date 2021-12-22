import { gameManager } from "../Game/GameManager";
import { ResizableScene } from "./ResizableScene";
import { enableCameraSceneVisibilityStore } from "../../Stores/MediaStore";
import { localUserStore } from "../../Connexion/LocalUserStore";
import { analyticsClient } from "../../Administration/AnalyticsClient";

export const EnableCameraSceneName = "EnableCameraScene";

export class EnableCameraScene extends ResizableScene {
    constructor() {
        super({
            key: EnableCameraSceneName,
        });
    }

    preload() {}

    create() {
        this.input.keyboard.on("keyup-ENTER", () => {
            this.login();
        });

        enableCameraSceneVisibilityStore.showEnableCameraScene();
    }

    public onResize(): void {}

    update(time: number, delta: number): void {}

    public login(): void {
        analyticsClient.validationVideo();

        enableCameraSceneVisibilityStore.hideEnableCameraScene();

        this.scene.sleep(EnableCameraSceneName);
        gameManager.goToStartingMap();
    }
}
