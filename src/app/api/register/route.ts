import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Improved validation schema with better error messages
const userSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").max(50, "Name is too long").optional(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const body = userSchema.parse(json);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" }, 
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create user with correct UserProgress fields
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name || null,
        userProgress: {
          create: {
            linesOfCode: 0,
            currency: 0,
            totalEarned: 0,
            clickPower: 1,
            lastActive: new Date(),
          },
        },
      },
      // Include user progress in the response
      include: {
        userProgress: true,
      },
    });

    // Remove sensitive data from response
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(
      { user: userWithoutPassword, message: "Account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error instanceof z.ZodError) {
      // Return more user-friendly validation errors
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return NextResponse.json(
        { errors: formattedErrors, message: "Please check your information" }, 
        { status: 400 }
      );
    }
    
    // Generic error handling
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." }, 
      { status: 500 }
    );
  }
}