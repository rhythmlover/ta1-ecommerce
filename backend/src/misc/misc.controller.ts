import { Controller, Body, Post, Get } from "@nestjs/common";
import { MiscService } from "./misc.service";
import { InquiryDto } from "./dto";

@Controller("misc")
export class MiscController {
    constructor(private miscService: MiscService) {}

    @Post('send-inquiry-email')
    sendEmail(@Body() inquiryInfo: InquiryDto) {
        return this.miscService.sendInquiry(inquiryInfo);
    }

    @Get('get-announcement')
    getAnnouncement() {
        return this.miscService.getAnnouncement();
    }
}