import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const allowedStatuses = new Set(["todo", "in-progress", "done"]);
const allowedPriorities = new Set(["low", "medium", "high"]);

function parseId(id: string) {
  const idNum = Number(id);
  if (!Number.isInteger(idNum) || idNum <= 0) return null;
  return idNum;
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseId(id);
    if (idNum === null)
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    await prisma.task.delete({
      where: { id: idNum },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseId(id);
    if (idNum === null)
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (body.title !== undefined) {
      if (typeof body.title !== "string" || !body.title.trim()) {
        return NextResponse.json(
          { error: "Invalid title" },
          { status: 400 }
        );
      }
      data.title = body.title.trim();
    }

    if (body.description !== undefined) {
      if (typeof body.description !== "string") {
        return NextResponse.json(
          { error: "Invalid description" },
          { status: 400 }
        );
      }
      data.description = body.description;
    }

    if (body.status !== undefined) {
      if (typeof body.status !== "string" || !allowedStatuses.has(body.status)) {
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        );
      }
      data.status = body.status;
    }

    if (body.priority !== undefined) {
      if (
        typeof body.priority !== "string" ||
        !allowedPriorities.has(body.priority)
      ) {
        return NextResponse.json(
          { error: "Invalid priority" },
          { status: 400 }
        );
      }
      data.priority = body.priority;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const task = await prisma.task.update({
      where: { id: idNum },
      data,
    });

    return NextResponse.json(task);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.error("PATCH ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}