// import './BrandBadge.css';

function BrandBadge({ brand }) {
  // Brand color mapping
  const brandColors = {
    'shell': '#DD1D21',
    'bp': '#00A651',
    'caltex': '#0066B3',
    'ampol': '#0066B3',
    '7eleven': '#FF6600',
    'united': '#E31937',
    'metro': '#00529B',
    'coles': '#E4002B',
    'woolworths': '#3DB54A',
    'default': '#666666'
  };
  
  const color = brandColors[brand.toLowerCase()] || brandColors['default'];
  
  return (
    <div 
      className="brand-badge" 
      style={{ backgroundColor: color }}
    />
  );
}

export default BrandBadge;