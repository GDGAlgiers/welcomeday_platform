import { areCharacterLayersValid, isUserNameValid, LocalUser } from "./LocalUser";
import { v4 as uuidv4 } from "uuid";
import { START_ROOM_URL } from "../Enum/EnvironmentVariable";

const playerNameKey = "playerName";
const selectedPlayerKey = "selectedPlayer";
const customCursorPositionKey = "customCursorPosition";
const characterLayersKey = "characterLayers";
const companionKey = "companion";
const gameQualityKey = "gameQuality";
const videoQualityKey = "videoQuality";
const audioPlayerVolumeKey = "audioVolume";
const audioPlayerMuteKey = "audioMute";
const helpCameraSettingsShown = "helpCameraSettingsShown";
const fullscreenKey = "fullscreen";
const forceCowebsiteTriggerKey = "forceCowebsiteTrigger";
const ignoreFollowRequests = "ignoreFollowRequests";
const lastRoomUrl = "lastRoomUrl";
const authToken = "authToken";
const state = "state";
const nonce = "nonce";
const notification = "notificationPermission";
const code = "code";
const cameraSetup = "cameraSetup";

const cacheAPIIndex = "workavdenture-cache";

class LocalUserStore {
    saveUser(localUser: LocalUser) {
        localStorage.setItem("localUser", JSON.stringify(localUser));
    }
    getLocalUser(): LocalUser | null {
        const data = localStorage.getItem("localUser");
        return data ? JSON.parse(data) : null;
    }

    setName(name: string): void {
        localStorage.setItem(playerNameKey, name);
    }
    getName(): string | null {
        const value = localStorage.getItem(playerNameKey) || "";
        return isUserNameValid(value) ? value : null;
    }

    setPlayerCharacterIndex(playerCharacterIndex: number): void {
        localStorage.setItem(selectedPlayerKey, "" + playerCharacterIndex);
    }
    getPlayerCharacterIndex(): number {
        return parseInt(localStorage.getItem(selectedPlayerKey) || "");
    }

    setCustomCursorPosition(activeRow: number, selectedLayers: number[]): void {
        localStorage.setItem(customCursorPositionKey, JSON.stringify({ activeRow, selectedLayers }));
    }
    getCustomCursorPosition(): { activeRow: number; selectedLayers: number[] } | null {
        return JSON.parse(localStorage.getItem(customCursorPositionKey) || "null");
    }

    setCharacterLayers(layers: string[]): void {
        localStorage.setItem(characterLayersKey, JSON.stringify(layers));
    }
    getCharacterLayers(): string[] | null {
        const value = JSON.parse(localStorage.getItem(characterLayersKey) || "null");
        return areCharacterLayersValid(value) ? value : null;
    }

    setCompanion(companion: string | null): void {
        return localStorage.setItem(companionKey, JSON.stringify(companion));
    }
    getCompanion(): string | null {
        const companion = JSON.parse(localStorage.getItem(companionKey) || "null");

        if (typeof companion !== "string" || companion === "") {
            return null;
        }

        return companion;
    }
    wasCompanionSet(): boolean {
        return localStorage.getItem(companionKey) ? true : false;
    }

    setGameQualityValue(value: number): void {
        localStorage.setItem(gameQualityKey, "" + value);
    }
    getGameQualityValue(): number {
        return parseInt(localStorage.getItem(gameQualityKey) || "60");
    }

    setVideoQualityValue(value: number): void {
        localStorage.setItem(videoQualityKey, "" + value);
    }
    getVideoQualityValue(): number {
        return parseInt(localStorage.getItem(videoQualityKey) || "20");
    }

    setAudioPlayerVolume(value: number): void {
        localStorage.setItem(audioPlayerVolumeKey, "" + value);
    }
    getAudioPlayerVolume(): number {
        return parseFloat(localStorage.getItem(audioPlayerVolumeKey) || "1");
    }

    setAudioPlayerMuted(value: boolean): void {
        localStorage.setItem(audioPlayerMuteKey, value.toString());
    }
    getAudioPlayerMuted(): boolean {
        return localStorage.getItem(audioPlayerMuteKey) === "true";
    }

    setHelpCameraSettingsShown(): void {
        localStorage.setItem(helpCameraSettingsShown, "1");
    }
    getHelpCameraSettingsShown(): boolean {
        return localStorage.getItem(helpCameraSettingsShown) === "1";
    }

    setFullscreen(value: boolean): void {
        localStorage.setItem(fullscreenKey, value.toString());
    }
    getFullscreen(): boolean {
        return localStorage.getItem(fullscreenKey) === "true";
    }

    setForceCowebsiteTrigger(value: boolean): void {
        localStorage.setItem(forceCowebsiteTriggerKey, value.toString());
    }
    getForceCowebsiteTrigger(): boolean {
        return localStorage.getItem(forceCowebsiteTriggerKey) === "true";
    }

    setIgnoreFollowRequests(value: boolean): void {
        localStorage.setItem(ignoreFollowRequests, value.toString());
    }
    getIgnoreFollowRequests(): boolean {
        return localStorage.getItem(ignoreFollowRequests) === "true";
    }

    setLastRoomUrl(roomUrl: string): void {
        localStorage.setItem(lastRoomUrl, roomUrl.toString());
        if ("caches" in window) {
            caches.open(cacheAPIIndex).then((cache) => {
                const stringResponse = new Response(JSON.stringify({ roomUrl }));
                cache.put(`/${lastRoomUrl}`, stringResponse);
            });
        }
    }
    getLastRoomUrl(): string {
        return (
            localStorage.getItem(lastRoomUrl) ?? window.location.protocol + "//" + window.location.host + START_ROOM_URL
        );
    }
    getLastRoomUrlCacheApi(): Promise<string | undefined> {
        if (!("caches" in window)) {
            return Promise.resolve(undefined);
        }
        return caches.open(cacheAPIIndex).then((cache) => {
            return cache.match(`/${lastRoomUrl}`).then((res) => {
                return res?.json().then((data) => {
                    return data.roomUrl;
                });
            });
        });
    }

    setAuthToken(value: string | null) {
        value ? localStorage.setItem(authToken, value) : localStorage.removeItem(authToken);
    }
    getAuthToken(): string | null {
        return localStorage.getItem(authToken);
    }

    setNotification(value: string): void {
        localStorage.setItem(notification, value);
    }

    getNotification(): string | null {
        return localStorage.getItem(notification);
    }

    generateState(): string {
        const newState = uuidv4();
        localStorage.setItem(state, newState);
        return newState;
    }

    verifyState(value: string): boolean {
        const oldValue = localStorage.getItem(state);
        if (!oldValue) {
            localStorage.setItem(state, value);
            return true;
        }
        return oldValue === value;
    }
    setState(value: string) {
        localStorage.setItem(state, value);
    }
    getState(): string | null {
        return localStorage.getItem(state);
    }
    generateNonce(): string {
        const newNonce = uuidv4();
        localStorage.setItem(nonce, newNonce);
        return newNonce;
    }
    getNonce(): string | null {
        return localStorage.getItem(nonce);
    }
    setCode(value: string): void {
        localStorage.setItem(code, value);
    }
    getCode(): string | null {
        return localStorage.getItem(code);
    }

    setCameraSetup(cameraId: string) {
        localStorage.setItem(cameraSetup, cameraId);
    }
    getCameraSetup(): { video: unknown; audio: unknown } | undefined {
        const cameraSetupValues = localStorage.getItem(cameraSetup);
        return cameraSetupValues != undefined ? JSON.parse(cameraSetupValues) : undefined;
    }
}

export const localUserStore = new LocalUserStore();
