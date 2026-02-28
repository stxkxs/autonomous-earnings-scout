import { NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const filePath = path.join(process.cwd(), "..", "output", "data", "earnings.json");

  try {
    const [fileContent, fileStat] = await Promise.all([
      readFile(filePath, "utf-8"),
      stat(filePath),
    ]);

    const stocks = JSON.parse(fileContent);

    return NextResponse.json({
      stocks: Array.isArray(stocks) ? stocks : [],
      lastUpdated: fileStat.mtime.toISOString(),
      count: Array.isArray(stocks) ? stocks.length : 0,
    });
  } catch (err) {
    // File doesn't exist yet — return empty gracefully
    return NextResponse.json({
      stocks: [],
      lastUpdated: null,
      count: 0,
    });
  }
}
