import { CommandGenerator } from './command-generator';
import {
  IOSDefinition,
  IOptionalParameters,
  tOptionalParams,
} from '../types';
import { DuplicatedOSException, DuplicatedOSOptionException, NoOSSelectedException, BongosecVersionUndefinedException } from '../exceptions';

const mockedCommandValue = 'mocked command';
const mockedCommandsResponse = jest.fn().mockReturnValue(mockedCommandValue);

// Defined OS combinations
export interface ILinuxOSTypes {
  name: 'linux';
  architecture: 'x64' | 'x86';
}
export interface IWindowsOSTypes {
  name: 'windows';
  architecture: 'x86';
}

export interface IMacOSTypes {
  name: 'mac';
  architecture: '32/64';
}

export type tOperatingSystem = ILinuxOSTypes | IMacOSTypes | IWindowsOSTypes;

// Defined Optional Parameters


export type tOptionalParameters = 'server_address' | 'agent_name' | 'agent_group' | 'protocol' | 'bongosec_password';

const osDefinitions: IOSDefinition<tOperatingSystem, tOptionalParameters>[] = [
  {
    name: 'linux',
    options: [
      {
        architecture: 'x64',
        installCommand: mockedCommandsResponse,
        startCommand: mockedCommandsResponse,
        urlPackage: mockedCommandsResponse,
      },
      {
        architecture: 'x86',
        installCommand: mockedCommandsResponse,
        startCommand: mockedCommandsResponse,
        urlPackage: mockedCommandsResponse,
      },
    ],
  },
];

const optionalParams: tOptionalParams<tOptionalParameters> = {
  server_address: {
    property: 'BONGOSEC_MANAGER',
    getParamCommand: props => `${props.property}=${props.value}`,
  },
  agent_name: {
    property: 'BONGOSEC_AGENT_NAME',
    getParamCommand: props => `${props.property}=${props.value}`,
  },
  protocol: {
    property: 'BONGOSEC_MANAGER_PROTOCOL',
    getParamCommand: props => `${props.property}=${props.value}`,
  },
  agent_group: {
    property: 'BONGOSEC_AGENT_GROUP',
    getParamCommand: props => `${props.property}=${props.value}`,
  },
  bongosec_password: {
    property: 'BONGOSEC_PASSWORD',
    getParamCommand: props => `${props.property}=${props.value}`,
  },
};

const optionalValues: IOptionalParameters<tOptionalParameters> = {
  server_address: '',
  agent_name: '',
  protocol: '',
  agent_group: '',
  bongosec_password: '',
};

