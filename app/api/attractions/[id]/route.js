import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const [rows] = await mysqlPool.query(
      "SELECT id, name, detail, coverimage, latitude, longitude FROM attractions WHERE id = ?",
      [id]
    );
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { message: `Attraction with id ${id} not found.` },
        { status: 404 }
      );
    }
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error?.sqlMessage || error?.message || String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, detail, coverimage, latitude, longitude } = body || {};

    const [exists] = await mysqlPool.query(
      "SELECT id FROM attractions WHERE id = ?",
      [id]
    );
    if (!exists || exists.length === 0) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    await mysqlPool.query(
      `UPDATE attractions
         SET name = ?, detail = ?, coverimage = ?, latitude = ?, longitude = ?
       WHERE id = ?`,
      [name, detail ?? "", coverimage, latitude ?? null, longitude ?? null, id]
    );

    const [rows] = await mysqlPool.query(
      "SELECT id, name, detail, coverimage, latitude, longitude FROM attractions WHERE id = ?",
      [id]
    );
    return NextResponse.json(rows[0], { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e?.sqlMessage || e?.message || String(e) }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = params;

    const [exists] = await mysqlPool.query(
      "SELECT id FROM attractions WHERE id = ?",
      [id]
    );
    if (!exists || exists.length === 0) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    await mysqlPool.query("DELETE FROM attractions WHERE id = ?", [id]);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e?.sqlMessage || e?.message || String(e) }, { status: 500 });
  }
}


