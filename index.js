const TelegramBot= require("node-telegram-bot-api");
const axios = require("axios");
const token = "8159083368:AAFyOLfPd9ae_r6HKGLLZlv-RCoc0lYGwSo";



const bot = new TelegramBot(token,{polling:true});


bot.onText(/\/start/,(msg) => {
    const chatId = msg.chat.id;
    const userName = msg.chat.first_name || "there";
    const welcomeMessage = `Hello , ${userName} ! Welcome to weather bot. Please enter a city name to get current weather condition`;
    bot.sendMessage(chatId,welcomeMessage);
})

bot.onText(/\/stop/, (msg) => {
    const chatId = msg.chat.id;
    const farewellMessage = `See you next time!`;
    bot.sendMessage(chatId, farewellMessage);
});

bot.on("message",async(msg) =>
    {
    const chatId = msg.chat.id;
    const userInput = msg.text;

    if (userInput === "/start" || userInput === "/stop") {
        return; // Exit the message handler if the input is /start
    }
    
   
    
    try{
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=b0f8dc6d2c58bc6e1cb5cbe79e038922`)
        const data = response.data;
        const weather = data.weather[0].description;
        const temperature = data.main.temp-273.15;
        const city = data.name;
        const humidity = data.main.humidity;
        const pressure = data.main.pressure;
        const windSpeed = data.main.pressure;
        
        const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(2)}\u00B0 C. The humidity is ${humidity}% and the pressure is ${pressure}hPa, and the wind speed is ${windSpeed}m/s`;

        bot.sendMessage(chatId,message);


    }
    catch(error)
    {
        bot.sendMessage(chatId,"City Doesn't exist.");
    }
});