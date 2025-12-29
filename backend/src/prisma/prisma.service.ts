import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        // Write certificate to file if SSL_CERT exists
        let certPath: string | undefined;
        if (process.env.SSL_CERT) {
            certPath = path.join(__dirname, '..', '..', 'ca-certificate.crt');
            fs.writeFileSync(certPath, process.env.SSL_CERT.replace(/\\n/g, '\n'));
        }

        // SSL is enabled and encrypted with certificate verification
        const pool = new Pool({ 
            connectionString: process.env.DATABASE_URL,
            ssl: certPath ? {
                rejectUnauthorized: true,
                ca: fs.readFileSync(certPath).toString()
            } : {
                rejectUnauthorized: false
            }
        });
        const adapter = new PrismaPg(pool);
        super({
            adapter: adapter,
        });
    }

    async onModuleInit() {
        await this.$connect();
    }
}

