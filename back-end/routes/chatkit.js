var Chatkit = require('@pusher/chatkit-server');

const chatkit = new Chatkit.default({
    instanceLocator: 'v1:us1:f3854d62-ebf2-4ee2-8a48-c62ed279fa8f',
    key: 'b882bfa4-0f26-4b68-859f-c88f9e05e53b:cwsQf3Ige8SyHxKptGlRzUCjngXh8yDRX4x7NQSZWuo='
});

module.exports = chatkit;
