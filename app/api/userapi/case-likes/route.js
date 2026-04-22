import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, getAuthenticatedUserFromToken } from "../../../../lib/auth";
import { ensureCaseLikesTable, getPool, query } from "../../../../lib/db";

function normalizeKey(value) {
  const result = String(value || "").trim();
  return result || "";
}

function buildContentKey(issueKey, caseKey) {
  const issue = normalizeKey(issueKey);
  const kase = normalizeKey(caseKey);
  if (!issue || !kase) {
    return "";
  }
  return `${issue}:${kase}`;
}

function badRequest(message) {
  return NextResponse.json({ ok: false, message }, { status: 400 });
}

export async function GET(request) {
  try {
    await ensureCaseLikesTable();

    const issueKey = normalizeKey(request.nextUrl.searchParams.get("issueKey"));
    const caseKey = normalizeKey(request.nextUrl.searchParams.get("caseKey"));
    const contentKey = buildContentKey(issueKey, caseKey);

    if (!contentKey) {
      return badRequest("issueKey and caseKey are required.");
    }

    const [countRow] = await query(
      "SELECT COUNT(*) AS count FROM case_likes WHERE content_key = ?",
      [contentKey]
    );

    const user = await getAuthenticatedUserFromToken(
      request.cookies.get(AUTH_COOKIE_NAME)?.value
    );

    let liked = false;
    if (user) {
      const rows = await query(
        "SELECT id FROM case_likes WHERE user_id = ? AND content_key = ? LIMIT 1",
        [user.id, contentKey]
      );
      liked = rows.length > 0;
    }

    return NextResponse.json({
      ok: true,
      count: Number(countRow?.count || 0),
      liked,
    });
  } catch (error) {
    console.error("Case like fetch error:", error);
    return NextResponse.json({ ok: false, message: "Unable to load like state." }, { status: 500 });
  }
}

export async function POST(request) {
  let connection;

  try {
    await ensureCaseLikesTable();

    const user = await getAuthenticatedUserFromToken(
      request.cookies.get(AUTH_COOKIE_NAME)?.value
    );

    if (!user) {
      return NextResponse.json({ ok: false, message: "Login required." }, { status: 401 });
    }

    const formData = await request.formData();
    const issueKey = normalizeKey(formData.get("issueKey"));
    const caseKey = normalizeKey(formData.get("caseKey"));
    const contentKey = buildContentKey(issueKey, caseKey);

    if (!contentKey) {
      return badRequest("issueKey and caseKey are required.");
    }

    connection = await getPool().getConnection();
    await connection.beginTransaction();

    const existing = await connection.execute(
      "SELECT id FROM case_likes WHERE user_id = ? AND content_key = ? LIMIT 1",
      [user.id, contentKey]
    );

    let liked;
    if (existing[0].length) {
      await connection.execute("DELETE FROM case_likes WHERE id = ?", [existing[0][0].id]);
      await connection.execute(
        `INSERT INTO case_like_events (user_id, issue_key, case_key, content_key, action)
         VALUES (?, ?, ?, ?, 'unlike')`,
        [user.id, issueKey, caseKey, contentKey]
      );
      liked = false;
    } else {
      await connection.execute(
        `INSERT INTO case_likes (user_id, issue_key, case_key, content_key)
         VALUES (?, ?, ?, ?)`,
        [user.id, issueKey, caseKey, contentKey]
      );
      await connection.execute(
        `INSERT INTO case_like_events (user_id, issue_key, case_key, content_key, action)
         VALUES (?, ?, ?, ?, 'like')`,
        [user.id, issueKey, caseKey, contentKey]
      );
      liked = true;
    }

    const countRows = await connection.execute(
      "SELECT COUNT(*) AS count FROM case_likes WHERE content_key = ?",
      [contentKey]
    );

    await connection.commit();

    return NextResponse.json({
      ok: true,
      liked,
      count: Number(countRows[0][0]?.count || 0),
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch {
        // ignore rollback errors
      }
    }

    console.error("Case like toggle error:", error);
    return NextResponse.json({ ok: false, message: "Unable to save like state." }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
