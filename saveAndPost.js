const puppeteer = require('puppeteer');
const env = require('dotenv').config()
const tools = require('./tools');
const eol = require('os').EOL;

module.exports ={
	post: function(url,title,imgUrl,description){
		(async () => {
			const browser=await puppeteer.launch({headless: false});
			const page=await browser.newPage();

			await page.setDefaultNavigationTimeout(0);

			await page.setViewport({
				width: 1000,
				height: 500,
				deviceScaleFactor: 1,
			});

			console.log('Opening site');

			try{
				await page.goto(process.env.POST_URL);
			}catch(e){
				console.log(e);
				process.exit(1)
			}

			var mail=process.env.USER_MAIL;
			var pass=process.env.USER_PASSWORD;
			var groupSlug=process.env.DELFI_GROUP_SLUG;

			if(tools.stripos(page.url(),'/login')!==false){
				await page.$eval('#email', (el, email) => el.value = email, mail);
				await page.$eval('#password', (el, password) => el.value = password, pass);
				await page.click("#remember");
				await page.click('#login_button');
			}

			var text='<p><img style="width: 50%;" src="'+imgUrl+'"></p>'+eol+description;

			await page.$eval('#title', (el, title) => el.value = title, title);
			await page.$eval('#group', (el, group) => el.value = group, groupSlug);
			await page.click(".note-icon-code");
			await page.focus('#text');
			await page.keyboard.down('Control');
			await page.keyboard.press('A');
			await page.keyboard.up('Control');
			await page.keyboard.press('Backspace');
			await page.keyboard.type(text);
			await page.click(".note-icon-code");
			await page.click("#iframe_mode");
			await page.$eval('#iframe_url', (el, iframe_url) => el.value = iframe_url, url);

			await page.click('#submit_button');
			await browser.close();
		})();
	},

}
