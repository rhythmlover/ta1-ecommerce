import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartItemDto } from "./dto";

@Controller("cart")
export class CartController {
    constructor(private cartService: CartService) {}

    @Get("get/:userId")
    displayUserCart(@Param("userId") userId: string) {
        return this.cartService.displayUserCart(userId);
    }

    @Post("create/:userId")
    createCart(@Param("userId") userId: string) {
        return this.cartService.createCart(userId);
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
}
