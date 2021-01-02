let EventEmitter = require('events');

class Pages extends EventEmitter {
    constructor(userID = "", custom = [], timeout = 60000){
        super();
        if(userID.length < 1) throw new Error("Specify the user ID for the collector filter.");
        this.custom = custom;
        this.userID = userID;
        this.timeout = timeout;
        this.pages = [];
        this.selectPage = 0;
    }

    add(page){
        if(typeof page == 'object') this.pages = this.pages.concat(page);
        else this.pages.push(page);
    }

    update(page){
        this.selectPage = page || 0;
        this.message.edit(this.pages[page || 0]).catch(err => {});
        this.emit("update", {
            page: this.selectPage,
            pages: this.pages.length - 1,
            text: this.pages[page || 0],
        })
    }

    async create(channel){
        const message = await channel.send(this.pages[0]).catch(err => {});
        this.message = message;
        this.message.page = 0;
        this.collector = await this.createCollector(this.message);
        this.reactions = [ 
            { emoji: '⏪', execute: () => this.update(0) }, 
            { emoji: '⬅', execute: () => this.update(this.selectPage - 1), rules: "this.selectPage !== 0" }, 
            { emoji: '⏸', execute: () => { this.message.reactions.removeAll().catch(err => {}); this.message.delete().catch(err => {}); this.collector.stop(); } }, 
        ];
        this.reactions = this.reactions.concat(this.custom, [
            { emoji: '➡', execute: () => this.update(this.selectPage + 1), rules: "this.selectPage !== this.pages.length - 1" }, 
            { emoji: '⏩', execute: () => this.update(this.pages.length - 1) }, 
        ]);
        await this.react(this.message);
        return message;
    }

    // 

    async createCollector(message){
        const collector = message.createReactionCollector((_, user) => user.id === this.userID, { time: this.timeout });
        collector.on("collect", async(r) => {
            for(let i = 0; i < this.reactions.length; i++) {
                let { emoji, execute, imports, rules, } = this.reactions[i];
                if(rules ? (r.emoji.name == emoji) && (eval(rules)) : r.emoji.name == emoji) execute(...imports || []);
            }
            r.users.remove(this.userID).catch(() => {});
        });
        return collector;
    }
    
    async react(message){
        for(let i = 0; i < this.reactions.length; i++) {
            let { emoji, execute } = this.reactions[i];
            if(!emoji || !execute) continue;
            message.react(emoji).catch(err => {});
        }
        return true;
    }
}

module.exports = Pages