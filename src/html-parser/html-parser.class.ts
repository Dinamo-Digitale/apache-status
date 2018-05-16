import * as cheerio from 'cheerio';

export class HtmlParser {

    $: CheerioStatic;

    constructor(html: string) {
        this.$ = this.parse(html);
    }

    private parse(html: string) {
        
        const $ = cheerio.load(html);
        
        if(!$) {
            throw new Error('Can\'t format the html');
        }

        return $;
        
    }

}
