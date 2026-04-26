function publish(post) {
    console.log("📤 Posting to Twitter:", post.content);
    return { status: "success" };
}

module.exports = { publish };