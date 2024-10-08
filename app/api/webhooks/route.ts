/* eslint-disable camelcase */
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.action';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('WEBHOOK_SECRET is not set');
    return new Response('Internal Server Error', { status: 500 });
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing svix headers');
    return new Response('Bad Request', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  console.log('Received payload:', payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
    console.log('Verified event:', evt);
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Bad Request', { status: 400 });
  }

  const eventType = evt.type;
  console.log('Event type:', eventType);

  try {
    if (eventType === 'user.created') {
      const { id, email_addresses, image_url, username, first_name, last_name } = evt.data;
      console.log('Processing user.created event for user:', id);

      const mongoUser = await createUser({
        clerkId: id,
        name: `${first_name}${last_name ? ` ${last_name}` : ''}`,
        username: username!,
        email: email_addresses[0].email_address,
        picture: image_url,
      });

      console.log('User created in database:', mongoUser);
      return NextResponse.json({ message: 'OK', user: mongoUser });
    }

    if (eventType === 'user.updated') {
      const { id, email_addresses, image_url, username, first_name, last_name } = evt.data;
      console.log('Processing user.updated event for user:', id);

      const mongoUser = await updateUser({
        clerkId: id,
        updateData: {
          name: `${first_name}${last_name ? ` ${last_name}` : ''}`,
          username: username!,
          email: email_addresses[0].email_address,
          picture: image_url,
        },
        path: `/profile/${id}`
      });

      console.log('User updated in database:', mongoUser);
      return NextResponse.json({ message: 'OK', user: mongoUser });
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;
      console.log('Processing user.deleted event for user:', id);

      const deletedUser = await deleteUser({
        clerkId: id!,
      });

      console.log('User deleted from database:', deletedUser);
      return NextResponse.json({ message: 'OK', user: deletedUser });
    }

    console.log('Unsupported event type:', eventType);
    return NextResponse.json({ message: 'Event type not supported' });
  } catch (err) {
    console.error('Error processing event:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
