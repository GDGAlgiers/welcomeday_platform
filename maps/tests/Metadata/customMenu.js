let menuIframeApi = undefined;

WA.ui.registerMenuCommand('custom callback menu', () => {
    WA.nav.openTab("https://workadventu.re/");
})

WA.ui.registerMenuCommand('custom iframe menu', {iframe: 'customIframeMenu.html'});

WA.room.onEnterZone('iframeMenu', () => {
    menuIframeApi = WA.ui.registerMenuCommand('IFRAME USE API', {iframe: 'customIframeMenuApi.php', allowApi: true});
})

WA.room.onLeaveZone('iframeMenu', () => {
    menuIframeApi.remove();
})
