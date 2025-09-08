import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { valid: false, error: 'API key is required' },
        { status: 400 }
      );
    }

    // Query the database to find the API key
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { valid: false, error: 'Database error' },
        { status: 500 }
      );
    }

    // Check if no API key was found
    if (!data || data.length === 0) {
      return NextResponse.json(
        { valid: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Get the first (and should be only) API key
    const apiKeyData = data[0];

    // API key is valid, return the key data (excluding the actual key for security)
    const { key, ...keyData } = apiKeyData;
    
    return NextResponse.json({
      valid: true,
      apiKeyData: {
        ...keyData,
        key: apiKeyData.key // Include the key for the protected page
      }
    });

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
