import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_BASE_URL = process.env.BACKEND_EXPRESS_URL || "http://localhost:8001";

async function handleProxyRequest(req: NextRequest) {
    const targetUrl = `${BACKEND_BASE_URL}/api/web/v1/product${req.nextUrl.search}`;

    try {
        let requestBody: any = undefined;

        // Hanya parse body untuk POST dan PUT
        if (req.method === 'POST' || req.method === 'PUT') {
            try {
                requestBody = await req.json();
            } catch (e) {
                console.warn(`Could not parse request body as JSON for ${req.method} request to ${targetUrl}`, e);
            }
        }

        const response = await axios({
            method: req.method as any,
            url: targetUrl,
            data: requestBody,
            headers: {
                'Content-Type': req.headers.get('Content-Type') || 'application/json',
            },
            validateStatus: () => true,
        });

        return NextResponse.json(response.data, {
            status: response.status,
        });
    } catch (error: any) {
        console.error(`Error proxying ${req.method} request to ${targetUrl}: `, error);
        return NextResponse.json(
            { message: error.message || 'An unknown error occurred.' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    return handleProxyRequest(req);
}

export async function POST(req: NextRequest) {
    return handleProxyRequest(req);
}

export async function PUT(req: NextRequest) {
    return handleProxyRequest(req);
}

export async function DELETE(req: NextRequest) {
    return handleProxyRequest(req);
}