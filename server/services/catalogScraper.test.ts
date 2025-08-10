// Quick test for the catalog scraper
import { catalogScraper } from './catalogScraper';

const testContent = `
## PATTA POTH 22K

[![Patti Long Poth 22K](https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OUANr2XivMO9ndCXNbm.jpg)\\
\\
Patti Long Poth 22K\\
\\
78 items](https://mamdejewellers.catalog.to/s/mamde-jewellers-/patti-long-poth-22k/kk7 "Patti Long Poth 22K")

## NECKLACE 22K

[![Temple Necklace 22K](https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OQbGrKDYWOMt4I1P3_D.jpg)\\
\\
Temple Necklace 22K\\
\\
26 items](https://mamdejewellers.catalog.to/s/mamde-jewellers-/temple-necklace-22k/qls "Temple Necklace 22K")
`;

export async function testCatalogScraper() {
  console.log('Testing catalog scraper...');
  const products = await catalogScraper.scrapeProducts(testContent);
  console.log('Test results:', products);
  return products;
}