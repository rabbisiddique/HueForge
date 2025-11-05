import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { typographyId: string } }
) => {
  try {
    const typography = await prisma.typography.findUnique({
      where: { id: params.typographyId },
    });

    if (!typography) {
      return NextResponse.json(
        { error: "Typography not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ typography }, { status: 200 });
  } catch (error) {
    console.error("Error fetching component:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
