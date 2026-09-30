import { errorResponse, webhook } from '../../../citybeam/booking-server';
export async function POST(request: Request) { try { return await webhook(request); } catch(e) { return errorResponse(e); } }
