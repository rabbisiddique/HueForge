import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { colorPalette, name } = await req.json();

    if (!colorPalette || !name) {
      return NextResponse.json(
        { error: "ColorPalette and name are required" },
        { status: 400 }
      );
    }

    // Get Clerk ID of current user
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user exists in Prisma
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    // If not, create the user in Prisma
    let prismaUser = user;

    if (!prismaUser) {
      const clerkUser = await currentUser();
      if (!clerkUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      prismaUser = await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          email: clerkUser.emailAddresses[0].emailAddress,
          username:
            clerkUser.username ||
            clerkUser.emailAddresses[0].emailAddress.split("@")[0],
          firstname: clerkUser.firstName || "",
          lastname: clerkUser.lastName || "",
        },
      });
    }

    const colorsString = JSON.stringify(colorPalette);

    const existingPalette = await prisma.palette.findFirst({
      where: {
        userId: user?.id, // only check for the same user
        colors: colorsString, // exact string match
      },
    });

    if (existingPalette) {
      return NextResponse.json(
        {
          error: "You already saved this palette",
          existingPalette,
        },
        { status: 409 } // <-- conflict
      );
    }

    // Save the palette
    const savedPalette = await prisma.palette.create({
      data: {
        userId: prismaUser?.id!, // Prisma user ID
        name,
        colors: JSON.stringify(colorPalette), // store the array as JSON string
      },
    });

    return NextResponse.json(
      { message: "Palette saved to library.", palette: savedPalette },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving palette:", error);
    return NextResponse.json(
      { error: "Failed to save palette" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: Request) => {
  const { deleteId } = await req.json();
  if (!deleteId)
    return NextResponse.json({ error: "Delete id not found" }, { status: 400 });

  try {
    const deletePalette = await prisma.palette.delete({
      where: { id: deleteId },
    });

    return NextResponse.json(
      { message: "Deleted successfully", deletePalette },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting palette:", error);
    return NextResponse.json(
      { error: "Failed to delete palette" },
      { status: 500 }
    );
  }
};
