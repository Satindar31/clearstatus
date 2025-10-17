import { get } from '@vercel/edge-config';
import nodemailer from 'nodemailer';

const host = await get('mail-host');
const port = await get('mail-port');
const user = await get('mail-user');
const pass = await get('mail-pass');

export const transporter = nodemailer.createTransport({
  host: host?.toString(),
  port: Number(port),
  // secure: true,
  auth: {
    user,
    pass,
  },
} as any);