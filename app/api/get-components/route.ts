import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the Prisma user
    const prismaUser = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!prismaUser) {
      return NextResponse.json({ components: [] }, { status: 200 });
    }

    const componentsData = await prisma.component.findMany({
      where: { userId: prismaUser.id, isSaved: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ components: componentsData }, { status: 200 });
  } catch (error) {
    console.error("🔥 Error fetching components:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};
