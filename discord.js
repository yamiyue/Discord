const Discord = require('discord.js');
const { token } = require('./token.json');
const { JYQAQ } = require('./config.json');
const client = new Discord.Client();


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
	
	if (msg.content === 'what is my avatar') {
		// Send the user's avatar URL
		msg.reply(msg.author.displayAvatarURL());
	}
	
	if (msg.content === 'username') {
		msg.reply(msg.author.avatar);
	}
	
	if (msg.author.avatar === JYQAQ ) {
		if (msg.content.includes('嗨')){
			msg.reply("嗨");
		}
		if(msg.content.includes('打架')){
			msg.reply("來打架啊");
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

client.login(token);