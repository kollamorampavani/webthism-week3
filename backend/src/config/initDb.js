const pool = require('./db');

const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
                author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        const postsColumns = await pool.query(
            "SELECT column_name FROM information_schema.columns WHERE table_name='posts' AND column_name IN ('user_id','author_id')"
        );

        const commentsColumns = await pool.query(
            "SELECT column_name FROM information_schema.columns WHERE table_name='comments' AND column_name IN ('user_id','author_id')"
        );

        const postHasUserId = postsColumns.rows.some((row) => row.column_name === 'user_id');
        const postHasAuthorId = postsColumns.rows.some((row) => row.column_name === 'author_id');
        const commentHasUserId = commentsColumns.rows.some((row) => row.column_name === 'user_id');
        const commentHasAuthorId = commentsColumns.rows.some((row) => row.column_name === 'author_id');

        if (postHasUserId && !postHasAuthorId) {
            await pool.query(`
                ALTER TABLE posts
                ADD COLUMN author_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
                UPDATE posts SET author_id = user_id;
                ALTER TABLE posts DROP COLUMN user_id;
            `);
            console.log('✅ Migrated posts.user_id to posts.author_id');
        }

        if (commentHasUserId && !commentHasAuthorId) {
            await pool.query(`
                ALTER TABLE comments
                ADD COLUMN author_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
                UPDATE comments SET author_id = user_id;
                ALTER TABLE comments DROP COLUMN user_id;
            `);
            console.log('✅ Migrated comments.user_id to comments.author_id');
        }

        console.log('✅ Database tables are ready');
    } catch (err) {
        console.error('❌ Error initializing database tables:', err.message);
        process.exit(1);
    }
};

module.exports = initDb;
