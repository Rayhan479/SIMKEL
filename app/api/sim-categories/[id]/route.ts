import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price } = body;

    const category = await prisma.simCategory.update({
      where: { id: parseInt(id) },
      data: { name, description, price: parseInt(price) }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating SIM category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const category = await prisma.simCategory.findUnique({
      where: { id: parseInt(id) }
    });

    if (category?.isDefault) {
      return NextResponse.json({ error: "Cannot delete default category" }, { status: 400 });
    }

    await prisma.simCategory.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    console.error("Error deleting SIM category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
