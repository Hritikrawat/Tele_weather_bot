const TelegramBot= require("node-telegram-bot-api");
const axios = require("axios");
const token = "8159083368:AAFyOLfPd9ae_r6HKGLLZlv-RCoc0lYGwSo";


const bot = new TelegramBot(token,{polling:true});


bot.onText(/\/start/i,(msg) => {
    const chatId = msg.chat.id;
    const userName = msg.chat.first_name || "there";
    const welcomeMessage = `Hello , ${userName} ! Welcome to weather bot. Please enter a city name to get current weather condition`;
    bot.sendMessage(chatId,welcomeMessage);
})

bot.onText(/\/commands/,(msg)=>{
    const chatId = msg.chat.id;
    const commandList = `
    /start - Start interacting with the bot
/stop - Stop the bot
/forecast city_name - Get the 3-day weather forecast for a city
/commands - Show this list of available commands`;
    bot.sendMessage(chatId,commandList);
})



bot.onText(/\/stop/i, (msg) => {
    const chatId = msg.chat.id;
    const farewellMessage = `See you next time!`;
    bot.sendMessage(chatId, farewellMessage);
});


bot.onText(/\/forecast/, async (msg) => {
    const chatId = msg.chat.id;
    const userInput = msg.text.split(" ")[1]; // Taking city input after /forecast

    if (!userInput) {
        return bot.sendMessage(chatId, "Please provide a city name like this: /forecast city_name");
    }

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&appid=b0f8dc6d2c58bc6e1cb5cbe79e038922`);
        const data = response.data;

        let forecastMessage = `3-Day Forecast for ${data.city.name}:\n`;
        for (let i = 0; i < 3; i++) {
            const forecast = data.list[i * 8]; // Taking data every 24 hours (3 * 8 = 24 hours)
            const date = new Date(forecast.dt_txt).toDateString();  
            const weather = forecast.weather[0].description;
            const temperature = (forecast.main.temp - 273.15).toFixed(2);
            forecastMessage += `${date}: ${weather}, ${temperature}°C\n`;
        }

        bot.sendMessage(chatId, forecastMessage);
    }
     catch (error) {
        bot.sendMessage(chatId, "City doesn't exist or forecast not available.");
    }
});


bot.on("message",async(msg) =>
    {
    const chatId = msg.chat.id;
    const userInput =     msg.text.toLocaleLowerCase();

    if (userInput.startsWith('/')) {
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

