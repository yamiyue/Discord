const Discord = require('discord.js');
const { token } = require('./token.json');
const { JYQAQ } = require('./config.json');

// for database
const fs = require('fs');
const fileName = './database.json';
const file = require(fileName);

// for music
const ytdl = require('ytdl-core');
const { prefix } = require('./prefix.json');

const client = new Discord.Client();

var regex = new RegExp('[\u3105-\u3129]');


//	music class
class Music {

    constructor() {
        this.isPlaying = false;
        this.queue = {};
        this.connection = {};
        this.dispatcher = {};
    }

    async join(msg) {

        // Bot 加入語音頻道
        this.connection[msg.guild.id] = await msg.member.voice.channel.join();
		msg.channel.send('機器人加入頻道惹');

    }

    async play(msg) {

        // 語音群的 ID
        const guildID = msg.guild.id;

        // 如果 Bot 還沒加入該語音群的語音頻道
        if (!this.connection[guildID]) {
            msg.channel.send('請先加入頻道');
            return;
        }

        // 處理字串，將 !!play 字串拿掉，只留下 YouTube 網址
        const musicURL = msg.content.replace(`${prefix}play`, '').trim();

        try {

            // 取得 YouTube 影片資訊
            const res = await ytdl.getInfo(musicURL);
            const info = res.videoDetails;

            // 將歌曲資訊加入隊列
            if (!this.queue[guildID]) {
                this.queue[guildID] = [];
            }

            this.queue[guildID].push({
                name: info.title,
                url: musicURL
            });

            // 如果目前正在播放歌曲就加入隊列，反之則播放歌曲
            if (this.isPlaying) {
                msg.channel.send(`歌曲加入隊列：${info.title}`).then(msg => {
					msg.delete({ timeout: 3000 })
				}).catch(/*Your Error handling if the Message isn't returned, sent, etc.*/);;
            } else {
                this.isPlaying = true;
                this.playMusic(msg, guildID, this.queue[guildID][0]);
				this.queue[guildID].shift();
            }
			msg.delete({ timeout: 1000 });
        } catch(e) {
            console.log(e);
        }

    }

    playMusic(msg, guildID, musicInfo) {

        // 提示播放音樂
        msg.channel.send(`播放音樂：${musicInfo.name}`);
        // 播放音樂
        this.dispatcher[guildID] = this.connection[guildID].play(ytdl(musicInfo.url, { filter: 'audioonly' }));

        // 把音量降 50%，不然第一次容易被機器人的音量嚇到 QQ
        this.dispatcher[guildID].setVolume(0.5);

        // 移除 queue 中目前播放的歌曲
        //this.queue[guildID].shift();

        // 歌曲播放結束時的事件
        const self = this;
        this.dispatcher[guildID].on('finish', () => {

            // 如果隊列中有歌曲
            if (self.queue[guildID].length > 0) {
                self.playMusic(msg, guildID, self.queue[guildID].shift());
            } else {
                self.isPlaying = false;
                msg.channel.send('目前沒有音樂了，請加入音樂 :D');
				
            }

        });

    }

    resume(msg) {

        if (this.dispatcher[msg.guild.id]) {
            msg.channel.send('恢復播放');

            // 恢復播放
            this.dispatcher[msg.guild.id].resume();
        }

    }

    pause(msg) {

        if (this.dispatcher[msg.guild.id]) {
            msg.channel.send('暫停播放');

            // 暫停播放
            this.dispatcher[msg.guild.id].pause();
        }

    }

    skip(msg) {

        if (this.dispatcher[msg.guild.id]) {
            msg.channel.send('跳過目前歌曲');

            // 跳過歌曲
            this.dispatcher[msg.guild.id].end();
        }

    }

    nowQueue(msg) {

        // 如果隊列中有歌曲就顯示
        if (this.queue[msg.guild.id] && this.queue[msg.guild.id].length > 0) {
            // 字串處理，將 Object 組成字串
            const queueString = this.queue[msg.guild.id].map((item, index) => `[${index+1}] ${item.name}`).join('\n');
            msg.channel.send(queueString);
        } else {
            msg.channel.send('目前隊列中沒有歌曲');
        }

    }

    leave(msg) {

        // 離開頻道
        this.connection[msg.guild.id].disconnect();

    }
}

const music = new Music();



