# FinTech pizza order & maker chatbot


This project was made for the 2nd FinTech Adrian hackathlon in 2016 oct 15-16.
Made by @lintaba, and the team of the wookies.
 Organized in Slovenia by Halcom, and many sponsors.

## State

The time was not enough to create a fully functional and full-capable chat-bot,
 so we focused on the basic functional. It can interpret a few basic
 commands, and most of the behavior are coming from the prebuilt quick reply
possibilities.
Please consider that most of the code was written by coffee. Its merely a
 concept and tech demo. Do not use in production. Feel free to use for
 educational purposes.


Our project was to create a pizza-orderer chatbot. It works with
 Facebook messenger, and using simple regular expressions, simple state
 transitions and context for the users.


## Installation

```
npm install
```


## Usage
 * Follow the instructions from [messenger-bot](https://github.com/remixz/messenger-bot)
 * Configure config.json with the necesery tokens and ports
 * Set it up to accept the facebook url hooks. (We used [localtunnel](http://google.com/search?q=localtunnel),
   but it can also be deployed eg. to the cloud.)
 * When the linking to facebook is ready, you can write to the bot, and it will respond with *Welcome*.
