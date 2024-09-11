import { NextRequest, NextResponse } from 'next/server';
import { PubSub } from '@google-cloud/pubsub';
import { z } from 'zod';

// Initialize PubSub client
const pubSubClient = new PubSub({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS || '{}'),
});

// Define a schema for the request body
const requestSchema = z.object({
  jobId: z.string().uuid(),
});

// Define a type for the job status
type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export async function GET(req: NextRequest) {
  try {
    // Parse and validate the query parameters
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const validatedData = requestSchema.parse({ jobId });

    // Fetch the job status from Pub/Sub
    const status = await getJobStatus(validatedData.jobId);

    return NextResponse.json({ jobId: validatedData.jobId, status });
  } catch (error) {
    console.error('Error processing request:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid job ID format' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function getJobStatus(jobId: string): Promise<JobStatus> {
  // Fetch the job status from Pub/Sub
  const subscription = pubSubClient.subscription(jobId); // Assuming jobId is the subscription name
  const [messages] = await subscription.pull({ maxMessages: 1 });

  if (messages.length === 0) {
    return 'pending'; // No messages means the job is still pending
  }

  // Acknowledge the message
  const message = messages[0];
  await subscription.ack([message]);

  // Determine the status based on the message data
  const status = message.data.toString(); // Assuming message data contains the status
  return status as JobStatus; // Cast to JobStatus type
}

export const config = {
  api: {
    bodyParser: false,
  },
};