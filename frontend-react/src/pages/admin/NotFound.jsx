// Admin 404 Route Handler Page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Card, Button } from '../../components/admin/UI';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-height-[60vh] py-12">
      <Card className="w-full max-w-md p-8 text-center flex flex-col items-center justify-center shadow-soft">
        <div className="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-xl font-semibold text-text mb-2">
          404 - Page Not Found
        </h2>
        <p className="text-sm text-muted max-w-sm mb-6 leading-relaxed">
          The administrative panel page you are trying to access does not exist or has been moved to another sub-route.
        </p>
        <Button variant="primary" onClick={() => navigate('/admin')}>
          Back to Dashboard
        </Button>
      </Card>
    </div>
  );
};

export default NotFound;

