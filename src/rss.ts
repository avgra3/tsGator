import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
	channel: {
		title: string;
		link: string;
		description: string;
		item: RSSItem[];
	};
};

type RSSItem = {
	title: string;
	link: string;
	description: string;
	pubDate: string;
}

export async function fetchFeed(feedURL: string) {
	const headers = new Headers();
	headers.set("User-Agent", "gator");
	const requestOptions = {
		method: "GET",
		headers: headers,
	};
	const feedURLResponse = await fetch(feedURL, requestOptions);
	if (!feedURLResponse.ok) {
		throw new Error(`ERROR: Reveived error from request. Message => ${feedURLResponse.statusText}`);
	}
	const responseText = await feedURLResponse.text();
	const parser = new XMLParser();
	const jObj = parser.parse(responseText);
	console.log(jObj);
	if (!jObj.hasOwnProperty("rss")) {
		throw new Error(`ERROR: Response does not have field "rss"`);
	}
	const rss = jObj.rss;
	if (!rss.hasOwnProperty("channel")) {
		throw new Error(`ERROR: Response does not have field "channel"`);
	}
	const channel = rss.channel;
	const neededFields = ["title", "description", "link"];
	neededFields.forEach((value, _) => {
		if (!channel.hasOwnProperty(value)) {
			throw new Error(`ERROR: Response does not have field "${value}"`);
		}
	});

	const title: string = channel.title;
	const link: string = channel.link;
	const description: string = channel.description;

	const itemChannel: any[] = []
	if (channel.hasOwnProperty("item") && Array.isArray(channel.item)) {
		channel.item.forEach((value: any) => {
			itemChannel.push(value);
		});
	}
	const items: RSSItem[] = [];
	itemChannel.forEach((value, _) => {
		if (value.hasOwnProperty("title")
			&& value.hasOwnProperty("link")
			&& value.hasOwnProperty("description")
			&& value.hasOwnProperty("pubDate")) {
			try {
				const rssItem: RSSItem = {
					title: value.title,
					link: value.link,
					description: value.description,
					pubDate: value.pubDate,
				}
				items.push(rssItem);
			} catch (error) {
				console.error(`ERROR: rssItem was invalid:`, error);
			}
		}
	});
	const rssFeed: RSSFeed = {
		channel: {
			title: title,
			link: link,
			description: description,
			item: items,
		}
	};
	return rssFeed;
}
