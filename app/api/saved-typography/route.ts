import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { fontFamily, name, levels, prompt } = await req.json();

    if (!fontFamily) {
      return NextResponse.json(
        { error: "fontFamily required" },
        { status: 400 }
      );
    }
    if (!name) {
      return NextResponse.json({ error: " name required" }, { status: 400 });
    }
    if (!levels) {
      return NextResponse.json({ error: "levels  required" }, { status: 400 });
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
    }

    // Save the palette
    const savedTypography = await prisma.typography.create({
      data: {
        userId: prismaUser?.id!, // Prisma user ID
        fontFamily,
        name: JSON.stringify(name),
        levels: JSON.stringify(levels),
        prompt,
      },
    });

    return NextResponse.json(
      { message: "Typography saved successfully", palette: savedTypography },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving Typography:", error);
    return NextResponse.json(
      { error: "Failed to save Typography" },
      { status: 500 }
    );
  }
};
export const DELETE = async (req: Request) => {
  try {
    const { deleteId } = await req.json();

    if (!deleteId) {
      return NextResponse.json(
        { error: "deleteId is missing" },
        { status: 400 }
      );
    }

    const deleteTypography = await prisma.typography.delete({
      where: {
        id: deleteId,
      },
    });

    return NextResponse.json(
      { message: "Typography saved to library.", deleteTypography },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving Typography:", error);
    return NextResponse.json(
      { error: "Failed to save Typography" },
      { status: 500 }
    );
  }
};

// export const DELETE = async (req: Request) => {
//   const { deleteId } = await req.json();
//   if (!deleteId)
//     return NextResponse.json({ error: "Delete id not found" }, { status: 400 });

//   try {
//     const deletePalette = await prisma.palette.delete({
//       where: { id: deleteId },
//     });

//     return NextResponse.json(
//       { message: "Deleted successfully", deletePalette },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error deleting palette:", error);
//     return NextResponse.json(
//       { error: "Failed to delete palette" },
//       { status: 500 }
//     );
//   }
// };
