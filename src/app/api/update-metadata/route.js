import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req) {

  const client = await clerkClient()
  try {
    // Parse the request body
    const { userId, preferredCurrency, currencySymbol } = await req.json();

    // Update the user's public metadata
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        preferredCurrency,
        currencySymbol,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    // Log the error details
    console.error('Error updating public metadata:', error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}