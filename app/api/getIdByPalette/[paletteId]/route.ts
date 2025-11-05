import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { paletteId: string } }
) => {
  try {
    const palette = await prisma.palette.findUnique({
      where: { id: params.paletteId },
    });

    if (!palette) {
      return NextResponse.json({ error: "Palette not found" }, { status: 404 });
    }

    return NextResponse.json({ palette }, { status: 200 });
  } catch (error) {
    console.error("Error fetching component:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
