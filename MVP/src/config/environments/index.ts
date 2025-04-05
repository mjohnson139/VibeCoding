export * from './environmentConfig';
export * from './environmentService';

// Re-export the singleton for easy access
import { environmentService } from './environmentService';
export { environmentService };