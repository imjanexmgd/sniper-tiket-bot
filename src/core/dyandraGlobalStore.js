import axios from 'axios';

export default async function dyandraGlobalStore(targetUrl) {
  const maxRetryingCount = 3;
  let retryingCount = 1;
  const jsonName = targetUrl.replace('https://', '').replace('/', '');
  let url = `https://assets.loket.com/lp/sdk/prod/manifest/${jsonName}.json`;

  while (retryingCount <= maxRetryingCount) {
    try {
      const { data } = await axios.get(url, {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.8',
          'cache-control': 'no-cache',
          origin: targetUrl,
          pragma: 'no-cache',
          priority: 'u=1, i',
          referer: targetUrl,
          'sec-ch-ua':
            '"Not)A;Brand";v="8", "Chromium";v="138", "Brave";v="138"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          'sec-gpc': '1',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        },
      });

      return data;
    } catch (error) {
      console.log(
        `Failed to fetch bibi concert info (attempt ${retryingCount}/${maxRetryingCount})`
      );
      console.log('Error:', error.message);
      console.log(error);

      break;
      if (retryingCount === maxRetryingCount) {
        throw error;
      }

      retryingCount++;
    }
  }
}
