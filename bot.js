//Packages
var Discord = require('discord.js');
var logger = require('winston');
var moment = require('moment');
var fs = require('fs');

//Files
var auth = require('./auth.json');
var commandList = require('./commands.json');
var greetingList = require('./greetings.json');
var images = require('./imageList.js');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client();

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
    bot.user.setActivity('!dongbot help', { type: "LISTENING" });
});

var banList = [];

bot.on('message', message => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.content.startsWith('!dongbot') && message.author.username !== 'Dong Bot') {

        let command = message.content.replace('!dongbot ', '');
        let rawdata, ccc, hehCount;
        if (banList.includes(message.author.username)) {
            message.channel.send('*You are banned.*');
        }
        else {
            if (message.content.includes(commandList.commands[0])) {            // commands
                message.channel.send(`*Here is a current list of every command you can ask me:*\`\`\`${commandList.commands.map(c => '\n' + c)}\`\`\``);
            }
            else if (message.content.includes(commandList.commands[1])) {       // ping
                message.channel.send(`*Pong!*`);
            }
            else if (message.content.includes(commandList.commands[2])) {       // hello
                message.channel.send(`*Hello, ${message.author.username}!*`)
            }
            else if (message.content.includes(commandList.commands[3])) {       // what day is it?
                moment().format('dddd') === 'Wednesday' ? message.channel.send(`__***It is ${moment().format('dddd')} my dudes.***__`, { file: images["mydudes"] })
                    : message.channel.send(`*It is ${moment().format('dddd')}.*`);
            }
            else if (message.content.includes(commandList.commands[4])) {       // garth
                ccc = JSON.parse(fs.readFileSync('./cokecappcount.json'));
                message.channel.send("Coke: " + ccc.coke + "\nCapp: " + ccc.capp, { file: images["garth"] })
            }
            else if (message.content.includes(commandList.commands[5])) {       // +1 coke
                ccc = JSON.parse(fs.readFileSync('./cokecappcount.json'));
                ccc.coke += 1;
                fs.writeFileSync('./cokecappcount.json', JSON.stringify(ccc));
                message.channel.send("Coke: " + ccc.coke + "\nCapp: " + ccc.capp)
            }
            else if (message.content.includes(commandList.commands[6])) {       // +1 capp
                ccc = JSON.parse(fs.readFileSync('./cokecappcount.json'));
                ccc.capp += 1;
                fs.writeFileSync('./cokecappcount.json', JSON.stringify(ccc));
                message.channel.send("Coke: " + ccc.coke + "\nCapp: " + ccc.capp)
            }
            else if (message.content === commandList.commands[7]) {             // !dongbot
                message.channel.send(greetingList.greetings[Math.floor(Math.random() * greetingList.greetings.length)].replace('user', message.author.username));
            }
            else if (command === commandList.commands[8]) {                     // backlog
                rawdata = JSON.parse(fs.readFileSync('./backlog.json'));
                message.channel.send(`*Here is a current list of planned enhancements:*\`\`\`${rawdata.enhancements.join("\n")}\`\`\``);
            }
            else if (command.includes(commandList.commands[9])) {               // backlog add
                let newBacklogItem = command.replace(commandList.commands[9] + ' ', '');
                if (newBacklogItem !== commandList.commands[9]) {
                    rawdata = JSON.parse(fs.readFileSync('./backlog.json'));
                    rawdata.enhancements.push(newBacklogItem)
                    fs.writeFileSync('./backlog.json', JSON.stringify(rawdata));
                    message.channel.send(`*Added to the backlog!*`);
                } else {
                    message.channel.send(`*Invalid input. Use format:* \n\`\`\`!dongbot backlog add [item]\`\`\``);
                }
            }
            else if (command.includes(commandList.commands[10])) {              // peer mentor
                let peerMentorName = command.replace(commandList.commands[10] + ' ', '');
                let mentorAndWeek;
                if (peerMentorName !== commandList.commands[10]) {
                    mentorAndWeek = getPeerMentorSchedule(peerMentorName);
                    if (!mentorAndWeek.singlePeerMentor) {
                        message.channel.send(`*Cannot find ${peerMentorName}.*`)
                    } else {
                        message.channel.send(`*${capitalizeFirstLetter(peerMentorName)} is scheduled to peer mentor on ${mentorAndWeek.singlePeerMentor}.*`)
                    }
                } else {
                    mentorAndWeek = getPeerMentorSchedule();
                    message.channel.send(`*The next peer mentoring session is on ${moment(mentorAndWeek.week).format('MMM Do')}, and the mentors are ${mentorAndWeek.mentors}.*`);
                }
            }
            else if (message.content.includes(commandList.commands[11])) {       // -1 coke
                ccc = JSON.parse(fs.readFileSync('./cokecappcount.json'));
                ccc.coke -= 1;
                fs.writeFileSync('./cokecappcount.json', JSON.stringify(ccc));
                message.channel.send("Coke: " + ccc.coke + "\nCapp: " + ccc.capp);
            }
            else if (message.content.includes(commandList.commands[12])) {       // -1 capp
                ccc = JSON.parse(fs.readFileSync('./cokecappcount.json'));
                ccc.capp -= 1;
                fs.writeFileSync('./cokecappcount.json', JSON.stringify(ccc));
                message.channel.send("Coke: " + ccc.coke + "\nCapp: " + ccc.capp);
            }
            else if (message.content.includes(commandList.commands[13])) {      // .die()
                message.channel.send("Heh. Heh. Heh. .DIE()", { file: images["seppuku"] });
                if (message.author.username = "DongoDB") {

                    setTimeout(function afterTwoSeconds() {
                        bot.destroy();
                        throw new Error("I am dead");
                    }, 2000)
                }
            }
            else if (command === commandList.commands[14]) {               // heh
                hehCount = JSON.parse(fs.readFileSync('./hehcount.json'));
                let hehs = '';
                for (i = 0; i < hehCount.heh; ++i) {
                    hehs += 'heh '
                }
                message.channel.send('' + hehs, { tts: true });
            }
            else if (message.content.includes(commandList.commands[15])) {               // +1 heh
                hehCount = JSON.parse(fs.readFileSync('./hehcount.json'));
                const newHeh = parseInt(command.replace(commandList.commands[15], ''));
                hehCount.heh += newHeh;
                fs.writeFileSync('./hehcount.json', JSON.stringify(hehCount));
                message.channel.send("Darryl's heh: " + hehCount.heh);
            }



            else if (command === 'posty toasty') {
                message.channel.send(`*heh heh heh want some cank? heh heh heh*`, { tts: true });
            } else if (command === 'what is love?') {
                message.channel.send(`*Baby don't hurt me! :kissing_heart:*`);
            }
            else {                                                              // unknown command
                message.channel.send(`*I don't know what that is* :thinking:`);
            }
        }

        // TODO: Reddit lookup
    }
});

