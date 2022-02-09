const cron = require("node-cron");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();


const Masterkey = require("../src/models/masterkey");


const SLACK_POST_MESSAGE_ENDPOINT = "https://slack.com/api/chat.postMessage";
const everyDayAt10AM = "0 10 * * *";
const everyDayAt9AM = "0 9 * * *";


// will trigger every day at 10:00 AM
const backendTeamNotifier = cron.schedule(everyDayAt10AM, () => {
  console.log("Backend Team Notifier Initiated");
  try {
    const message = `<@U02UJ2DRTGV>, <@U02UM6H23NE>, <@U02UZM0BRDX>, <@U02UQ3KTV0T>
    Please update your card/work status and progress in this message thread ASAP :alert:
    *Note*: If there is any blocker from any team member,please notify them and get those cleared`;

    axios.post(SLACK_POST_MESSAGE_ENDPOINT, {
      channel: "#test",
      text: message,
      // eslint-disable-next-line camelcase
      icon_emoji: ":wave:"
    }, { headers: { authorization: `Bearer ${process.env.SLACK_OAUTH_KEY}` } });
  } catch (err){
    console.log(err.message);
  }
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});


// will trigger every day at 10:00 AM
const frontendTeamNotifier = cron.schedule(everyDayAt10AM, () => {
  console.log("Frontend Team Notifier Initiated");
  try {
    const message = `<@U02UKA0BG7P>, <@U02V0SCKB0R>, <@U02UKA0DX45>
    Please update your card/work status and progress in this message thread ASAP :alert:
    *Note*: If there is any blocker from any team member,please notify them and get those cleared`;

    axios.post(SLACK_POST_MESSAGE_ENDPOINT, {
      channel: "#test",
      text: message,
      // eslint-disable-next-line camelcase
      icon_emoji: ":wave:"
    }, { headers: { authorization: `Bearer ${process.env.SLACK_OAUTH_KEY}` } });
  } catch (err){
    console.log(err.message);
  }
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});


// will trigger every day at 9:00 AM
const masterKeyNotifier = cron.schedule(everyDayAt9AM, async () => {
  try {
    const hashedKey = await Masterkey.generate();
    axios.post(SLACK_POST_MESSAGE_ENDPOINT,
      {
        channel: "#test",
        text: `<!channel> Master Key for API-Testing for Production environments is \`${hashedKey}\`
        *Note*: This key can be used as password to login to any account created on the platform till we don't go live`,
        // eslint-disable-next-line camelcase
        icon_emoji: ":wave:"
      }, { headers: { authorization: `Bearer ${process.env.SLACK_OAUTH_KEY}` } });
  } catch (err){
    console.log(err.message);
  }
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});


module.exports = {frontendTeamNotifier, backendTeamNotifier, masterKeyNotifier};
