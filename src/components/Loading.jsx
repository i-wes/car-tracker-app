import React from 'react';
import { Loader2 } from 'lucide-react';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <Loader2 size={48} className="loading-spinner" />
      <p className="text-muted" style={{ marginTop: '1rem' }}>Synchronizacja z bazą danych...</p>
    </div>
  );
};

export default Loading;
