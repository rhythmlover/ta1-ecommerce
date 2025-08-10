# TA1 E-commerce Platform

A full-stack e-commerce application built with **Nuxt 3**, **NestJS**, and **PostgreSQL** with **Prisma ORM**.

## 🏗️ Tech Stack

### Frontend

- **Nuxt 3** - Vue.js framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Pinia** - State management

### Backend

- **NestJS** - Node.js framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Stripe** - Payment processing
- **@nestjs/schedule** - Cron job scheduling

Run database migrations:

```bash
npx prisma migrate dev
npx prisma generate
```

Start the backend:

```bash
cd backend
npm run start:dev
```

Start the frontend:

```bash
npm run dev
```

## 🧹 Automatic Cart Cleanup System

The application includes an automated cleanup system to prevent database bloat from abandoned guest carts.

### Cleanup Schedule

| **Time**           | **Frequency** | **Action**         | **Target**                                  |
| ------------------ | ------------- | ------------------ | ------------------------------------------- |
| **2:00 AM**        | Daily         | Full cleanup       | Guest carts older than 7 days + empty carts |
| **Every 6 hours**  | 4x daily      | Quick cleanup      | Empty guest carts only                      |
| **3:00 AM Sunday** | Weekly        | Aggressive cleanup | Guest carts older than 3 days               |

### Manual Cleanup API

```bash
# Run manual cleanup (default: 7 days old)
POST /cart/manual-cleanup
{
  "daysOld": 7
}

# Clean only inactive carts
POST /cart/cleanup-inactive
{
  "daysOld": 5
}

# Clean only empty carts
POST /cart/cleanup-empty
```

### Cleanup Implementation

The cleanup system consists of:

1. **CartCleanupService** - Handles scheduled cleanup tasks
2. **Cleanup Methods** in CartService:
    - `cleanupInactiveCarts(daysOld)` - Removes old guest carts
    - `cleanupEmptyCarts()` - Removes empty guest carts
3. **Cron Jobs** - Automated scheduling using `@nestjs/schedule`

```typescript
// Example: Daily cleanup at 2 AM
@Cron(CronExpression.EVERY_DAY_AT_2AM)
async handleDailyCleanup() {
  const inactiveCount = await this.cartService.cleanupInactiveCarts(7);
  const emptyCount = await this.cartService.cleanupEmptyCarts();
  this.logger.log(`Cleanup completed: ${inactiveCount} inactive, ${emptyCount} empty carts removed`);
}
```

## 🔧 Configuration

### Cart Cleanup Configuration

To modify cleanup schedules, edit `cart-cleanup.service.ts`:

```typescript
// Change cleanup frequency
@Cron('0 2 * * *') // Daily at 2 AM
@Cron('0 */6 * * *') // Every 6 hours
@Cron('0 3 * * 0') // Sundays at 3 AM

// Adjust age thresholds
await this.cartService.cleanupInactiveCarts(7); // 7 days
await this.cartService.cleanupInactiveCarts(3); // 3 days
```

## 📊 Monitoring

The cleanup system provides detailed logging:

```
[CartCleanupService] Starting daily cart cleanup...
[CartCleanupService] Daily cleanup completed: 15 inactive carts, 8 empty carts removed
[CartCleanupService] Weekly cleanup completed: 23 carts removed
```

Monitor cleanup effectiveness by:

1. Checking application logs
2. Monitoring database size
3. Tracking cart creation vs deletion rates

## 🔒 Security

- Guest sessions use cryptographically secure random IDs
- Session IDs are stored securely in Pinia with persistence
- Cleanup operations only target guest carts, preserving user data
- All cart operations include proper authorization checks
