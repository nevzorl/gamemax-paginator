class Pages {
    constructor(userID = "", custom = [], timeout = 60000){
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
    }

    async create(channel){
        const message = await channel.send(this.pages[0]).catch(err => {});
        this.message = message;
        this.collector = await this.createCollector(this.message);
        this.reactions = [ 
            { first: '⏪', execute: () => this.update(0) }, 
            { back: '⬅', execute: () => this.update(this.selectPage - 1), rules: "this.selectPage !== 0" }, 
            { stop: '⏸', execute: () => { this.message.reactions.removeAll().catch(err => {}); this.message.delete().catch(err => {}); this.collector.stop(); } }, 
        ];
        this.reactions = this.reactions.concat(this.custom, [
            { next: '➡', execute: () => this.update(this.selectPage + 1), rules: "this.selectPage !== this.pages.length - 1" }, 
            { last: '⏩', execute: () => this.update(this.pages.length - 1) }, 
        ]);
        await this.react(this.message);
        return message;
    }

    // 

    async createCollector(message){
        const collector = message.createReactionCollector((_, user) => user.id === this.userID, { time: this.timeout });
        collector.on("collect", async(r) => {
            for(let i = 0; i < this.reactions.length; i++) {
                let arr = Object.values(this.reactions[i]);
                if(arr[2] ? (r.emoji.name == arr[0]) && (eval(arr[2])) : r.emoji.name == arr[0]) arr[1](...arr[3] || []);
            }
            r.users.remove(this.userID).catch(() => {});
        });
        return collector;
    }
    
    async react(message){
        for(let i = 0; i < this.reactions.length; i++) {
            if(!Object.values(this.reactions[i])[0] || !Object.values(this.reactions[i])[1]) continue;
            message.react(Object.values(this.reactions[i])[0]).catch(err => {});
        }
        return true;
    }
}

module.exports = Pages;