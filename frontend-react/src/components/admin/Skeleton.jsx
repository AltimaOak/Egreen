// Skeleton Loading Placeholders Component
import React from 'react';

export const CardSkeleton = () => (
  <div className="admin-card">
    <div className="admin-skeleton admin-skeleton-title" style={{ width: '40%' }}></div>
    <div className="admin-skeleton admin-skeleton-text" style={{ height: '36px', width: '80%', marginBottom: '16px' }}></div>
    <div className="admin-skeleton admin-skeleton-text" style={{ width: '60%' }}></div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="admin-table-container">
    <table className="admin-table">
      <thead>
        <tr>
          {Array.from({ length: 5 }).map((_, i) => (
            <th key={i}>
              <div className="admin-skeleton" style={{ height: '14px', width: '80px' }}></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: 5 }).map((_, colIndex) => (
              <td key={colIndex}>
                {colIndex === 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="admin-skeleton" style={{ width: '32px', height: '32px', borderRadius: '6px' }}></div>
                    <div className="admin-skeleton" style={{ height: '14px', width: '120px' }}></div>
                  </div>
                ) : (
                  <div className="admin-skeleton" style={{ height: '14px', width: colIndex === 4 ? '60px' : '90px' }}></div>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const FormSkeleton = () => (
  <div className="admin-card">
    <div className="admin-skeleton admin-skeleton-title" style={{ marginBottom: '24px' }}></div>
    {Array.from({ length: 4 }).map((_, idx) => (
      <div key={idx} className="admin-form-group">
        <div className="admin-skeleton" style={{ height: '14px', width: '120px', marginBottom: '8px' }}></div>
        <div className="admin-skeleton" style={{ height: '38px', width: '100%', borderRadius: '8px' }}></div>
      </div>
    ))}
    <div className="flex justify-between mt-4">
      <div className="admin-skeleton" style={{ height: '38px', width: '100px', borderRadius: '8px' }}></div>
      <div className="admin-skeleton" style={{ height: '38px', width: '140px', borderRadius: '8px' }}></div>
    </div>
  </div>
);

const Skeleton = {
  Card: CardSkeleton,
  Table: TableSkeleton,
  Form: FormSkeleton
};

export default Skeleton;
