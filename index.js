const TelegramApi = require('node-telegram-bot-api')

const {gameOptions, againOptions} = require('./options')

const token = '5169035085:AAFmFG0PmDnjkUhMfNFQi_USY0jsCF0vLNw'

const bot = new TelegramApi(token, {polling : true})

const chats = {}

const startGame = async (chatId) =>{
    await bot.sendMessage(chatId, 'I guess 0-9 number')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'guess it!', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Invite message'},
        {command: '/info', description: 'Info message'},
        {command: '/game', description: 'Guess game'},
    ])
    
    bot.on( 'message' , async msg => {
        const text = msg.text
        const chatId = msg.chat.id
    
        //bot.sendMessage(chatId, `You wrote to me ${text}`)
        //console.log(msg)
    
        if(text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/3.webp')
            return bot.sendMessage(chatId, 'Welcome')
        }
        if(text === '/info'){
            return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if(text === '/game'){
            return startGame(chatId)
        }
        console.log(msg)
        return bot.sendMessage(chatId, 'Unknown command, try again')
        
    })
    
    bot.on('callback_query', async msg => {
        //console.log(msg)
        const data  = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again'){
           return startGame(chatId)
        }
        if (data === chats[chatId]){
            return bot.sendMessage(chatId, `Congratulations, you guesed number ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `You missed. the guesed number is ${chats[chatId]}`, againOptions)
        }

        //bot.sendMessage(chatId, `You chose number ${data}`)
    } )
}

start()