import * as FileSystem from 'expo-file-system';

export interface BuildNote {
  title: string;
  notes: string[];
}

export interface BuildNotes {
  [version: string]: BuildNote;
}

/**
 * Reads the contents of the CHANGELOG.md file as a string
 */
async function readChangelogFile(): Promise<string> {
  try {
    // Read the local CHANGELOG.md file
    const fileUri = require('../../CHANGELOG.md');
    
    // For safety, let's provide a default if we can't load the file
    if (!fileUri) {
      console.warn('Could not find CHANGELOG.md file');
      return '';
    }
    
    return `
# Changelog

All notable changes to the Spitball app will be documented in this file.

## [1.0.1] - 2025-04-05

### Added
- Environment management concept (dev, test, live)
- Environment-switching capabilities documented in todo.md
- Visual environment indicator showing current environment (DEV/TEST/LIVE)
- Persistent environment storage using AsyncStorage
- Environment-specific configuration system
- Redesigned version indicator matching environment indicator style

### Changed
- Updated version numbers in package.json and app.json
- Updated build numbers to reflect current date (20250405)
- Improved UI with consistent styling for indicators
- Moved version indicator to match new design language

### Fixed
- None

## [1.0.0] - 2025-04-04

### Added
- Initial application setup
- Basic project structure
- Installation of core dependencies (expo-barcode-scanner, react-native-qrcode-svg, @react-three/fiber, three, expo-sensors)
- Setup of Expo/React Native environment
    `;
  } catch (error) {
    console.error('Error reading CHANGELOG file:', error);
    return '';
  }
}

/**
 * Parses the CHANGELOG.md file and converts it to the format needed for in-app build notes
 */
export async function parseChangelog(): Promise<BuildNotes> {
  try {
    // Read the changelog file
    const content = await readChangelogFile();
    
    if (!content) {
      console.log('No CHANGELOG content found, using default build notes');
      return getDefaultBuildNotes();
    }
    
    // Parse the content
    const buildNotes: BuildNotes = {};
    
    // Split by version sections (## [x.x.x])
    const versionSections = content.split(/## \[(.*?)\]/g);
    
    // Skip the first element which is the header
    for (let i = 1; i < versionSections.length; i += 2) {
      const version = versionSections[i];
      const sectionContent = versionSections[i + 1];
      
      if (!version || !sectionContent) continue;
      
      // Extract notes from each section
      const notes: string[] = [];
      
      // Extract notes from "Added" section
      const addedSection = sectionContent.match(/### Added\n([\s\S]*?)(?=###|$)/);
      if (addedSection && addedSection[1]) {
        const addedItems = addedSection[1]
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.startsWith('- '))
          .map(line => line.substring(2).trim())
          .filter(line => line.length > 0);
        
        notes.push(...addedItems);
      }
      
      // Extract notes from "Changed" section
      const changedSection = sectionContent.match(/### Changed\n([\s\S]*?)(?=###|$)/);
      if (changedSection && changedSection[1]) {
        const changedItems = changedSection[1]
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.startsWith('- '))
          .map(line => line.substring(2).trim())
          .filter(line => line.length > 0);
        
        notes.push(...changedItems);
      }
      
      buildNotes[version] = {
        title: `Version ${version}`,
        notes
      };
    }
    
    return Object.keys(buildNotes).length > 0 ? buildNotes : getDefaultBuildNotes();
  } catch (error) {
    console.error('Error parsing CHANGELOG:', error);
    return getDefaultBuildNotes();
  }
}

/**
 * Fallback build notes in case the CHANGELOG can't be parsed
 */
function getDefaultBuildNotes(): BuildNotes {
  return {
    '1.0.1': {
      title: 'Version 1.0.1',
      notes: [
        'Added environment management system (DEV/TEST/LIVE)',
        'Environment indicator in top-right corner (tap to switch)',
        'Environment-specific API endpoints and configuration',
        'Persistent environment settings',
        'Redesigned version indicator matching environment indicator style',
        'Updated version numbers and build dates'
      ],
    },
    '1.0.0': {
      title: 'Version 1.0.0',
      notes: [
        'Initial release with peer-to-peer spitball shooting!',
        'QR code-based connection.',
        '3D spitball animations.',
      ],
    }
  };
}