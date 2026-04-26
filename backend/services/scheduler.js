const publisher = require("./publisher");

function schedulePost(post) {
    const delay = new Date(post.scheduled_at) - new Date();

    if (delay > 0) {
        setTimeout(() => {
            console.log("⏰ Running scheduled post:", post.id);
            publisher.publishPost(post);
        }, delay);
    }
}

module.exports = { schedulePost };