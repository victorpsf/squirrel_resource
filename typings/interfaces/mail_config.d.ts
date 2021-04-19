declare interface MailConfig {
  host: string;
  port: number;
  service: 'gmail' | 'outlook',
  auth?: {
    user: string,
    pass: string
  }
}

export = MailConfig