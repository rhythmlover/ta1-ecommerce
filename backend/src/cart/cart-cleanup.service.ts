import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CartService } from './cart.service';

@Injectable()
export class CartCleanupService {
    private readonly logger = new Logger(CartCleanupService.name);

    constructor(private cartService: CartService) {}

    // Run cleanup every day at 2 AM
    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async handleDailyCleanup() {
        this.logger.log('Starting daily cart cleanup...');
        
        try {
            // Clean up carts older than 7 days
            const inactiveCount = await this.cartService.cleanupInactiveCarts(7);
            
            // Clean up empty carts
            const emptyCount = await this.cartService.cleanupEmptyCarts();
            
            this.logger.log(`Daily cleanup completed: ${inactiveCount} inactive carts, ${emptyCount} empty carts removed`);
        } catch (error) {
            this.logger.error('Failed to run daily cleanup:', error);
        }
    }

    // Run aggressive cleanup weekly on Sundays at 3 AM
    @Cron('0 3 * * 0') // Every Sunday at 3 AM
    async handleWeeklyCleanup() {
        this.logger.log('Starting weekly aggressive cleanup...');
        
        try {
            const count = await this.cartService.cleanupInactiveCarts(3);
            this.logger.log(`Weekly cleanup completed: ${count} carts removed`);
        } catch (error) {
            this.logger.error('Failed to run weekly cleanup:', error);
        }
    }

    // Clean empty carts every 6 hours
    @Cron(CronExpression.EVERY_6_HOURS)
    async handleFrequentEmptyCleanup() {
        this.logger.log('Starting 6-hour empty cart cleanup...');
        
        try {
            const count = await this.cartService.cleanupEmptyCarts();
            if (count > 0) {
                this.logger.log(`6-hour cleanup completed: ${count} empty carts removed`);
            }
        } catch (error) {
            this.logger.error('Failed to run 6-hour cleanup:', error);
        }
    }

    // Manual cleanup method
    async runManualCleanup(daysOld: number = 7): Promise<{ inactive: number; empty: number }> {
        this.logger.log(`Running manual cleanup for carts older than ${daysOld} days...`);
        
        const inactive = await this.cartService.cleanupInactiveCarts(daysOld);
        const empty = await this.cartService.cleanupEmptyCarts();
        
        this.logger.log(`Manual cleanup completed: ${inactive} inactive, ${empty} empty carts removed`);
        
        return { inactive, empty };
    }

    // Manual cleanup of all guest carts
    async runManualGuestCleanup(): Promise<number> {
        this.logger.log(`Running manual cleanup for all guest carts...`);
        
        const count = await this.cartService.cleanupAllGuestCarts();
        
        this.logger.log(`Manual guest cart cleanup completed: ${count} guest carts removed`);
        
        return count;
    }
}
