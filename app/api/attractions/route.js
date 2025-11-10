import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";


export async function GET(request) {
  try {
    const [rows] = await mysqlPool.query(
      "SELECT id, name, detail, coverimage, latitude, longitude FROM attractions ORDER BY id ASC;"
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, detail, coverimage, latitude, longitude } = body || {};

    const [insertResult] = await mysqlPool.query(
      "INSERT INTO attractions (name, detail, coverimage, latitude, longitude) VALUES (?, ?, ?, ?, ?)",
      [name, detail, coverimage, latitude, longitude]
    );

    const [rows] = await mysqlPool.query(
      "SELECT id, name, detail, coverimage, latitude, longitude FROM attractions WHERE id = ?",
      [insertResult.insertId]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

