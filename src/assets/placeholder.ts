// A simple 300x300 placeholder image
export const placeholderImage = 'data:image/svg+xml;base64,' + btoa(`
<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="#e0e0e0"/>
  <text x="150" y="150" font-family="Arial" font-size="24" fill="#666" text-anchor="middle" dominant-baseline="middle">
    300 x 300
  </text>
  <rect x="10" y="10" width="280" height="280" fill="none" stroke="#666" stroke-width="2" stroke-dasharray="5,5"/>
</svg>
`); 

export const placeholderImageLarge = 'data:image/svg+xml;base64,' + btoa(`
<svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="1000" height="1000" fill="#e0e0e0"/>
  <text x="500" y="500" font-family="Arial" font-size="24" fill="#666" text-anchor="middle" dominant-baseline="middle">
    1000 x 1000
  </text>
  <rect x="10" y="10" width="980" height="980" fill="none" stroke="#666" stroke-width="2" stroke-dasharray="5,5"/>
</svg>
`); 