function getPeerMentorSchedule(peerMentor = '') {
    let currDay = moment().format('MM/DD/YYYY');
    let nextWeek = moment().add(1, 'week').format('MM/DD/YYYY');
    let schedule = JSON.parse(fs.readFileSync('./schedule.json'));
    let thisWeekFlag = false;

    let thisMentorWeek;
    let mentorsThisWeek = [];
    let mentorDates = [];
    peerMentor = peerMentor.toLowerCase();

    schedule.weeks.forEach(week => {
        let thisWeek = moment(week.w).format('MM/DD/YYYY')
        if (moment(thisWeek).isBetween(moment(currDay), moment(nextWeek)) || moment(thisWeek).isSame(currDay) || moment(thisWeek).isSame(moment(nextWeek)) && !thisWeekFlag) {
            thisMentorWeek = week.w;
            thisWeekFlag = true;
        }
    });
    schedule.mentors.forEach(e => {
        e.dates.forEach(d => {
            if (d === thisMentorWeek) {
                mentorsThisWeek.push(e.name);
            }
        })
    });

    if (peerMentor) {
        schedule.mentors.forEach(mentor => {
            if (mentor.name.toLowerCase() === peerMentor) {
                mentor.dates.forEach(d => {
                    mentorDates.push(moment(d).format('MMM Do'));
                })
            }
        })
    }
    return { mentors: mentorsThisWeek, week: thisMentorWeek, singlePeerMentor: mentorDates }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

bot.login(auth.token);