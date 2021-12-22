import { derived, get, Readable, writable } from "svelte/store";
import { ScreenSharingLocalMedia, screenSharingLocalMedia } from "./ScreenSharingStore";
import { peerStore, screenSharingStreamStore } from "./PeerStore";
import type { RemotePeer } from "../WebRtc/SimplePeer";
import { LayoutMode } from "../WebRtc/LayoutManager";

export type Streamable = RemotePeer | ScreenSharingLocalMedia;

export const layoutModeStore = writable<LayoutMode>(LayoutMode.Presentation);

/**
 * A store that contains everything that can produce a stream (so the peers + the local screen sharing stream)
 */
function createStreamableCollectionStore(): Readable<Map<string, Streamable>> {
    return derived(
        [screenSharingStreamStore, peerStore, screenSharingLocalMedia],
        ([$screenSharingStreamStore, $peerStore, $screenSharingLocalMedia], set) => {
            const peers = new Map<string, Streamable>();

            const addPeer = (peer: Streamable) => {
                peers.set(peer.uniqueId, peer);
            };

            $screenSharingStreamStore.forEach(addPeer);
            $peerStore.forEach(addPeer);

            if ($screenSharingLocalMedia?.stream) {
                addPeer($screenSharingLocalMedia);
            }

            set(peers);
        }
    );
}

export const streamableCollectionStore = createStreamableCollectionStore();
