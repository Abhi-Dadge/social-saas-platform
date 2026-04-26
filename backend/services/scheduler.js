const db = require("../database/db");
const publisher = require("./publisher");

// ✅ For future scheduling (optional)
function schedulePost(post) {
    console.log("Post scheduled:", post.id);
}

// ✅ THIS is required (your error fix)
function checkScheduledPosts() {
    try {
        const posts = db.prepare(`
            SELECT * FROM posts
            WHERE status = 'Scheduled'
            AND scheduled_at <= datetime('now')
        `).all();

        posts.forEach(post => {
            console.log("⏰ Publishing scheduled post:", post.id);

            // publish
            publisher.publishPost(post);

            // update main post
            db.prepare(`
                UPDATE posts SET status = 'Posted' WHERE id = ?
            `).run(post.id);

            // update platforms
            db.prepare(`
                UPDATE post_platforms SET status = 'Posted' WHERE post_id = ?
            `).run(post.id);
        });

    } catch (err) {
        console.error("Scheduler error:", err);
    }
}

module.exports = {
    schedulePost,
    checkScheduledPosts   // ✅ VERY IMPORTANT
};