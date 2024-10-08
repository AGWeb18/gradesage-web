import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth-options';
import { parse } from 'csv-parse/sync';
import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@/lib/kv';
import { rateLimiter } from '@/app/middleware/rateLimiter';

export const maxDuration = 60; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
});

interface GradedResponse {
  student: string;
  mcScore: number;
  question: string;
  answer: string;
  aiScore: number;
  aiComment: string;
}

export async function POST(req: NextRequest) {
  const rateLimitResult = await rateLimiter(req);
  if (rateLimitResult) {
    return NextResponse.json({ error: rateLimitResult.error }, { status: rateLimitResult.status });
  }

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      console.log('No session or user found in process-csv');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;
    if (!userId) {
      console.log('User email not found in process-csv');
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    const key = `user:${userId}:anthropic_requests`;

    const [subscriptionType, requestCount] = await Promise.all([
      kv.get(`user:${userId}:subscription`),
      kv.get(key),
    ]);

    console.log(`User ${userId} request count updated:`, requestCount);

    let limit = 10;
    if (subscriptionType === 'Basic') limit = 300;
    if (subscriptionType === 'Premium') limit = 1000;
    if (subscriptionType === 'VIP') limit = Infinity;

    if (typeof requestCount === 'number' && requestCount > limit) {
      console.log(`Rate limit exceeded for user ${userId}`);
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    if (requestCount === 1) {
      await kv.expire(key, 30 * 24 * 60 * 60);
      console.log(`Set expiry for new key: ${key}`);
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const maxScore = Number(formData.get('maxScore')) || 25;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    let gradedResponses;
    if (file.type === 'text/csv') {
      try {
        gradedResponses = await processCSV(file, formData, userId);
      } catch (error) {
        console.error('Error processing CSV:', error);
        console.error('Full error details:', JSON.stringify(error, null, 2)); // Log full error details
        if (error instanceof Error) {
          return NextResponse.json({ error: 'Error processing CSV', details: error.message }, { status: 500 });
        } else {
          return NextResponse.json({ error: 'Error processing CSV', details: 'Unknown error occurred' }, { status: 500 });
        }
      }
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    const summary = calculateSummary(gradedResponses, maxScore);
    const worstQuestion = identifyWorstQuestion(gradedResponses);

    return NextResponse.json({ 
      gradedResponses, 
      summary, 
      worstQuestion 
    });
  } catch (error) {
    console.error('Error processing CSV:', error);
    console.error('Full error details:', JSON.stringify(error, null, 2)); // Log full error details
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Internal server error', details: 'Unknown error occurred' }, { status: 500 });
    }
  }
}

async function processCSV(file: File, formData: FormData, userId: string): Promise<GradedResponse[]> {
  console.log('Starting CSV processing...');
  try {
    const fileContents = await file.text();
    console.log('File read successfully, parsing CSV...');
    
    let records;
    try {
      records = parse(fileContents, { columns: true });
      console.log('CSV parsed successfully, number of records:', records.length);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      throw new Error('Invalid CSV format');
    }

    const usernameCol = formData.get('usernameCol') as string;
    const questionTypeCol = formData.get('questionTypeCol') as string;
    const questionCol = formData.get('questionCol') as string;
    const answerCol = formData.get('answerCol') as string;
    const mcScoreCol = formData.get('mcScoreCol') as string;

    const gradedResponses: GradedResponse[] = [];
    let anthropicRequestCount = 0;

    const key = `user:${userId}:anthropic_requests`;
    const subscriptionType = await kv.get(`user:${userId}:subscription`) as string;
    const limit = getRateLimit(subscriptionType);

    for (const record of records) {
      if (record[questionTypeCol] === 'WR') {
        const currentCount = await kv.get(key) as number;
        if (currentCount >= limit) {
          console.log(`Rate limit exceeded for user ${userId} during processing`);
          break;
        }

        const response = await getTeachingAssistantScore(record[questionCol], record[answerCol]);
        const [aiScore, aiComment] = extractScoreAndComment(response);
        gradedResponses.push({
          student: record[usernameCol],
          mcScore: Number(record[mcScoreCol]) || 0,
          question: record[questionCol],
          answer: record[answerCol],
          aiScore,
          aiComment
        });
        anthropicRequestCount++;
      }
    }

    // Update the count only once after processing all records
    await updateUserRequestCount(userId, anthropicRequestCount);

    return gradedResponses;
  } catch (error) {
    console.error('Error in processCSV:', error);
    if (error instanceof Error) {
      throw new Error(`Error processing CSV: ${error.message}`);
    } else {
      throw new Error('Unknown error occurred while processing CSV');
    }
  }
}

function getRateLimit(subscriptionType: string): number {
  switch (subscriptionType) {
    case 'Basic':
      return 300;
    case 'Premium':
      return 1000;
    case 'VIP':
      return Infinity;
    default:
      return 10;
  }
}

async function updateUserRequestCount(userId: string, increment: number) {
  const key = `user:${userId}:anthropic_requests`;
  const subscriptionStartKey = `user:${userId}:subscription_start`;

  let subscriptionStart = await kv.get(subscriptionStartKey);

  if (!subscriptionStart) {
    subscriptionStart = Date.now().toString();
    await kv.set(subscriptionStartKey, subscriptionStart);
  }

  const daysSinceSubscriptionStart = Math.floor((Date.now() - Number(subscriptionStart)) / (1000 * 60 * 60 * 24));

  if (daysSinceSubscriptionStart >= 30) {
    await kv.set(key, increment.toString());
    await kv.set(subscriptionStartKey, Date.now().toString());
    console.log(`Reset Anthropic request count for user ${userId}`);
  } else {
    await kv.incrby(key, increment);
  }

  const newCount = await kv.get(key);
  console.log(`Updated Anthropic request count for user ${userId}: ${newCount}`);
  
  await kv.expire(key, 30 * 24 * 60 * 60);
}

async function processVideo(file: File): Promise<GradedResponse[]> {
  throw new Error('Video processing not implemented');
}

async function getTeachingAssistantScore(question: string, answer: string): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model:"claude-3-5-sonnet-20240620",
      max_tokens: 618,
      temperature: 0,
      system: `You are a Teaching Assistant at a university level, responsible for evaluating student responses across various courses. Your task is to read the provided question and student answer, then assess the response quality on a scale of 0 to 5.

      Scoring guidelines:
      0 - No answer provided or completely blank response
      1 - Nonsensical answer or completely incorrect/irrelevant response
      2 - Partially correct but significant misunderstandings present
      3 - Mostly correct with minor errors or omissions
      4 - Correct answer with good understanding demonstrated
      5 - Excellent answer showing comprehensive understanding and insight

      Please provide your evaluation in the following pipe-delimited format:
      SCORE|COMMENT

      The SCORE should be a single digit from 0 to 5.
      The COMMENT should provide a brief explanation of your scoring decision, highlighting strengths or areas for improvement in the student's response.

      Example output:
      4|The answer demonstrates a strong grasp of the concept with minor details missing.

      Evaluate the student's response thoughtfully and provide constructive feedback.`,
      messages: [
        {
          role: "user",
          content: `Question: ${question}\nAnswer: ${answer}`
        }
      ]
    });

    if (message.content && message.content.length > 0) {
      const content = message.content[0];
      if (typeof content === 'object' && 'text' in content) {
        return content.text;
      }
    }
    throw new Error('Unexpected response format');
  } catch (error) {
    console.error('Error in API call:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return "0|Error in API call";
  }
}

