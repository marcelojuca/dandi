
import { NextResponse } from 'next/server';
import { getApiKeys, addApiKey } from '../../../lib/apiKeysStoreSupabase';

// GET /api/api-keys - Fetch all API keys
export async function GET() {
  try {
    const apiKeys = await getApiKeys();
    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error('GET /api/api-keys error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST /api/api-keys - Create a new API key
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, permissions, keyType, limitUsage, monthlyLimit } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Generate a new API key
    const generateApiKey = () => {
      const prefix = keyType === 'production' ? 'prod_sk_' : 'dev_sk_';
      const randomString = Math.random().toString(36).substring(2, 15) + 
                          Math.random().toString(36).substring(2, 15);
      return prefix + randomString;
    };

    const newApiKey = {
      name,
      description: description || '',
      key: generateApiKey(),
      permissions: permissions || [],
      key_type: keyType || 'development',
      limit_usage: limitUsage || false,
      monthly_limit: monthlyLimit || 1000
    };

    const createdKey = await addApiKey(newApiKey);

    return NextResponse.json(createdKey, { status: 201 });
  } catch (error) {
    console.error('POST /api/api-keys error:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}
