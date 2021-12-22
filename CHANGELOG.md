## Version develop

### Updates
- Added multi Co-Website management

### Bugfix
- Moving a discussion over a user will now add this user to the discussion
- Being in a silent zone new forces mediaConstraints to false (#1508)
- Fixes for the emote menu (#1501)
- Fixing chat message attributed to wrong user (#1507 #1528)

## Version 1.5.0
### Updates
- Added support for login with OpenID Connect
- New scripting library available to extend WorkAdventure: see [Scripting API Extra](https://github.com/workadventure/scripting-api-extra/)  
- New menu design!
- New `openTab` property (#1419)
- Possible integration with Posthog (#1458)

### Bugfix
- Fixing layers flattened several times (#1427 @Lurkars)
- Fixing CSS of video elements
- Chat now scrolls to bottom when opened (#1450)
- Fixing silent zone not respected when exiting from Jitsi (#1456)
- Fixing "yarn install" failing because of missing rights on some Docker installs (#1457)
- Fixing audio not shut down when exiting a room (#1459)

### Misc
- Finished migrating "Build your map" documentation into the "/docs" directory of this repository (#1417 #1385)
- Refactoring documentation (dedicated page for variables) (#1414)
- Front container code is now completely linted (#1413)

## Version 1.4.15

### Updates 
- New scripting API features : 
  - Use `WA.ui.registerMenuCommand(commandDescriptor: string, options: MenuOptions): Menu` to add a custom menu or an iframe to the menu.
- New `jitsiWidth` parameter to set the width of Jitsi and Cowebsite (#1398 @tabascoeye)
- Refactored the way videos are displayed to better cope for vertical videos (on mobile)
- Fixing reconnection issues after 5 minutes of an inactive tab on Google Chrome
- Changes performed in `WA.room.setPropertyLayer` now have a real-time impact (#1395)

### Bugfixes
- Fixing streams in bubbles sometimes improperly muted when there are more than 2 people in the bubble (#1400 #1402)
- Properly displaying carriage returns in popups (#1388)
- `WA.state` now answers correctly to "in" keyword (#1393)
- Variables can now be nested in group layers (#1406)

## Version 1.4.14

### Updates
- New scripting API features : 
  - Use `WA.room.loadTileset(url: string) : Promise<number>` to load a tileset from a JSON file.
- Rewrote the way authentification works: the auth jwt token can now contains an email instead of an uuid
- Added an OpenId login flow than can be plugged to any OIDC provider.
- You can send a message to all rooms of your world from the console global message (user with tag admin only).

## Version 1.4.11

### Updates

- Added the ability to have animated tiles in maps #1216 #1217
- Enabled outlines on actionable item again (they were disabled when migrating to Phaser 3.50) #1218
- Enabled outlines on player names (when the mouse hovers on a player you can interact with) #1219
- Migrated the admin console to Svelte, and redesigned the console #1211
- Layer properties (like `exitUrl`, `silent`, etc...) can now also used in tile properties #1210 (@jonnytest1)
- New scripting API features :
  - Use `WA.onInit(): Promise<void>` to wait for scripting API initialization
  - Use `WA.room.showLayer(): void` to show a layer
  - Use `WA.room.hideLayer(): void` to hide a layer
  - Use `WA.room.setProperty() : void` to add, delete or change existing property of a layer
  - Use `WA.player.onPlayerMove(): void` to track the movement of the current player
  - Use `WA.player.id: string|undefined` to get the ID of the current player
  - Use `WA.player.name: string` to get the name of the current player
  - Use `WA.player.tags: string[]` to get the tags of the current player
  - Use `WA.room.id: string` to get the ID of the room
  - Use `WA.room.mapURL: string` to get the URL of the map
  - Use `WA.room.mapURL: string` to get the URL of the map
  - Use `WA.room.getMap(): Promise<ITiledMap>` to get the JSON map file
  - Use `WA.room.setTiles(): void` to add, delete or change an array of tiles
  - Use `WA.ui.registerMenuCommand(): void` to add a custom menu
  - Use `WA.state.loadVariable(key: string): unknown` to retrieve a variable
  - Use `WA.state.saveVariable(key: string, value: unknown): Promise<void>` to set a variable (across the room, for all users)
  - Use `WA.state.onVariableChange(key: string): Observable<unknown>` to track a variable
  - Use `WA.state.[any variable]: unknown` to access directly any variable (this is a shortcut to using `WA.state.loadVariable` and `WA.state.saveVariable`)
- Users blocking now relies on UUID rather than ID. A blocked user that leaves a room and comes back will stay blocked.
- The text chat was redesigned to be prettier and to use more features :
  - The chat is now persistent between discussions and always accessible
  - The chat now tracks incoming and outcoming users in your conversation
  - The chat allows your to see the visit card of users
  - You can close the chat window with the escape key
- Added a 'Enable notifications' button in the menu.
- The exchange format between Pusher and Admin servers has changed. If you have your own implementation of an admin server, these endpoints signatures have changed:
  - `/api/map`: now accepts a complete room URL instead of organization/world/room slugs
  - `/api/ban`: new endpoint to report users
  - as a side effect, the "routing" is now completely stored on the admin side, so by implementing your own admin server, you can develop completely custom routing

## Version 1.4.3 - 1.4.4 - 1.4.5

## Bugfixes

- Fixing the generation of @workadventure/iframe-api-typings

## Version 1.4.2

## Updates

- A script in an iframe opened by another script can use the IFrame API.

## Version 1.4.1

### Bugfixes

- Loading errors after the preload stage should not crash the game anymore

## Version 1.4.0

### BREAKING CHANGES

- Scripting API:
  - Changed function names: `restorePlayerControl` => `restorePlayerControls`, `disablePlayerControl` => `disablePlayerControls`.
    Please keep in mind that the scripting API is still experimental. Some breaking changes can occur in it until we mark it as stable.

### Updates

- Added the emote feature to WorkAdventure. (@Kharhamel, @Tabascoeye)
  - The emote menu can be opened by clicking on your character. 
  -  Clicking on one of its element will close the menu and play an emote above your character. 
  -  This emote can be seen by other players.
- Player names were improved. (@Kharhamel)
  - We now create a GameObject.Text instead of GameObject.BitmapText
  - now use the 'Press Start 2P' font family and added an outline
  - As a result, we can now allow non-standard letters like french accents or chinese characters!
  
- Added the contact card feature. (@Kharhamel)
  - Click on another player to see its contact info.
  - Premium-only feature unfortunately. I need to find a way to make it available for all.
  - If no contact data is found (either because the user is anonymous or because no admin backend), display an error card.

- Mobile support has been improved
  - WorkAdventure automatically sets the zoom level based on the viewport size to ensure a sensible size of the map is visible, whatever the viewport used
  - Mouse wheel support to zoom in / out
  - Pinch support on mobile to zoom in / out
  - Improved virtual joystick size (adapts to the zoom level)
- Redesigned intermediate scenes
  - Redesigned Select Companion scene
  - Redesigned Enter Your Name scene
    - Added a new `DISPLAY_TERMS_OF_USE` environment variable to trigger the display of terms of use  
- New scripting API features:
  - Use `WA.loadSound(): Sound` to load / play / stop a sound


### Bug Fixes

- Pinch gesture does no longer move the character

## Version 1.3.0

### New Features

* Maps can now contain "group" layers (layers that contain other layers) - #899 #779 (@Lurkars @moufmouf)

### Updates


### Bug Fixes
