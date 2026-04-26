const express = require("express");
const router = express.Router();
const db = require("../database/db");

const scheduler = require("../services/scheduler");
const publisher = require("../services/publisher");
const { generateCaption } = require("../services/ai"); // 🔥 AI feature

// ✅ Create Post
router.post("/", (req, res) => {
    let { content, platforms, scheduledAt } = req.body;

    // 🛑 Validate input
    if (!content || !platforms || platforms.length === 0) {
        return res.status(400).json({ error: "Content and platforms are required" });
    }

    // 🔥 AI caption enhancement
    const finalContent = generateCaption(content);

    const status = scheduledAt ? "Scheduled" : "Posted";

    db.run(
        `INSERT INTO posts (content, status, scheduled_at, created_at)
         VALUES (?, ?, ?, datetime('now'))`,
        [finalContent, status, scheduledAt],
        function (err) {
            if (err) return res.status(500).send(err);

            const postId = this.lastID;

            // ✅ Insert multiple platforms
            platforms.forEach(p => {
                db.run(
                    `INSERT INTO post_platforms (post_id, platform, status)
                     VALUES (?, ?, ?)`,
                    [postId, p, status]
                );
            });

            const post = {
                id: postId,
                content: finalContent,
                scheduled_at: scheduledAt
            };

            // ✅ Scheduling vs instant publish
            if (scheduledAt) {
                scheduler.schedulePost(post);
            } else {
                publisher.publishPost(post);
            }

            res.json({
                message: "Post processed successfully",
                postId
            });
        }
    );
});


// ✅ Get Posts (with platform status)
router.get("/", (req, res) => {
    db.all(`SELECT * FROM posts`, (err, posts) => {
        if (err) return res.status(500).send(err);

        db.all(`SELECT * FROM post_platforms`, (err, mappings) => {
            if (err) return res.status(500).send(err);

            const result = posts.map(post => ({
                ...post,
                platforms: mappings.filter(m => m.post_id === post.id)
            }));

            res.json(result);
        });
    });
});


// ✅ Get Logs
router.get("/logs", (req, res) => {
    db.all(`SELECT * FROM logs ORDER BY created_at DESC`, (err, rows) => {
        if (err) return res.status(500).send(err);
        res.json(rows);
    });
});

router.get("/platforms", (req, res) => {
    res.json(["twitter", "linkedin"]);
});

// 🔥 Retry Failed Post
router.post("/retry/:postId", (req, res) => {
    const postId = req.params.postId;

    db.get(`SELECT * FROM posts WHERE id = ?`, [postId], (err, post) => {
        if (err || !post) {
            return res.status(404).json({ error: "Post not found" });
        }

        publisher.publishPost(post);

        res.json({ message: "Retry triggered" });
    });
});

router.delete("/:id", (req, res) => {
    const postId = req.params.id;

    db.run(`DELETE FROM post_platforms WHERE post_id = ?`, [postId]);

    db.run(`DELETE FROM posts WHERE id = ?`, [postId], function (err) {
        if (err) return res.status(500).send(err);

        res.json({ message: "Post deleted" });
    });
});
module.exports = router;