import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { componentId: string } }
) => {
  try {
    const component = await prisma.component.findUnique({
      where: { id: params.componentId },
    });

    if (!component) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ component }, { status: 200 });
  } catch (error) {
    console.error("Error fetching component:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
