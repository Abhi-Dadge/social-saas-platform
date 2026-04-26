function publish(post) {
    console.log("📤 Posting to LinkedIn:", post.content);
    return { status: "success" };
}

module.exports = { publish };