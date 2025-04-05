// Environment Types
export type Environment = 'dev' | 'test' | 'live';

// Base configuration interface
export interface EnvironmentConfig {
  apiUrl: string;
  websocketUrl: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableAnalytics: boolean;
  showEnvironmentIndicator: boolean;
  environmentColor: string;
}

// Default configuration values
const defaultConfig: EnvironmentConfig = {
  apiUrl: 'https://api.spitball.app',
  websocketUrl: 'wss://ws.spitball.app',
  logLevel: 'info',
  enableAnalytics: true,
  showEnvironmentIndicator: true,
  environmentColor: '#ffffff', // White by default
};

// Development environment configuration
export const devConfig: EnvironmentConfig = {
  ...defaultConfig,
  apiUrl: 'https://dev-api.spitball.app',
  websocketUrl: 'wss://dev-ws.spitball.app',
  logLevel: 'debug',
  enableAnalytics: false,
  environmentColor: '#ff5757', // Red for dev
};

// Test environment configuration
export const testConfig: EnvironmentConfig = {
  ...defaultConfig,
  apiUrl: 'https://test-api.spitball.app',
  websocketUrl: 'wss://test-ws.spitball.app',
  logLevel: 'debug',
  enableAnalytics: true,
  environmentColor: '#ffbd59', // Orange for test
};

// Live/Production environment configuration
export const liveConfig: EnvironmentConfig = {
  ...defaultConfig,
  logLevel: 'error',
  environmentColor: '#4caf50', // Green for live
};

// Map of environment to config
export const environmentConfigs: Record<Environment, EnvironmentConfig> = {
  dev: devConfig,
  test: testConfig,
  live: liveConfig,
};