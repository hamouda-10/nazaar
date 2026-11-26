import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Handled gracefully by fallback UI without noisy crashes
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-[#f4f2ef] flex flex-col items-center justify-center p-6 text-center gap-4">
          <h1 className="font-editorial text-3xl text-[#f4f2ef]">دار نَظَر للبصريات</h1>
          <p className="text-sm text-[#9b9691] max-w-md">
            حدث خطأ غير متوقع في عرض الصفحة. اضغط بالأسفل لإعادة التحميل بسلاسة.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="min-h-[44px] px-6 py-2.5 text-sm font-medium bg-[#f4f2ef] text-black hover:bg-[#d4b483] rounded-md transition-colors cursor-pointer"
          >
            إعادة تحميل الموقع
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
