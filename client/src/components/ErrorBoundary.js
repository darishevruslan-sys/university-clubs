import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Unexpected error during render', error, info);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Что-то пошло не так.</h1>
          <p>Попробуйте обновить страницу или вернуться позже.</p>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
