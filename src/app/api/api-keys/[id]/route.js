import { NextResponse } from 'next/server';
import { getApiKeyById, updateApiKey, deleteApiKey } from '../../../../lib/apiKeysStoreSupabase';

// GET /api/api-keys/[id] - Fetch a specific API key
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const apiKey = await getApiKeyById(id);

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(apiKey);
  } catch (error) {
    console.error('GET /api/api-keys/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API key' },
      { status: 500 }
    );
  }
}

// PUT /api/api-keys/[id] - Update a specific API key
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, permissions, keyType, limitUsage, monthlyLimit } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Update the API key
    const updates = {
      name,
      description: description || '',
      permissions: permissions || [],
      key_type: keyType || 'development',
      limit_usage: limitUsage || false,
      monthly_limit: monthlyLimit || 1000
    };

    const updatedKey = await updateApiKey(id, updates);

    if (!updatedKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedKey);
  } catch (error) {
    console.error('PUT /api/api-keys/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 500 }
    );
  }
}

// DELETE /api/api-keys/[id] - Delete a specific API key
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const deletedKey = await deleteApiKey(id);

    if (!deletedKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'API key deleted successfully', deletedKey },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/api-keys/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}
