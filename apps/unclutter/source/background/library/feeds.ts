import {
    getMainFeed,
    discoverDomainFeeds,
    getHeuristicFeedUrls,
} from "@unclutter/library-components/dist/feeds";
import { FeedSubscription } from "@unclutter/library-components/dist/store";

export async function discoverRssFeed(
    sourceUrl: string,
    candidates: string[]
): Promise<FeedSubscription> {
    if (candidates.length === 0) {
        candidates = await discoverDomainFeeds(sourceUrl);
    }
    if (candidates.length === 0) {
        candidates = getHeuristicFeedUrls(sourceUrl);
    }

    return await getMainFeed(sourceUrl, candidates);
}