describe('Command Generator', () => {
  it('should create an valid instance', () => {
    const commandGenerator = new CommandGenerator(
      osDefinitions,
      optionalParams,
      '4.4',
    );
    expect(commandGenerator).toBeDefined();
  });

  it('should return the install command for the os selected', () => {
    const commandGenerator = new CommandGenerator(
      osDefinitions,
      optionalParams,
      '4.4',
    );
    commandGenerator.selectOS({
      name: 'linux',
      architecture: 'x64',
    });
    commandGenerator.addOptionalParams(optionalValues);
    const command = commandGenerator.getInstallCommand();
    expect(command).toBe(mockedCommandValue);
  });

  it('should return the start command for the os selected', () => {
    const commandGenerator = new CommandGenerator(
      osDefinitions,
      optionalParams,
      '4.4',
    );
    commandGenerator.selectOS({
      name: 'linux',
      architecture: 'x64',
    });
    commandGenerator.addOptionalParams(optionalValues);
    const command = commandGenerator.getStartCommand();
    expect(command).toBe(mockedCommandValue);
  });

  it('should return all the commands for the os selected', () => {
    const commandGenerator = new CommandGenerator(
      osDefinitions,
      optionalParams,
      '4.4',
    );
    commandGenerator.selectOS({
      name: 'linux',
      architecture: 'x64',
    });
    commandGenerator.addOptionalParams(optionalValues);
    const commands = commandGenerator.getAllCommands();
    expect(commands).toEqual({
      os: 'linux',
      architecture: 'x64',
      bongosecVersion: '4.4',
      install_command: mockedCommandValue,
      start_command: mockedCommandValue,
      url_package: mockedCommandValue,
      optionals: {},
    });
  });

  it('should return commands with the filled optional params', () => {
    const commandGenerator = new CommandGenerator(
      osDefinitions,
      optionalParams,
      '4.4',
    );

    const selectedOs: tOperatingSystem = {
      name: 'linux',
      architecture: 'x64',
    };
    commandGenerator.selectOS(selectedOs);

    const optionalValues = {
      server_address: '10.10.10.121',
      agent_name: 'agent1',
      protocol: 'tcp',
      agent_group: '',
      bongosec_password: '123456',
    };
    commandGenerator.addOptionalParams(optionalValues);

    const commands = commandGenerator.getAllCommands();
    expect(commands).toEqual({
      os: selectedOs.name,
      architecture: selectedOs.architecture,
      bongosecVersion: '4.4',
      install_command: mockedCommandValue,
      start_command: mockedCommandValue,
      url_package: mockedCommandValue,
      optionals: {
        server_address: optionalParams.server_address.getParamCommand({
          property: optionalParams.server_address.property,
          value: optionalValues.server_address,
          name: 'server_address',
        }),
        agent_name: optionalParams.agent_name.getParamCommand({
          property: optionalParams.agent_name.property,
          value: optionalValues.agent_name,
          name: 'agent_name',
        }),
        protocol: optionalParams.protocol.getParamCommand({
          property: optionalParams.protocol.property,
          value: optionalValues.protocol,
          name: 'protocol',
        }),
        bongosec_password: optionalParams.bongosec_password.getParamCommand({
          property: optionalParams.bongosec_password.property,
          value: optionalValues.bongosec_password,
          name: 'bongosec_password',
        }),
      },
    });
  });

  it('should return an ERROR when the os definitions received has a os with options duplicated', () => {
    const osDefinitions: IOSDefinition<tOperatingSystem, tOptionalParameters>[] = [
      {
        name: 'linux',
        options: [
          {
            architecture: 'x64',
            installCommand: mockedCommandsResponse,
            startCommand: mockedCommandsResponse,
            urlPackage: mockedCommandsResponse,
          },
          {
            architecture: 'x64',
            installCommand: mockedCommandsResponse,
            startCommand: mockedCommandsResponse,
            urlPackage: mockedCommandsResponse,
          },
        ],
      },
    ];

    try {
      new CommandGenerator(osDefinitions, optionalParams, '4.4');
    } catch (error) {
      if (error instanceof Error)
        expect(error).toBeInstanceOf(DuplicatedOSOptionException);
    }
  });

  it('should return an ERROR when the os definitions received has a os with options duplicated', () => {
    const osDefinitions: IOSDefinition<tOperatingSystem, tOptionalParameters>[] = [
      {
        name: 'linux',
        options: [
          {
            architecture: 'x64',
            installCommand: mockedCommandsResponse,
            startCommand: mockedCommandsResponse,
            urlPackage: mockedCommandsResponse,
          },
        ],
      },
      {
        name: 'linux',
        options: [
          {
            architecture: 'x64',
            installCommand: mockedCommandsResponse,
            startCommand: mockedCommandsResponse,
            urlPackage: mockedCommandsResponse,
          },
        ],
      },
    ];

    try {
      new CommandGenerator(osDefinitions, optionalParams, '4.4');
    } catch (error) {
      if (error instanceof Error)
        expect(error).toBeInstanceOf(DuplicatedOSException);
    }
  });

  it('should return an ERROR when we want to get commands and the os is not selected', () => {
    const commandGenerator = new CommandGenerator(
      osDefinitions,
      optionalParams,
      '4.4',
    );
    try {
      commandGenerator.getAllCommands();
    } catch (error) {
      if (error instanceof Error)
        expect(error).toBeInstanceOf(NoOSSelectedException);
    }
  });

  it('should return an ERROR when we want to get the install command and the os is not selected', () => {
    const commandGenerator = new CommandGenerator(
      osDefinitions,
      optionalParams,
      '4.4',
    );
    try {
      commandGenerator.getInstallCommand();
    } catch (error) {
      if (error instanceof Error)
        expect(error).toBeInstanceOf(NoOSSelectedException);
    }
  });

  it('should return an ERROR when we want to get the start command and the os is not selected', () => {
    const commandGenerator = new CommandGenerator(
      osDefinitions,
      optionalParams,
      '4.4',
    );
    try {
      commandGenerator.getStartCommand();
    } catch (error) {
      if (error instanceof Error)
        expect(error).toBeInstanceOf(NoOSSelectedException);
    }
  });

  it('should return an ERROR when receive an empty version', () => {
    try {
      new CommandGenerator(osDefinitions, optionalParams, '');
    } catch (error) {
      if (error instanceof Error)
        expect(error).toBeInstanceOf(BongosecVersionUndefinedException);
    }
  });

  it('should receives the solved optional params when the install command is called', () => {
    const commandGenerator = new CommandGenerator(
      osDefinitions,
      optionalParams,
      '4.4',
    );

    const selectedOs: tOperatingSystem = {
      name: 'linux',
      architecture: 'x64',
    };
    commandGenerator.selectOS(selectedOs);

    const optionalValues = {
      server_address: 'bongosec-ip',
    };

    commandGenerator.addOptionalParams(optionalValues as IOptionalParameters<tOptionalParameters>);
    commandGenerator.getInstallCommand();
    expect(mockedCommandsResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        optionals: {
          server_address: optionalParams.server_address.getParamCommand({
            property: optionalParams.server_address.property,
            value: optionalValues.server_address,
            name: 'server_address',
          }),
        },
      }),
    );
  });

  it('should receives the solved optional params when the start command is called', () => {
    const commandGenerator = new CommandGenerator(
      osDefinitions,
      optionalParams,
      '4.4',
    );

    const selectedOs: tOperatingSystem = {
      name: 'linux',
      architecture: 'x64',
    };
    commandGenerator.selectOS(selectedOs);

    const optionalValues = {
      server_address: 'bongosec-ip',
    };

    commandGenerator.addOptionalParams(optionalValues as IOptionalParameters<tOptionalParameters>);
    commandGenerator.getStartCommand();
    expect(mockedCommandsResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        optionals: {
          server_address: optionalParams.server_address.getParamCommand({
            property: optionalParams.server_address.property,
            value: optionalValues.server_address,
            name: 'server_address',
          }),
        },
      }),
    );
  });
});