type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogPayload {
  message: string;
  level: LogLevel;
  context?: Record<string, any>;
  timestamp: string;
  [key: string]: any;
}

class Logger {
  private isDev = process.env.NODE_ENV !== 'production';
  
  constructor(private source: string) {}
  
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>
  ): LogPayload {
    return {
      message,
      level,
      source: this.source,
      context,
      timestamp: new Date().toISOString(),
    };
  }
  
  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    const logEntry = this.createLogEntry(level, message, context);
    
    // In development, log to console with nice formatting
    if (this.isDev) {
      const colorMap = {
        debug: '#7f8c8d', // gray
        info: '#2ecc71',  // green
        warn: '#f39c12',  // yellow
        error: '#e74c3c'  // red
      };
      
      console.log(
        `%c${logEntry.level.toUpperCase()} [${logEntry.source}]`,
        `color: ${colorMap[level]}; font-weight: bold`,
        message,
        context || ''
      );
      return;
    }
    
    // In production, log structured data that could be sent to a logging service
    switch (level) {
      case 'debug':
        console.debug(logEntry);
        break;
      case 'info':
        console.info(logEntry);
        break;
      case 'warn':
        console.warn(logEntry);
        break;
      case 'error':
        console.error(logEntry);
        
        // In production, you could send to a logging service like Sentry
        // if (typeof window !== 'undefined' && window.Sentry) {
        //   window.Sentry.captureMessage(message, {
        //     level,
        //     extra: context
        //   });
        // }
        break;
    }
  }
  
  public debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context);
  }
  
  public info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }
  
  public warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }
  
  public error(message: string, context?: Record<string, any>): void {
    this.log('error', message, context);
  }
  
  // Log and throw an error that can be caught by the error boundary
  public throwError(message: string, context?: Record<string, any>): never {
    this.error(message, context);
    throw new Error(message);
  }
}

// Factory function to create loggers for different components
export function createLogger(source: string): Logger {
  return new Logger(source);
}
