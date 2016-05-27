# TypescriptMods
## Loading
Press `Ctrl` + `Shift` + `J` to open the console. In the console window paste the chosen code. Enable Game Mods before loading any script.
If you use many pieces of code in one sesion, eg. `Interface + Notifications + Misc`, paste the selected code before loading it. 
Next time while in the console, simply press arrow up to load all code at once.

##Boss timers - Preferably do not use
When you kill, or notice a dead Boss, interface updates and notification is sent to other users via chat.
There are few functionalities missing, but it is not further developed as it is slightly unsafe to use.
You can use it for personal use with message emiting disabled by typing `timersMod.emitEnabled = true;`

##Interface
Improves the layout of the game interface, changed resizing for canvas for more pixelated look.

##Misc
Swaps items in inventory with the pet inventory. Requires pet chest to be closed to work properly, as well as one empty space.
Use `2` to swap. If you want different key, use http://keycode.info/ to find value and replace 

##PetMod
Preferably load this mod on player island, otherwise if its blank, when you are on island close and open.
You can open from red menu, under `Breeding Menu` entry.
This mod allows you too see easily the health of all pets inside nests, as well as open each nest and place pet inside.
Press the key below escape `¬` to go to next pet.

TODO: 
Improve interface
Highlight currently selected pet nest

##Notifications
####Feautures
Sound - Plays sound on inv full, captcha, low hp etc. Customize what is active by changing boolean/number:

`notifications.enable.sound = true;
this.soundHP = 70;`

Shows notifications on full inventory.

`this.notifications = true;
this.inventoryNotifications = true;`

Logs chat messages to chat.

`this.logMessages = true;`

Shows boss respawn timer.

`this.bossRespawn = true;`

Autoescape from fight.

`this.autoEscape = true;
this.escapeHP = 40;`

