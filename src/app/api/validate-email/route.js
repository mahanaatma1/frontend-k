import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Extract domain from email
    const domain = email.split('@')[1];
    
    if (!domain) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Call RapidAPI email validation service
    const response = await fetch(`https://mailcheck.p.rapidapi.com/?domain=${encodeURIComponent(domain)}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY || 'd188ec44c7msh747faa67cf5bd35p129a5ajsnabea2ea0a1fc',
        'x-rapidapi-host': 'mailcheck.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse the response and determine if email is valid
    let isValid = false;
    let message = 'Email validation failed';
    let details = {};
    
    if (data && typeof data === 'object') {
      // Check basic validity
      if (data.valid === true) {
        // Additional checks for quality
        if (data.block === true) {
          isValid = false;
          message = 'Email domain is blacklisted';
          details = { reason: data.reason || 'Domain blocked' };
        } else if (data.disposable === true) {
          isValid = false;
          message = 'Disposable/temporary email addresses are not allowed';
          details = { reason: data.reason || 'Disposable email detected' };
        } else if (data.risk && data.risk > 50) {
          isValid = false;
          message = 'Email domain has high risk score';
          details = { reason: data.reason || `Risk score: ${data.risk}` };
        } else {
          isValid = true;
          message = data.text || 'Email is valid';
          details = { 
            risk: data.risk || 0,
            reason: data.reason || 'Valid domain'
          };
        }
      } else if (data.valid === false) {
        isValid = false;
        message = data.text || 'Email domain is invalid';
        details = { reason: data.reason || 'Invalid domain' };
      } else {
        // Fallback for unknown response format
        isValid = true;
        message = 'Email appears to be valid';
        details = { reason: 'Unknown response format' };
      }
    }

    return NextResponse.json({
      success: true,
      isValid,
      message,
      domain,
      details,
      rawResponse: data
    });

  } catch (error) {
    console.error('Email validation error:', error);
    
    // Return a fallback response to avoid blocking signup
    return NextResponse.json({
      success: true,
      isValid: true, // Assume valid to avoid blocking legitimate users
      message: 'Email validation service unavailable, proceeding with signup',
      error: error.message
    });
  }
}
