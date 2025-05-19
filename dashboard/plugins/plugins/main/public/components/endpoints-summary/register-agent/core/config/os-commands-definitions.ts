import {
  getLinuxStartCommand,
  getMacOsInstallCommand,
  getMacosStartCommand,
  getWindowsInstallCommand,
  getWindowsStartCommand,
  getDEBAMD64InstallCommand,
  getRPMAMD64InstallCommand,
  getRPMARM64InstallCommand,
  getDEBARM64InstallCommand,
} from '../../services/register-agent-os-commands-services';
import {
  scapeSpecialCharsForLinux,
  scapeSpecialCharsForMacOS,
  scapeSpecialCharsForWindows,
} from '../../services/bongosec-password-service';
import { IOSDefinition, tOptionalParams } from '../register-commands/types';

// Defined OS combinations

/** Linux options **/
export interface ILinuxAMDRPM {
  name: 'LINUX';
  architecture: 'RPM amd64';
}

export interface ILinuxAARCHRPM {
  name: 'LINUX';
  architecture: 'RPM aarch64';
}

export interface ILinuxAMDDEB {
  name: 'LINUX';
  architecture: 'DEB amd64';
}

export interface ILinuxAARCHDEB {
  name: 'LINUX';
  architecture: 'DEB aarch64';
}

type ILinuxOSTypes =
  | ILinuxAMDRPM
  | ILinuxAARCHRPM
  | ILinuxAMDDEB
  | ILinuxAARCHDEB;

/** Windows options **/
export interface IWindowsOSTypes {
  name: 'WINDOWS';
  architecture: 'MSI 32/64 bits';
}

/** MacOS options **/
export interface IMacOSIntel {
  name: 'macOS';
  architecture: 'Intel';
}

export interface IMacOSApple {
  name: 'macOS';
  architecture: 'Apple silicon';
}

type IMacOSTypes = IMacOSApple | IMacOSIntel;

export type tOperatingSystem = ILinuxOSTypes | IMacOSTypes | IWindowsOSTypes;

export type tOptionalParameters =
  | 'serverAddress'
  | 'agentName'
  | 'agentGroups'
  | 'bongosecPassword'
  | 'protocol';

///////////////////////////////////////////////////////////////////
/// Operating system commands definitions
///////////////////////////////////////////////////////////////////

const linuxDefinition: IOSDefinition<ILinuxOSTypes, tOptionalParameters> = {
  name: 'LINUX',
  options: [
    {
      architecture: 'DEB amd64',
      urlPackage: props =>
        `https://packages.wazuh.com/4.x/apt/pool/main/w/bongosec-agent/bongosec-agent_${props.bongosecVersion}-1_amd64.deb`,
      installCommand: props => getDEBAMD64InstallCommand(props),
      startCommand: props => getLinuxStartCommand(props),
    },
    {
      architecture: 'RPM amd64',
      urlPackage: props =>
        `https://packages.wazuh.com/4.x/yum/bongosec-agent-${props.bongosecVersion}-1.x86_64.rpm`,
      installCommand: props => getRPMAMD64InstallCommand(props),
      startCommand: props => getLinuxStartCommand(props),
    },
    {
      architecture: 'DEB aarch64',
      urlPackage: props =>
        `https://packages.wazuh.com/4.x/apt/pool/main/w/bongosec-agent/bongosec-agent_${props.bongosecVersion}-1_arm64.deb`,
      installCommand: props => getDEBARM64InstallCommand(props),
      startCommand: props => getLinuxStartCommand(props),
    },
    {
      architecture: 'RPM aarch64',
      urlPackage: props =>
        `https://packages.wazuh.com/4.x/yum/bongosec-agent-${props.bongosecVersion}-1.aarch64.rpm`,
      installCommand: props => getRPMARM64InstallCommand(props),
      startCommand: props => getLinuxStartCommand(props),
    },
  ],
};

const windowsDefinition: IOSDefinition<IWindowsOSTypes, tOptionalParameters> = {
  name: 'WINDOWS',
  options: [
    {
      architecture: 'MSI 32/64 bits',
      urlPackage: props =>
        `https://packages.wazuh.com/4.x/windows/bongosec-agent-${props.bongosecVersion}-1.msi`,
      installCommand: props => getWindowsInstallCommand(props),
      startCommand: props => getWindowsStartCommand(props),
    },
  ],
};

const macDefinition: IOSDefinition<IMacOSTypes, tOptionalParameters> = {
  name: 'macOS',
  options: [
    {
      architecture: 'Intel',
      urlPackage: props =>
        `https://packages.wazuh.com/4.x/macos/bongosec-agent-${props.bongosecVersion}-1.intel64.pkg`,
      installCommand: props => getMacOsInstallCommand(props),
      startCommand: props => getMacosStartCommand(props),
    },
    {
      architecture: 'Apple silicon',
      urlPackage: props =>
        `https://packages.wazuh.com/4.x/macos/bongosec-agent-${props.bongosecVersion}-1.arm64.pkg`,
      installCommand: props => getMacOsInstallCommand(props),
      startCommand: props => getMacosStartCommand(props),
    },
  ],
};

export const osCommandsDefinitions = [
  linuxDefinition,
  windowsDefinition,
  macDefinition,
];

///////////////////////////////////////////////////////////////////
/// Optional parameters definitions
///////////////////////////////////////////////////////////////////

export const optionalParamsDefinitions: tOptionalParams<tOptionalParameters> = {
  serverAddress: {
    property: 'BONGOSEC_MANAGER',
    getParamCommand: (props, selectedOS) => {
      const { property, value } = props;
      return value !== '' ? `${property}='${value}'` : '';
    },
  },
  agentName: {
    property: 'BONGOSEC_AGENT_NAME',
    getParamCommand: (props, selectedOS) => {
      const { property, value } = props;
      return value !== '' ? `${property}='${value}'` : '';
    },
  },
  agentGroups: {
    property: 'BONGOSEC_AGENT_GROUP',
    getParamCommand: (props, selectedOS) => {
      const { property, value } = props;
      let parsedValue = value;
      if (Array.isArray(value)) {
        parsedValue = value.length > 0 ? value.join(',') : '';
      }
      return parsedValue ? `${property}='${parsedValue}'` : '';
    },
  },
  protocol: {
    property: 'BONGOSEC_PROTOCOL',
    getParamCommand: (props, selectedOS) => {
      const { property, value } = props;
      return value !== '' ? `${property}='${value}'` : '';
    },
  },
  bongosecPassword: {
    property: 'BONGOSEC_REGISTRATION_PASSWORD',
    getParamCommand: (props, selectedOS) => {
      const { property, value } = props;
      if (!value) {
        return '';
      }
      if (selectedOS) {
        let osName = selectedOS.name.toLocaleLowerCase();
        switch (osName) {
          case 'linux':
            return `${property}=$'${scapeSpecialCharsForLinux(value)}'`;
          case 'macos':
            return `${property}='${scapeSpecialCharsForMacOS(value)}'`;
          case 'windows':
            return `${property}='${scapeSpecialCharsForWindows(value)}'`;
          default:
            return `${property}=$'${value}'`;
        }
      }

      return value !== '' ? `${property}=$'${value}'` : '';
    },
  },
};
