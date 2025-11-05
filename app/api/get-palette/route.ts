import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find the Prisma user
    const prismaUser = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!prismaUser) {
      return NextResponse.json([], { status: 200 }); // no palettes yet
    }

    const palettes = await prisma.palette.findMany({
      where: { userId: prismaUser.id, isSaved: true },
      orderBy: { createdAt: "desc" },
    });

    // Parse colors JSON
    const parsedPalettes = palettes.map((p) => ({
      ...p,
      colors: JSON.parse(p.colors),
    }));

    return NextResponse.json(parsedPalettes, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch palettes", err);
    return NextResponse.json(
      { error: "Failed to fetch palettes" },
      { status: 500 }
    );
  }
};