function extractScoreAndComment(response: string): [number, string] {
  const match = response.match(/^(\d)\|(.*)/);
  if (match) {
    return [parseInt(match[1]), match[2].trim()];
  }
  return [0, response];
}

function calculateSummary(responses: GradedResponse[], maxScore: number) {
  const summary = responses.reduce((acc, response) => {
    if (!acc[response.student]) {
      acc[response.student] = { mcScore: 0, aiScore: 0 };
    }
    acc[response.student].mcScore = Math.max(acc[response.student].mcScore, response.mcScore);
    acc[response.student].aiScore += response.aiScore;
    return acc;
  }, {} as Record<string, { mcScore: number; aiScore: number }>);

  const maxTotal = Math.max(...Object.values(summary).map(s => s.mcScore + s.aiScore));

  return Object.entries(summary).map(([student, scores]) => ({
    student,
    mcScore: scores.mcScore,
    aiScore: scores.aiScore,
    totalWithBellcurve: scores.mcScore + scores.aiScore,
    scoreOutOf: ((scores.mcScore + scores.aiScore) / maxTotal) * maxScore
  }));
}

function identifyWorstQuestion(responses: GradedResponse[]) {
  const questionScores = responses.reduce((acc, response) => {
    if (!acc[response.question]) {
      acc[response.question] = { total: 0, count: 0 };
    }
    acc[response.question].total += response.aiScore;
    acc[response.question].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  let worstQuestion = '';
  let lowestAverage = Infinity;

  for (const [question, scores] of Object.entries(questionScores)) {
    const average = scores.total / scores.count;
    if (average < lowestAverage) {
      lowestAverage = average;
      worstQuestion = question;
    }
  }

  return { question: worstQuestion, averageScore: lowestAverage };
}
