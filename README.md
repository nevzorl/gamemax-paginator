<div align="center" markdown=1>
	<p align="center"><img width=45% src="https://media.discordapp.net/attachments/704388319039193122/793900778149511168/reminder_1.png?width=1001&height=282"></p>
	<strong>Lightweight and very smooth page builder for your bots (discord.js)</strong>
	<br>Check out plugin initialization and configuration below!<br>
	<p></p>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[![node.js](https://img.shields.io/badge/node.js-v14-brightgreen)](https://nodejs.org/)
[![Star](https://img.shields.io/badge/-Give%20this%20repo%20a%20star!-yellow)](https://github.com/nevzorl/gamemax-paginator)
[![Discord](https://img.shields.io/discord/732115887246671913?color=8697F6&label=Discord&logo=as&logoColor=%238697F6)](https://discord.gg/RPb2KXN)
[![Donate](https://img.shields.io/badge/donate-%241-orange)](https://www.donationalerts.com/r/reedi)
<p align="center">Click on a badge to learn more.</p>

<p align="center">
  <a href="#%EF%B8%8F-plugin-installation">Installation</a> •
  <a href="/archive/main.zip">Download</a> •
  <a href="#-example-to-use">How to use?</a> •
  <a href="#-plugin-customization">Customization</a>
</p>

## ♻️ Plugin installation:
<img align="right" width="200" height="200" src="https://media.discordapp.net/attachments/704388319039193122/793900776988082186/1.png"> 

Plugin initialization looks like this:
```js
const plugin = require("gamemax.paginator");

[...]
```

You can initialize the plugin to a global variable, which makes the plugin more accessible to you.

```js
require("gamemax.paginator").init(<object>); // Specify your variable (object)

// After that, the plugin will be available along this path:
new <object>.paginator()
```

You can also change the name of the element, for example:

```js
require("gamemax.paginator").init(<object>, "example");

// After that, the plugin will be available along this path:
new <object>.example()
```



## ❓ Example to use: 

```js
const plugin = require("gamemax.paginator");
const page = new plugin(message.author.id); // Collector filter.

page.add("Hello"); // You can also specify an array with text: page.add([ "Hello", "Hello 2", etc. ]);
page.create(message.channel); // send message
```


## 🔓 Plugin customization:
You can customize the plugin by adding your own emoji, functions, and custom checks.
```js
new plugin(message.author.id, [
    { emoji: "📌", execute: (channel) => channel.send("This is custom reaction!"), rules: null, imports: [message.channel] },
    { emoji: "", execute: (text) => console.log(text), rules: "1 > 0", imports: ["This text will be printed to the console."] }
    /* etc.. */
]);
```

**And so, let's now tell you in detail what is responsible for what.**

* `emoji` - Emoji that will be placed and perform your further action.

* `execute` - The function that will execute when you click on your 'custom' reaction.

* `rules` - Hmm.. what is it? These are the checks that will execute your functions. For example, if you do this: `1 > 0` then the function will be executed. If you do `0 > 1`, then the function will not be executed, because the check returns `false`. This is just an example, you can do your own checks, for example `!member` or `isNaN(1r)` and etc..

* `imports` - Required parameters to run the function. They must be in an array or you will get an error. For example, in the `execute` parameter you want something to be displayed in the console. We indicate callback in `execute` example `text` and in the imports we include our text `["Hello bro"]`


**❗️❗️ Attention. The custom functions are very sensitive. Therefore, if you do not want to specify anything in the parameter, use `<emoji / execute / rules / imports>: null` to avoid getting errors!**