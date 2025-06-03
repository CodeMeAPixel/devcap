import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { uploadToS3 } from '@/lib/storage';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Validate file type
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }
    
    // Process the file
    const buffer = await file.arrayBuffer();
    const fileExtension = fileType.split('/')[1];
    const fileName = `avatars/${uuidv4()}.${fileExtension}`;
    
    // Upload to S3 instead of Backblaze
    const fileUrl = await uploadToS3(
      Buffer.from(buffer), 
      fileName, 
      fileType
    );
    
    // Update the user's image in the database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: fileUrl }
    });
    
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}

// Increase payload size limit for file uploads
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb',
  },
};
