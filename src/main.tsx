import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class RootErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Unhandled Root Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.removeItem('immerse_lume_admin_token');
    } catch (e) {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#1C1B1A] text-[#FDFBF7] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#242220] border border-[#33302C] p-8 shadow-2xl space-y-6">
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#DFC27D] font-medium block">
              Immerse Lume
            </span>
            <h2 className="font-serif text-2xl font-normal text-white">
              Temporary Display Recovery
            </h2>
            <p className="text-xs text-[#8A7E72] font-light leading-relaxed">
              We encountered a client-side display exception. Click below to refresh your view.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
              >
                Reload Website
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 py-3 bg-[#1C1B1A] hover:bg-[#33302C] border border-[#33302C] text-[#EAE3D2] text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Return to Storefront
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  );
}
