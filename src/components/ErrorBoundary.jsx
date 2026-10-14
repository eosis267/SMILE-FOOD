import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    localStorage.removeItem('smilefood_cart');
    window.location.reload();
  };

  handleResetAll = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5F6F5] dark:bg-[#0F1311] flex items-center justify-center p-6 text-center font-['Outfit']">
          <div className="max-w-md w-full bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-3xl p-8 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#D95353]/10 text-[#D95353] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ⚠️
            </div>
            <h1 className="text-2xl font-extrabold text-[#171917] dark:text-[#F0F5F2] mb-2">
              Something went wrong
            </h1>
            <p className="text-[14px] text-[#777D79] dark:text-[#8E9A92] mb-6">
              An unexpected error occurred while rendering this page.
            </p>
            {this.state.error && (
              <div className="p-3 mb-6 bg-[#F5F6F5] dark:bg-[#0F1311] rounded-xl text-left text-[12px] font-mono text-[#D95353] overflow-x-auto max-h-32 border border-[#EEEEEE] dark:border-[#27332A]">
                {this.state.error.toString()}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-full bg-[#079B48] hover:bg-[#06843D] text-white font-bold text-[14px] transition-all shadow-md"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleResetAll}
                className="px-5 py-2.5 rounded-full border border-[#EEEEEE] dark:border-[#27332A] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] text-[#171917] dark:text-[#F0F5F2] font-bold text-[14px] transition-all"
              >
                Reset & Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
