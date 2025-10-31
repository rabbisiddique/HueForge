import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.log("No userId from Clerk");
      return new Response("Unauthorized", { status: 401 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    const user = await currentUser();
    if (!user) {
      console.log("No user object from Clerk");
      return new Response("No user found", { status: 400 });
    }

    if (existingUser) {
      return new Response(JSON.stringify(existingUser), { status: 200 });
    }

    const newUser = await prisma.user.create({
      data: {
        clerkUserId: userId,
        email: user.emailAddresses[0].emailAddress,
        username:
          user.username || user.emailAddresses[0].emailAddress.split("@")[0],
        firstname: user.firstName || "",
        lastname: user.lastName || "",
      },
    });

    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (err) {
    console.error("Error in POST /api/users:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
