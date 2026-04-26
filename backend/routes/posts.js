const express = require("express");
const router = express.Router();
const db = require("../database/db");

const scheduler = require("../services/scheduler");
const publisher = require("../services/publisher");
const { generateCaption } = require("../services/ai");

// ✅ Create Post
router.post("/", (req, res) => {
    try {
        let { content, platforms, scheduledAt } = req.body;

        if (!content || !platforms || platforms.length === 0) {
            return res.status(400).json({ error: "Content and platforms are required" });
        }

        const finalContent = generateCaption(content);
        const status = scheduledAt ? "Scheduled" : "Posted";

        const result = db.prepare(`
            INSERT INTO posts (content, status, scheduled_at, created_at)
            VALUES (?, ?, ?, datetime('now'))
        `).run(finalContent, status, scheduledAt);

        const postId = result.lastInsertRowid;

        platforms.forEach(p => {
            db.prepare(`
                INSERT INTO post_platforms (post_id, platform, status)
                VALUES (?, ?, ?)
            `).run(postId, p, status);
        });

        const post = {
            id: postId,
            content: finalContent,
            scheduled_at: scheduledAt
        };

        if (scheduledAt) {
            scheduler.schedulePost(post);
        } else {
            publisher.publishPost(post);
        }

        res.json({
            message: "Post processed successfully",
            postId
        });

    } catch (err) {
        console.error("POST ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});


// ✅ Get Posts
router.get("/", (req, res) => {
    try {
        const posts = db.prepare(`SELECT * FROM posts`).all();
        const mappings = db.prepare(`SELECT * FROM post_platforms`).all();

        const result = posts.map(post => ({
            ...post,
            platforms: mappings.filter(m => m.post_id === post.id)
        }));

        res.json(result);
    } catch (err) {
        console.error("GET ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});


// ✅ Logs
router.get("/logs", (req, res) => {
    try {
        const logs = db.prepare(`
            SELECT * FROM logs ORDER BY created_at DESC
        `).all();

        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ✅ Platforms
router.get("/platforms", (req, res) => {
    res.json(["twitter", "linkedin"]);
});


// ✅ Retry
router.post("/retry/:postId", (req, res) => {
    try {
        const post = db.prepare(`
            SELECT * FROM posts WHERE id = ?
        `).get(req.params.postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        publisher.publishPost(post);
        res.json({ message: "Retry triggered" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ✅ Delete
router.delete("/:id", (req, res) => {
    try {
        db.prepare(`DELETE FROM post_platforms WHERE post_id = ?`)
          .run(req.params.id);

        db.prepare(`DELETE FROM posts WHERE id = ?`)
          .run(req.params.id);

        res.json({ message: "Post deleted" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;