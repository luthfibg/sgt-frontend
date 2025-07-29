import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { ifError } from 'assert';

// url backend
const BACKEND_BASE_URL = process.env.BACKEND_EXPRESS_URL || 'http://localhost:8001';

export async function GET(req: NextRequest) {
    // build complete url to all product
    const targetUrl = `${BACKEND_BASE_URL}/api/web/v1/products${req.nextUrl.search}`;
    try {
        const response = await axios.get(targetUrl, {
            headers: {
                'Content-Type': 'application/json',
            },
            validateStatus: (status) => true, // Accept all status codes
        });

        return NextResponse.json(response.data, {
            status: response.status,
            headers: response.headers as HeadersInit,
        });
    } catch (error: any) {
        console.error(`Error proxy GET request to ${targetUrl}: `, error);

        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(error.response.data, {
                status: error.response.status,
                headers:error.response.headers as HeadersInit,
            });
        } else if (axios.isAxiosError(error) && error.request) {
            return NextResponse.json({ message: 'No response from backend server.'}, {
                status: 502, // Bad Gateway
            });
        } else {
            return NextResponse.json({ message: error.message || 'An unknown error occurred.' }, {
                status: 500, // Internal Server Error
            });
        }
    }
}