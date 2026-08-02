import React from 'react';

/* Shimmer keyframe */
const style = '@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }';

const Bone = ({ h = '12px', w = '100%', r = '8px', mb = 0 }) => (
  <div style={{
    height: h, width: w, borderRadius: r, marginBottom: mb,
    background: 'linear-gradient(90deg, var(--color-border) 25%, rgba(229,231,235,0.4) 50%, var(--color-border) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s infinite ease-in-out',
  }} />
);

export const CardSkeleton = ({ count = 4 }) => (
  <>
    <style>{style}</style>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="admin-stat-card">
          <Bone h="11px" w="50%" mb={10} />
          <Bone h="28px" w="60%" mb={14} />
          <Bone h="10px" w="75%" />
        </div>
      ))}
    </div>
  </>
);

export const TableSkeleton = ({ rows = 6 }) => (
  <>
    <style>{style}</style>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr', gap: 16, padding: '11px 16px', borderBottom: '1px solid var(--color-border)' }}>
        {[...Array(5)].map((_, i) => <Bone key={i} h="10px" />)}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr', gap: 16, padding: '14px 16px', borderBottom: '1px solid var(--color-border)', alignItems: 'center' }}>
          <Bone h="36px" w="36px" r="10px" />
          <Bone h="13px" />
          <Bone h="13px" />
          <Bone h="22px" r="99px" w="70px" />
          <Bone h="13px" w="60%" />
        </div>
      ))}
    </div>
  </>
);

export const FormSkeleton = () => (
  <>
    <style>{style}</style>
    <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Bone h="14px" w="30%" mb={4} />
      <Bone h="40px" mb={4} />
      <Bone h="14px" w="30%" mb={4} />
      <Bone h="40px" mb={4} />
      <Bone h="14px" w="30%" mb={4} />
      <Bone h="100px" />
    </div>
  </>
);

export default { CardSkeleton, TableSkeleton, FormSkeleton };
