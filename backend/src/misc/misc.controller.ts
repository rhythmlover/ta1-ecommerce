import { Controller, Param, Body, Post, Get } from "@nestjs/common";
import { MiscService } from "./misc.service";
import { InquiryDto } from "./dto";

@Controller("misc")
export class MiscController {
    constructor(private miscService: MiscService) {}

    @Post('send-inquiry-email')
    sendEmail(@Body() inquiryInfo: InquiryDto) {
        console.log(inquiryInfo);
        return this.miscService.sendInquiry(inquiryInfo);
    }
}