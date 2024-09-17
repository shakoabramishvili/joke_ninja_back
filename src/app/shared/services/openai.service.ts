import { Injectable } from "@nestjs/common";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY,
    organization: 'org-UZ9E9KRTrwjVl8dvg9M8CMLU',
    // project: 'proj_hNGMsrFCY2FWowRgP6s5FXMn'
});

@Injectable()
export class OpenAIService {
    async main() {
        // console.log(openai)
        const image = await openai.images.generate({ 
            model: "dall-e-3", 
            prompt: "A cartoon surgeon in an operating room holding a lunchbox with a pie labeled 'Kidney Pie.' The scene is light-hearted with medical instruments around, and the surgeon is smiling mischievously as the patient sleeps peacefully." ,
            style: 'vivid'
        });
        console.log(image.data);
      }
}


// main();