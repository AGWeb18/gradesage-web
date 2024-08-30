import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { Readable } from 'stream';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const content = new TextDecoder().decode(buffer);
    const records = parse(content, { columns: true, skip_empty_lines: true });

    if (records.length === 0) {
      return NextResponse.json({ error: 'Empty CSV file' }, { status: 400 });
    }

    const columns = Object.keys(records[0]);

    return NextResponse.json({ columns });
  } catch (error) {
    console.error('Error processing CSV:', error);
    return NextResponse.json({ error: 'Failed to process CSV' }, { status: 500 });
  }
}
