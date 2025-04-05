import AsyncStorage from '@react-native-async-storage/async-storage';
import { Environment, EnvironmentConfig, environmentConfigs } from './environmentConfig';

const ENV_STORAGE_KEY = 'SPITBALL_ENVIRONMENT';

class EnvironmentService {
  private currentEnvironment: Environment = 'dev'; // Default to dev
  
  constructor() {
    this.loadSavedEnvironment();
  }

  /**
   * Load the saved environment from AsyncStorage
   */
  private async loadSavedEnvironment(): Promise<void> {
    try {
      const savedEnv = await AsyncStorage.getItem(ENV_STORAGE_KEY);
      if (savedEnv && this.isValidEnvironment(savedEnv)) {
        this.currentEnvironment = savedEnv as Environment;
        console.log(`Loaded environment: ${savedEnv}`);
      } else {
        // If no saved environment or invalid, default to dev and save it
        await this.setEnvironment('dev');
      }
    } catch (error) {
      console.error('Failed to load environment:', error);
      // Default to dev in case of error
      this.currentEnvironment = 'dev';
    }
  }

  /**
   * Validate that the given string is a valid environment
   */
  private isValidEnvironment(env: string): boolean {
    return ['dev', 'test', 'live'].includes(env);
  }

  /**
   * Get the current environment
   */
  public getEnvironment(): Environment {
    return this.currentEnvironment;
  }

  /**
   * Get the current environment configuration
   */
  public getConfig(): EnvironmentConfig {
    return environmentConfigs[this.currentEnvironment];
  }

  /**
   * Set the current environment and save it to AsyncStorage
   */
  public async setEnvironment(environment: Environment): Promise<void> {
    if (!this.isValidEnvironment(environment)) {
      throw new Error(`Invalid environment: ${environment}`);
    }
    
    this.currentEnvironment = environment;
    
    try {
      await AsyncStorage.setItem(ENV_STORAGE_KEY, environment);
      console.log(`Environment set to: ${environment}`);
    } catch (error) {
      console.error('Failed to save environment:', error);
      throw error;
    }
  }

  /**
   * Cycle to the next environment (dev -> test -> live -> dev)
   */
  public async cycleEnvironment(): Promise<Environment> {
    const environments: Environment[] = ['dev', 'test', 'live'];
    const currentIndex = environments.indexOf(this.currentEnvironment);
    const nextIndex = (currentIndex + 1) % environments.length;
    const nextEnvironment = environments[nextIndex];
    
    await this.setEnvironment(nextEnvironment);
    return nextEnvironment;
  }
}

// Export as a singleton
export const environmentService = new EnvironmentService();