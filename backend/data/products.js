const products = [
  {
    title: 'Reserve Collection',
    price: 48.0,
    rating: 4.9,
    description: 'Our signature single-origin estate blend, noted for its peppery finish and buttery undertones.',
    volume: '500ml',
    region: 'Tunisia',
    badge: 'Harvest 2024',
    badgeType: 'primary',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuD4ByUjGacuLxWtbDxcz4kGpUSx7s01qJl4bI33eIxuKBrwC76UFi2MgK_xviAlXB2_mM3HKzLcbcD6IXwo6k3Nm5EElOq0YtkV5ed6S1Jiy7V6BEV2C6n1cKVZ3E1EyLmxw0iL4Zp6o9S4oTSGGJZzoHDsKrLTrAlcJSV_zCEOPZ3F-icrieUEaU7Qt5OIOH6afwUkCRR8JfZR69AzXfLflx6_hBvijVE0Qr4tlUYtr8OcNLC5ZMKrMg'],
    countInStock: 15,
    category: 'Reserve Estate'
  },
  {
    title: 'Chemlali Gold',
    price: 64.0,
    rating: 5.0,
    description: 'A robust, intense oil extracted from ancient trees in the Sahel region.',
    volume: '750ml',
    region: 'Sahel',
    badge: null,
    badgeType: null,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAw8F6qi80OSwtec9Z_SY8xz2Grx2K5ejvwAkNiouUR13bpAFez6UTyb8HCfugcpUAUh--xR0JBzXujEzG3e5xnFehmG1FB_da45Bm8A-Ij7EBmPYyg8iB4JJuh3vSOCdWG28WgIByAOADmC13e5LhBqOyjMR4-9zoKO5lDxFscyXd-Q0xqzNve9Is49DFGxvtBOwjJL9oaFEzoAqXeRZ68ZWDt3sfInXp6-VwYXGL2tfRlsq2VweFfwA'],
    countInStock: 8,
    category: 'Limited Harvest'
  },
  {
    title: 'Heritage Trio Set',
    price: 120.0,
    rating: 4.8,
    description: 'A curated discovery flight of our most distinguished varietals in 250ml artisanal bottles.',
    volume: '3x250ml',
    region: 'Multi-Region',
    badge: 'Gift Choice',
    badgeType: 'secondary',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBujlZkatz7C6kyHcSKXMlMnC8w0F28U3XmwRh7Jv_SUd2UpinoitWpt_9Dl7bsGGUo1j7aB_ypeKlmES7IbFelzjv8wflbHLynnHhTwTLuusXTxmEoviZFcI3-fxEl4n_-H-_ojNl4q_mfMGeW-qIyrckJGHdPpim4bwheSZeiYYsnVA8fINwNohnpYLaxXM-9tZauG0bZCTk6DXLw1N3rQDhxlov4DK00x74gFXwTK0Cs0F9Hmy7yUQ'],
    countInStock: 5,
    category: 'Limited Harvest'
  },
  {
    title: 'Carthage Amphora',
    price: 185.0,
    rating: 4.9,
    description: 'Limited edition hand-thrown ceramic vessel filled with our ultra-premium Early Harvest oil.',
    volume: '1000ml',
    region: 'Cap Bon',
    badge: null,
    badgeType: null,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBF-fCq1OG_kxJ4F6N97IKiMLF_gloGNEMHBsz78RyvnAqlDmNZFSEIsK9CE2XsHJy51hDUnzXseeWjOvyhjLmR8BpUncR4dxUQXEM5taqNi6Oyii4mKzASf73prSI57PFe9m-O_UpBDCBcIK4_TNJ3UszzWc8Hgp4aH8JgtMFhO6E1ORaevBbG6EKVMo5F6wXmnjH2dksY_dUtxALvkCmg3Qsyp500rMefkvDf2_ViyBUEr5nzpw5qzw'],
    countInStock: 3,
    category: 'Reserve Estate'
  },
  {
    title: 'Black Label 1904',
    price: 58.0,
    rating: 5.0,
    description: 'Centenary grove oil, harvested at peak maturity for a smooth, complex profile.',
    volume: '500ml',
    region: 'Sfax',
    badge: null,
    badgeType: null,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBfgSWWoDrdA65U-uLk3i-hAKGUn3BE3dxcmFaOdOKxVqIfY59LeUAFjMgXujhN9bKIbgkq5NIR2kQm52xwB_rooyqs-7mNbWAmoMnO5u22nLEsH4yb80QTEv69er7Bq3K7Pt8_aj2inRkUL4pDvgdWea6FWxCaaol9CKER-DTbbnXtNTVUCT8STsgTxhbQv9d4A6skAm9QTf9MDd8Z-Qu6PYSNG7Ni1RFwKJJtncMT3YjaPOQqF4gfWA'],
    countInStock: 12,
    category: 'Reserve Estate'
  },
  {
    title: 'Early Harvest White',
    price: 42.0,
    rating: 4.7,
    description: 'Delicate and floral, this oil is perfect for light salads and artisanal cheeses.',
    volume: '500ml',
    region: 'Zaghouan',
    badge: null,
    badgeType: null,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAv6UZoo1OGqI0aKJ7KL3hREhUrnayvsCQjnicd3b_CgYLe30y9xEumhdoLdB3Sz7-VKg3PVmBCfuRFSDjs__09KtXgw4EhagySLUlbt5u2NY6loEe4EGku0fKQzGiWRzuP0ybdNQiuxP2Kv2YQbX3tTObUodE5laKrbETwqfxehorbdxdpMJou2hbAsB0I54FtT4wLx9uHOeNiZz1cfFIKXK_zmLDG06ylSZyiFO9BIIlKkGSjEW3nzQ'],
    countInStock: 20,
    category: 'Infusions'
  }
];

export default products;
