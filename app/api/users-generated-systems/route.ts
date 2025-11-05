import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const [
      generatedTypographySystems,
      generatedPaletteSystems,
      generatedComponentSystems,
    ] = await Promise.all([
      prisma.typography.count({ where: { userId: user.id } }),
      prisma.palette.count({ where: { userId: user.id } }),
      prisma.component.count({ where: { userId: user.id } }),
    ]);

    const [savedPaletteSystems, savedTypographySystems, savedComponentSystems] =
      await Promise.all([
        await prisma.palette.count({
          where: { userId: user.id, isSaved: true },
        }),
        await prisma.typography.count({
          where: { userId: user.id, isSaved: true },
        }),
        await prisma.component.count({
          where: { userId: user.id, isSaved: true },
        }),
      ]);

    return NextResponse.json(
      {
        generatedPaletteSystems,
        generatedTypographySystems,
        generatedComponentSystems,
        savedPaletteSystems,
        savedTypographySystems,
        savedComponentSystems,
      },
      { status: 200 }
    );
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};
