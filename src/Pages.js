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

        this.started = false;
    }

    select(pageNumber = 0){
        if(this.started == true) throw new Error("This method can only be used before creating pages.")
        if(this.pages.length <= 0) throw new Error("Add one or more pages to use this method.")
        if(!this.pages[pageNumber - 1]) pageNumber = 0;
            else pageNumber = pageNumber - 1;

        this.emit("select", { selected: pageNumber, text: this.pages[pageNumber] });
            
        this.selectPage = pageNumber;
            return true;
    }

    add(page){
        if(typeof page == 'object') this.pages = this.pages.concat(page);
        else this.pages.push(page);
        this.emit("add", page);
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
        if(this.pages.length <= 0) throw new Error("Add at least one page for the module to work correctly.");

        this.started = true;
        const message = await channel.send(this.pages[this.selectPage]).catch(err => {});
        this.message = message;
        this.collector = await this.createCollector(this.message);
        this.reactions = [ 
            { emoji: '⏪', execute: () => this.update(0) }, 
            { emoji: '⬅', execute: () => this.update(this.selectPage - 1), rules: "this.selectPage !== 0" }, 
            { emoji: '⏸', execute: () => this.end(this.message, this.collector) }, 
        ];
        this.reactions = this.reactions.concat(this.custom, [
            { emoji: '➡', execute: () => this.update(this.selectPage + 1), rules: "this.selectPage !== this.pages.length - 1" }, 
            { emoji: '⏩', execute: () => this.update(this.pages.length - 1) }, 
        ]);

        await this.react(this.message); 

        this.emit("create", { message: this.message, collector: this.collector });
            return message;
    }

    end(m, c) {
        m.reactions.removeAll().catch(err => {}); c.stop(); m.delete().catch(err => {});
        this.emit("end", true);
    }

    // 

    async createCollector(message){
        const collector = message.createReactionCollector((_, user) => user.id === this.userID, { time: this.timeout });
        collector.on("collect", async(r) => {
            for(let i = 0; i < this.reactions.length; i++) {
                let { emoji, execute, imports, rules } = this.reactions[i];
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
