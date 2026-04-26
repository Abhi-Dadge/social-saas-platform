const express = require("express");
const router = express.Router();
const db = require("../database/db");

const scheduler = require("../services/scheduler");
const publisher = require("../services/publisher");
const { generateCaption } = require("../services/ai");


// =====================
// ✅ CREATE POST
// =====================
router.post("/", (req, res) => {
    try {
        let { content, platforms, scheduledAt } = req.body;

        // 🔴 Validation
        if (!content || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
            return res.status(400).json({
                error: "Content and platforms are required"
            });
        }

        // 🔥 AI (optional)
        const finalContent = generateCaption ? generateCaption(content) : content;

        const status = scheduledAt ? "Scheduled" : "Posted";

        // ✅ Insert post
        const result = db.prepare(`
            INSERT INTO posts (content, status, scheduled_at, created_at)
            VALUES (?, ?, ?, datetime('now'))
        `).run(
            finalContent,
            status,
            scheduledAt || null
        );

        const postId = result.lastInsertRowid;

        // ✅ Insert platforms
        const insertPlatform = db.prepare(`
            INSERT INTO post_platforms (post_id, platform, status)
            VALUES (?, ?, ?)
        `);

        platforms.forEach(p => {
            insertPlatform.run(postId, p, status);
        });

        const post = {
            id: postId,
            content: finalContent,
            scheduled_at: scheduledAt || null
        };

        // ✅ Schedule or publish
        try {
            if (scheduledAt) {
                scheduler.schedulePost(post);
            } else {
                publisher.publishPost(post);
            }
        } catch (e) {
            console.error("Scheduler/Publisher error:", e);
        }

        return res.json({
            message: "Post processed successfully",
            postId
        });

    } catch (err) {
        console.error("❌ POST ERROR:", err);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});


// =====================
// ✅ GET POSTS
// =====================
router.get("/", (req, res) => {
    try {
        const posts = db.prepare(`SELECT * FROM posts ORDER BY id DESC`).all();
        const mappings = db.prepare(`SELECT * FROM post_platforms`).all();

        const result = posts.map(post => ({
            ...post,
            platforms: mappings.filter(m => m.post_id === post.id)
        }));

        return res.json(result);

    } catch (err) {
        console.error("❌ GET ERROR:", err);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});


// =====================
// ✅ LOGS
// =====================
router.get("/logs", (req, res) => {
    try {
        const logs = db.prepare(`
            SELECT * FROM logs ORDER BY created_at DESC
        `).all();

        return res.json(logs);

    } catch (err) {
        console.error("❌ LOG ERROR:", err);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});


// =====================
// ✅ PLATFORMS
// =====================
router.get("/platforms", (req, res) => {
    return res.json(["twitter", "linkedin"]);
});


// =====================
// ✅ RETRY POST (FIXED)
// =====================
router.post("/retry/:postId", (req, res) => {
    try {
        const postId = req.params.postId;

        // 🔍 Get post
        const post = db.prepare(`
            SELECT * FROM posts WHERE id = ?
        `).get(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        console.log("🔁 Retrying post:", post);

        // ✅ Update DB BEFORE publishing
        db.prepare(`
            UPDATE posts 
            SET status = 'Posted', scheduled_at = NULL 
            WHERE id = ?
        `).run(postId);

        db.prepare(`
            UPDATE post_platforms 
            SET status = 'Posted' 
            WHERE post_id = ?
        `).run(postId);

        // ✅ Safe publish (important)
        try {
            publisher.publishPost(post);
        } catch (pubErr) {
            console.error("❌ Publisher error:", pubErr);
        }

        return res.json({
            message: "Post retried successfully"
        });

    } catch (err) {
        console.error("❌ RETRY ERROR:", err);

        return res.status(500).json({
            error: err.message || "Retry failed"
        });
    }
});


// =====================
// ✅ DELETE POST
// =====================
router.delete("/:id", (req, res) => {
    try {
        const postId = req.params.id;

        db.prepare(`DELETE FROM post_platforms WHERE post_id = ?`)
          .run(postId);

        const result = db.prepare(`DELETE FROM posts WHERE id = ?`)
          .run(postId);

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Post not found"
            });
        }

        return res.json({
            message: "Post deleted"
        });

    } catch (err) {
        console.error("❌ DELETE ERROR:", err);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

module.exports = router;