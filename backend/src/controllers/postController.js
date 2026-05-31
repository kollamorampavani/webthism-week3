const pool = require('../config/db');

exports.getAllPosts = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT p.id, p.title, p.content, p.created_at, u.username AS author,
                    COUNT(c.id) AS comment_count
             FROM posts p
             JOIN users u ON p.author_id = u.id
             LEFT JOIN comments c ON c.post_id = p.id
             GROUP BY p.id, u.username
             ORDER BY p.created_at DESC`
        );

        return res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Unable to fetch posts' });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const postResult = await pool.query(
            `SELECT p.id, p.title, p.content, p.created_at, p.updated_at, u.username AS author
             FROM posts p
             JOIN users u ON p.author_id = u.id
             WHERE p.id = $1`,
            [postId]
        );

        if (postResult.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const commentsResult = await pool.query(
            `SELECT c.id, c.content, c.created_at, u.username AS author
             FROM comments c
             JOIN users u ON c.author_id = u.id
             WHERE c.post_id = $1
             ORDER BY c.created_at ASC`,
            [postId]
        );

        return res.json({
            post: postResult.rows[0],
            comments: commentsResult.rows,
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Unable to load post details' });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const result = await pool.query(
            `INSERT INTO posts (author_id, title, content)
             VALUES ($1, $2, $3)
             RETURNING id, title, content, created_at`,
            [req.user.id, title, content]
        );

        return res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Unable to create post' });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, content } = req.body;

        const existingPost = await pool.query(
            'SELECT * FROM posts WHERE id = $1',
            [postId]
        );

        if (existingPost.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (existingPost.rows[0].author_id !== req.user.id) {
            return res.status(403).json({ error: 'You are not allowed to update this post' });
        }

        const updated = await pool.query(
            `UPDATE posts
             SET title = $1, content = $2, updated_at = NOW()
             WHERE id = $3
             RETURNING id, title, content, updated_at`,
            [title || existingPost.rows[0].title, content || existingPost.rows[0].content, postId]
        );

        return res.json(updated.rows[0]);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Unable to update post' });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;

        const existingPost = await pool.query(
            'SELECT * FROM posts WHERE id = $1',
            [postId]
        );

        if (existingPost.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (existingPost.rows[0].author_id !== req.user.id) {
            return res.status(403).json({ error: 'You are not allowed to delete this post' });
        }

        await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
        return res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Unable to delete post' });
    }
};

exports.addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Comment content is required' });
        }

        const postResult = await pool.query('SELECT id FROM posts WHERE id = $1', [postId]);
        if (postResult.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const result = await pool.query(
            `INSERT INTO comments (post_id, author_id, content)
             VALUES ($1, $2, $3)
             RETURNING id, content, created_at`,
            [postId, req.user.id, content]
        );

        return res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Unable to add comment' });
    }
};
