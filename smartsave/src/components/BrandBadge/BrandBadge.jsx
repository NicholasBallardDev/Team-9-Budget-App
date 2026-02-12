// import './BrandBadge.css';

function BrandBadge({ brand }) {
  const color = getBrandColor(brand);
  
  return (
    <div 
      className="brand-badge" 
      style={{ backgroundColor: color }}
    />
  );
}

export default BrandBadge;
