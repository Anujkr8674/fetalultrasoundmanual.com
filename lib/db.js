import mysql from "mysql2/promise";
import crypto from "crypto";

const globalForMySQL = globalThis;

const pool =
  globalForMySQL.__fogsiMySQLPool ||
  mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "fogsi",
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
    charset: "utf8mb4",
  });

if (process.env.NODE_ENV !== "production") {
  globalForMySQL.__fogsiMySQLPool = pool;
}

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function ensureUserTable() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(120) NOT NULL,
      place VARCHAR(255) NOT NULL,
      token_version INT UNSIGNED NOT NULL DEFAULT 0,
      reset_token_hash VARCHAR(255) DEFAULT NULL,
      reset_token_expires DATETIME DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uniq_users_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  try {
    await pool.execute("ALTER TABLE users ADD COLUMN place VARCHAR(255) NOT NULL AFTER name");
  } catch (error) {
    if (!String(error?.message || "").includes("Duplicate column name")) {
      throw error;
    }
  }

  try {
    await pool.execute(
      "ALTER TABLE users ADD COLUMN token_version INT UNSIGNED NOT NULL DEFAULT 0"
    );
  } catch (error) {
    if (!String(error?.message || "").includes("Duplicate column name")) {
      throw error;
    }
  }

  try {
    await pool.execute("ALTER TABLE users ADD COLUMN reset_token_hash VARCHAR(255) DEFAULT NULL");
  } catch (error) {
    if (
      !String(error?.message || "").includes("Duplicate column name")
    ) {
      throw error;
    }
  }

  try {
    await pool.execute("ALTER TABLE users ADD COLUMN reset_token_expires DATETIME DEFAULT NULL");
  } catch (error) {
    if (!String(error?.message || "").includes("Duplicate column name")) {
      throw error;
    }
  }

  try {
    await pool.execute(
      "ALTER TABLE users ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP"
    );
  } catch (error) {
    if (!String(error?.message || "").includes("Duplicate column name")) {
      throw error;
    }
  }

  try {
    await pool.execute(
      "ALTER TABLE users ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    );
  } catch (error) {
    if (!String(error?.message || "").includes("Duplicate column name")) {
      throw error;
    }
  }

  try {
    await pool.execute("ALTER TABLE users ADD UNIQUE KEY uniq_users_name (name)");
  } catch (error) {
    if (
      !String(error?.message || "").includes("Duplicate key name") &&
      !String(error?.message || "").includes("Duplicate entry")
    ) {
      throw error;
    }
  }
}

export async function ensureAdminTable() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      admin_code VARCHAR(20) DEFAULT NULL UNIQUE,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(191) NOT NULL UNIQUE,
      phone VARCHAR(30) DEFAULT NULL,
      password_hash VARCHAR(255) NOT NULL,
      token_version INT UNSIGNED NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  try {
    await pool.execute("ALTER TABLE admins ADD COLUMN admin_code VARCHAR(20) DEFAULT NULL UNIQUE AFTER id");
  } catch (error) {
    if (!String(error?.message || "").includes("Duplicate column name")) {
      throw error;
    }
  }
}

export async function ensureCaseLikesTable() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS case_likes (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      user_id INT UNSIGNED NOT NULL,
      issue_key VARCHAR(50) NOT NULL,
      case_key VARCHAR(50) NOT NULL,
      content_key VARCHAR(120) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uniq_user_content (user_id, content_key),
      KEY idx_content_key (content_key),
      KEY idx_user_id (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS case_like_events (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      user_id INT UNSIGNED NOT NULL,
      issue_key VARCHAR(50) NOT NULL,
      case_key VARCHAR(50) NOT NULL,
      content_key VARCHAR(120) NOT NULL,
      action ENUM('like', 'unlike') NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_content_key (content_key),
      KEY idx_user_id (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

function hashSeedPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

export async function ensureDefaultAdminAccount() {
  await ensureAdminTable();

  const passwordHash = await hashSeedPassword("Anuj#0000");
  const existingByCode = await query(
    "SELECT id FROM admins WHERE admin_code = ? LIMIT 1",
    ["ADM00001"]
  );

  if (existingByCode.length) {
    return;
  }

  const existingAnyAdmin = await query("SELECT id FROM admins ORDER BY id ASC LIMIT 1");
  if (existingAnyAdmin.length) {
    await pool.execute(
      `UPDATE admins
       SET admin_code = ?, password_hash = ?, token_version = 0
       WHERE id = ?`,
      ["ADM00001", passwordHash, existingAnyAdmin[0].id]
    );
    return;
  }

  await pool.execute(
    `INSERT INTO admins (admin_code, name, email, phone, password_hash, token_version)
     VALUES (?, ?, ?, ?, ?, 0)`,
    ["ADM00001", "Super Admin", "admin@fogsi.local", null, passwordHash]
  );
}

export function getPool() {
  return pool;
}
