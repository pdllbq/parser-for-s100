const puppeteer = require('puppeteer');
const tools = require('./tools');
const fs = require('fs');
const eol = require('os').EOL;
const crypto = require('crypto');
const post =require('./saveAndPost');


module.exports ={
	parse: function(){ 
		(async () => {
			const browser=await puppeteer.launch({headless: false});
			const page=await browser.newPage();

			await page.setViewport({
				width: 1000,
				height: 500,
				deviceScaleFactor: 1,
			});

			console.log('Opening site');

			await page.goto('https://rus.delfi.lv/');

			console.log('Searching links');

			const links='.text-size-22 a';
			await page.waitForSelector(links, { timeout: 0, waitUntil: "load"});
			const postUrls = await page.$$eval(
				links, allLinks => allLinks.map(link => link.href)
			);

			for(let postUrl of postUrls){
				if(tools.stripos(postUrl,'/news/daily/')!==false && tools.stripos(postUrl,'&com=1')==false){

					console.log('Opening post: '+postUrl);
				
					await page.setDefaultNavigationTimeout(0); 
					await page.goto(postUrl)

					var title =await page.$eval("head > meta[property='og:title']", element => element.content);
					var imgUrl =await page.$eval("head > meta[property='og:image']", element => element.content);
					var url =await page.$eval("head > meta[property='og:url']", element => element.content);
					var description =await page.$eval("head > meta[property='og:description']", element => element.content);

					var md5sum = crypto.createHash('md5').update(url).digest("hex");
					await fs.access('data/delfi/'+md5sum, function(error){
					    if (error) {
						fs.writeFile('data/delfi/'+md5sum,url+eol+title+eol+imgUrl+eol+description, function(err){
						    if (err) {
							console.log(err);
						    } else {
							console.log("Файл создан");
							post.post(url,title,imgUrl,description);
						    }
						});
					    } else {
						console.log("Файл найден");
					    }
					});

					console.log(url);
					console.log(title);
					console.log(imgUrl);
					console.log(description);
				}
			}

			process.exit(1)
			await browser.close();
		})();
	},

}
