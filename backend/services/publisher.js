const db = require("../database/db");
const { getPlatform } = require("./platformFactory");

function publishPost(post) {
    db.all(
        `SELECT * FROM post_platforms WHERE post_id = ?`,
        [post.id],
        (err, platforms) => {
            if (err) {
                console.log(err);
                return;
            }

           platforms.forEach(p => {
    try {
        const platformService = getPlatform(p.platform);

        console.log(`🚀 Posting to ${p.platform}`);
        platformService.publish(post);

        db.run(
            `UPDATE post_platforms SET status = ? WHERE id = ?`,
            ["Posted", p.id]
        );

        // ✅ LOG SUCCESS
        db.run(
            `INSERT INTO logs (post_id, platform, message, created_at)
             VALUES (?, ?, ?, datetime('now'))`,
            [post.id, p.platform, "Posted successfully"]
        );

    } catch (e) {
        console.log("❌ Failed:", e.message);

        db.run(
            `UPDATE post_platforms SET status = ? WHERE id = ?`,
            ["Failed", p.id]
        );

        // ❌ LOG FAILURE
        db.run(
            `INSERT INTO logs (post_id, platform, message, created_at)
             VALUES (?, ?, ?, datetime('now'))`,
            [post.id, p.platform, "Failed: " + e.message]
        );
    }
});
            // Update main post status
            db.run(
                `UPDATE posts SET status = ? WHERE id = ?`,
                ["Posted", post.id]
            );

            console.log("✅ Post processing completed");
        }
    );
}

// 🔥 VERY IMPORTANT (this was your error)
module.exports = { publishPost };