import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { component } = await req.json();
  if (!component.componentName || !component.category || !component.codeFiles) {
    return NextResponse.json(
      { error: "Missing required component fields" },
      { status: 400 }
    );
  }

  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - User not found" },
        { status: 401 }
      );
    }

    const cleanedCodeFiles = component.codeFiles.map((file: any) => ({
      ...file,
      content: file.content.replace(/\\n/g, "\n"),
    }));

    const newComponent = await prisma.component.create({
      data: {
        userId: user.id,
        componentName: component.componentName,
        category: component.category,
        description: component.description,
        techStack: component.techStack,
        codeFiles: cleanedCodeFiles,
        previewCode: component.previewCode.replace(/\\n/g, "\n"),
        isSaved: true,
      },
    });

    return NextResponse.json(
      { message: "Component saved to library.", newComponent },
      { status: 201 }
    );
  } catch (error) {
    console.error("🔥 Internal error generating component:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
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

    const deleteComponent = await prisma.component.delete({
      where: {
        id: deleteId,
      },
    });

    return NextResponse.json(
      { message: "Component deleted successfully.", deleteComponent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error deleting component:", error);
    return NextResponse.json(
      { error: "Failed to delete Component" },
      { status: 500 }
    );
  }
};