// 連上線時的事件
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// 當 Bot 接收到訊息時的事件
client.on('message', msg => {
	
	if (msg.content === '沒被打過') {
        msg.reply('來打架咩');
    }
	
	if (msg.content.includes('小公主')) {
        msg.reply('Error!');
    }
	
	if (msg.content === 'QAQ') {
        msg.reply('哈哈哈哈哈');
    }
	
	if (msg.content === 'what is my avatar') {
		msg.reply(msg.author.displayAvatarURL());
	}
	
	if (msg.content === 'username') {
		msg.reply(msg.author.avatar);
	}
	
	if (msg.author.id === JYQAQ ) {
		if (msg.content.includes('嗨')){
			msg.reply("嗨");
		}
		if(msg.content.includes('打架')){
			msg.reply("來打架啊");
		}
		if(msg.content.includes('封印')){
			msg.reply("沒被封印過是不是",{files: ["https://i.imgur.com/i5pm8Am.jpg"]}); // hammer
		}
		
		if (msg.content.includes('我') && msg.content.includes('可愛')) {
			if(msg.content.indexOf('我') < msg.content.indexOf('可愛')){
				msg.reply("Error!",{files: ["https://i.imgur.com/cFBfCaN.png"]}); //dream
			}			
		}
		if (msg.content.includes('阿伯') && msg.content.includes('布丁')) {
			msg.reply("Error!",{files: ["https://i.imgur.com/cwfECUr.jpg"]}); //cat punch
		}
		else if (msg.content.includes('阿伯')) {
			msg.reply("Error!",{files: ["https://i.imgur.com/NnTRChq.jpg"]}); //cat punch
		}	
		if (msg.content.includes('阿公')) {
			msg.reply("Error!",{files: ["https://i.imgur.com/cwfECUr.jpg"]}); //cat punch
		}
		
		
		if (msg.content.includes('不') && msg.content.includes('要臉')) {
			if(msg.content.indexOf('不') < msg.content.indexOf('要臉')){
				msg.reply("Error!",{files: ["https://i.imgur.com/NnTRChq.jpg"]}); //cat punch
			}			
		}
		
		if (msg.content.includes('just like me')) {
			msg.reply("Error!",{files: ["https://i.imgur.com/cFBfCaN.png"]}); //dream
		}
		
		if (msg.content.includes('麻吉')) {
			msg.reply("麻吉麻吉");
		}		
		
		if (msg.content.includes('叔叔')) {
			msg.reply(":axe:");
		}
		
		if(regex.exec(msg.content)){
			file.numofPhoneticUsed+=1;
			fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
			  if (err) return msg.reply(err);
			});
			msg.reply("璃兒已使用注音文"+ file.numofPhoneticUsed + "次");
		}
		
		if (msg.content.includes('沒事') && !msg.content === '沒事就好') {
			msg.reply("沒事就好");
		}
		
		if (msg.content.includes('沒關係啊')) {
			msg.reply("沒事啦 麻吉麻吉");
		}
	}
	/*
	if (msg.content === 'show last bot msg') {
		const botuser = client.user;	
		const lastMessage = botuser.lastMessage;
		if (!lastMessage) 
			return msg.channel.send('No messages from this user found.');		
		msg.reply(lastMessage.content);
	}
	*/
});

// 當 Bot 接收到訊息時的事件
client.on('message', async (msg) => {

    // 如果發送訊息的地方不是語音群（可能是私人），就 return
    if (!msg.guild) return;
	
	/*
	if(msg.author.id === JYQAQ)
		return;
	*/

    // !!join
    if (msg.content === `${prefix}join`) {

        // 機器人加入語音頻道
        music.join(msg);
    }
	
    // 如果使用者輸入的內容中包含 !!play
    if (msg.content.indexOf(`${prefix}play`) > -1) {

        // 如果使用者在語音頻道中
        if (msg.member.voice.channel) {

            // 播放音樂
            await music.play(msg);
        } else {

            // 如果使用者不在任何一個語音頻道
            msg.reply('你必須先加入語音頻道');
        }
    }

    // !!resume
    if (msg.content === `${prefix}resume`) {

        // 恢復音樂
        music.resume(msg);
    }

    // !!pause
    if (msg.content === `${prefix}pause`) {

        // 暫停音樂
        music.pause(msg);
    }

    // !!skip
    if (msg.content === `${prefix}skip`) {

        // 跳過音樂
        music.skip(msg);
    }

    // !!queue
    if (msg.content === `${prefix}queue`) {

        // 查看隊列
        music.nowQueue(msg);
    }

    // !!leave
    if (msg.content === `${prefix}leave`) {

        // 機器人離開頻道
        music.leave(msg);
    }
});


client.login(token);