import { get } from '@vercel/edge-config';
import nodemailer from 'nodemailer';
import Get from './edgeClient';

const host = await Get('mail-host');
const port = await Get('mail-port');
const user = await Get('mail-user');
const pass = await Get('mail-pass');

export const transporter = nodemailer.createTransport({
  host: host?.toString(),
  port: Number(port),
  // secure: true,
  auth: {
    user,
    pass,
  },
} as any);