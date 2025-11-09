'use client';

export default function Footer() {
  const handleGetStarted = () => {
    const pathSection = document.getElementById('choose-path');
    pathSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer style={footerStyle}>
     
        
        <div style={footerBottomStyle}>
          <p style={copyrightStyle}>
            © 2025 Next Earth. Empowering climate action worldwide.
          </p>
        </div>
    </footer>
  );
}

// Inline styles for simplicity and reliability
const footerStyle: React.CSSProperties = {
  background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
  padding: '4rem 0 2rem 0',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'relative',
  width: '100%',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '0 2rem',
  width: '100%',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '3rem',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
  fontWeight: '800',
  background: 'linear-gradient(135deg, #ffffff, #2d7a4f)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '1rem',
  lineHeight: '1.2',
};

const earthStyle: React.CSSProperties = {
  display: 'inline-block',
  animation: 'bounce 2s infinite',
  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 'clamp(1rem, 3vw, 1.3rem)',
  color: '#cbd5e1',
  marginBottom: '2rem',
  lineHeight: '1.5',
};

const buttonStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #2d7a4f, #3d9b63)',
  border: 'none',
  padding: '1rem 2.5rem',
  borderRadius: '50px',
  fontSize: '1.1rem',
  fontWeight: '600',
  color: 'white',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
  minWidth: '160px',
};

const footerBottomStyle: React.CSSProperties = {
  textAlign: 'center',
  paddingTop: '2rem',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
};

const copyrightStyle: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: '0.9rem',
};

// Add the bounce animation to global CSS
const styles = `
@keyframes bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.1); }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}