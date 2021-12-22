import { get, writable } from "svelte/store";
import Timeout = NodeJS.Timeout;
import { userIsAdminStore } from "./GameStore";
import { CONTACT_URL } from "../Enum/EnvironmentVariable";
import { analyticsClient } from "../Administration/AnalyticsClient";

export const menuIconVisiblilityStore = writable(false);
export const menuVisiblilityStore = writable(false);
menuVisiblilityStore.subscribe((value) => {
    if (value) analyticsClient.openedMenu();
});
export const menuInputFocusStore = writable(false);
export const userIsConnected = writable(false);

let warningContainerTimeout: Timeout | null = null;
function createWarningContainerStore() {
    const { subscribe, set } = writable<boolean>(false);

    return {
        subscribe,
        activateWarningContainer() {
            set(true);
            if (warningContainerTimeout) clearTimeout(warningContainerTimeout);
            warningContainerTimeout = setTimeout(() => {
                set(false);
                warningContainerTimeout = null;
            }, 120000);
        },
    };
}

export const warningContainerStore = createWarningContainerStore();

export enum SubMenusInterface {
    settings = "Settings",
    profile = "Profile",
    invite = "Invite",
    aboutRoom = "Credit",
    globalMessages = "Global Messages",
    contact = "Contact",
}

function createSubMenusStore() {
    const { subscribe, update } = writable<string[]>([
        SubMenusInterface.profile,
        SubMenusInterface.globalMessages,
        SubMenusInterface.contact,
        SubMenusInterface.settings,
        SubMenusInterface.invite,
        SubMenusInterface.aboutRoom,
    ]);

    return {
        subscribe,
        addMenu(menuCommand: string) {
            update((menuList: string[]) => {
                if (!menuList.find((menu) => menu === menuCommand)) {
                    menuList.push(menuCommand);
                }
                return menuList;
            });
        },
        removeMenu(menuCommand: string) {
            update((menuList: string[]) => {
                const index = menuList.findIndex((menu) => menu === menuCommand);
                if (index !== -1) {
                    menuList.splice(index, 1);
                }
                return menuList;
            });
        },
    };
}

export const subMenusStore = createSubMenusStore();

export const contactPageStore = writable<string | undefined>(CONTACT_URL);

export function checkSubMenuToShow() {
    subMenusStore.removeMenu(SubMenusInterface.globalMessages);
    subMenusStore.removeMenu(SubMenusInterface.contact);

    if (get(userIsAdminStore)) {
        subMenusStore.addMenu(SubMenusInterface.globalMessages);
    }

    if (get(contactPageStore) !== undefined) {
        subMenusStore.addMenu(SubMenusInterface.contact);
    }
}

export const customMenuIframe = new Map<string, { url: string; allowApi: boolean }>();

export function handleMenuRegistrationEvent(
    menuName: string,
    iframeUrl: string | undefined = undefined,
    source: string | undefined = undefined,
    options: { allowApi: boolean }
) {
    if (get(subMenusStore).includes(menuName)) {
        console.warn("The menu " + menuName + " already exist.");
        return;
    }

    subMenusStore.addMenu(menuName);

    if (iframeUrl !== undefined) {
        const url = new URL(iframeUrl, source);
        customMenuIframe.set(menuName, { url: url.toString(), allowApi: options.allowApi });
    }
}

export function handleMenuUnregisterEvent(menuName: string) {
    const subMenuGeneral: string[] = Object.values(SubMenusInterface);
    if (subMenuGeneral.includes(menuName)) {
        console.warn("The menu " + menuName + " is a mandatory menu. It can't be remove");
        return;
    }

    subMenusStore.removeMenu(menuName);
    customMenuIframe.delete(menuName);
}
