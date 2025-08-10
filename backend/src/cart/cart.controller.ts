import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartItemDto } from "./dto";
import { CartCleanupService } from "./cart-cleanup.service";

@Controller("cart")
export class CartController {
    constructor(
        private cartService: CartService,
        private cartCleanupService: CartCleanupService
    ) {}

    @Get("get/:userId")
    displayUserCart(@Param("userId") userId: string) {
        return this.cartService.displayUserCart(userId);
    }

    @Get("get-session/:sessionId")
    displaySessionCart(@Param("sessionId") sessionId: string) {
        return this.cartService.displaySessionCart(sessionId);
    }

    @Post("create/:userId")
    createCart(@Param("userId") userId: string) {
        return this.cartService.createCart(userId);
    }

    @Post("create-session/:sessionId")
    createSessionCart(@Param("sessionId") sessionId: string) {
        return this.cartService.createSessionCart(sessionId);
    }

    @Post("merge-session-cart")
    mergeSessionCartToUserCart(@Body() body: { sessionId: string, userId: string }) {
        return this.cartService.mergeSessionCartToUserCart(body.sessionId, body.userId);
    }

    @Post("add-item")
    addCartItem(@Body() body: CartItemDto) {
        return this.cartService.addCartItem(body);
    }

    @Post("update-item/:id")
    updateCartItem(@Param("id") id: string, @Body() body: CartItemDto) {
        return this.cartService.updateCartItem(id, body);
    }

    @Delete("delete-item/:id")
    deleteCartItem(@Param("id") id: string) {
        return this.cartService.deleteCartItem(id);
    }

    @Post("update-total-cost/:cartId")
    updateTotalCost(@Param("cartId") cartId: string, @Body("totalCost") totalCost: number) {
        return this.cartService.updateTotalCost(cartId, totalCost);
    }

    @Get("clear-cart/:cartId")
    clearCart(@Param("cartId") cartId: string) {
        return this.cartService.clearCart(cartId);
    }

    @Post("cleanup-inactive")
    cleanupInactiveCarts(@Body("daysOld") daysOld?: number) {
        return this.cartService.cleanupInactiveCarts(daysOld || 7);
    }

    @Post("cleanup-empty")
    cleanupEmptyCarts() {
        return this.cartService.cleanupEmptyCarts();
    }

    @Post("manual-cleanup")
    runManualCleanup(@Body("daysOld") daysOld?: number) {
        return this.cartCleanupService.runManualCleanup(daysOld || 7);
    }

    @Post("manual-guest-cleanup")
    runManualGuestCleanup() {
        return this.cartCleanupService.runManualGuestCleanup();
    }
}
