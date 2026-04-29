import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const allowedStatuses = new Set(["todo", "in-progress", "done"]);
const allowedPriorities = new Set(["low", "medium", "high"]);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const priority = url.searchParams.get("priority");

  if (status && !allowedStatuses.has(status)) {
    return NextResponse.json(
      { error: "Invalid status" },
      { status: 400 }
    );
  }

  if (priority && !allowedPriorities.has(priority)) {
    return NextResponse.json(
      { error: "Invalid priority" },
      { status: 400 }
    );
  }

  const tasks = await prisma.task.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (body.status && !allowedStatuses.has(body.status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    if (body.priority && !allowedPriorities.has(body.priority)) {
      return NextResponse.json(
        { error: "Invalid priority" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title: body.title.trim(),
        description: typeof body.description === "string" ? body.description : "",
        status: body.status || "todo",
        priority: body.priority || "low",
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}