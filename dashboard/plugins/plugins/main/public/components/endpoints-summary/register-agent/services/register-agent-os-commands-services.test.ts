import {
  getAllOptionals,
  getAllOptionalsMacos,
  getDEBAMD64InstallCommand,
  getDEBARM64InstallCommand,
  getLinuxStartCommand,
  getMacOsInstallCommand,
  getMacosStartCommand,
  getRPMAMD64InstallCommand,
  getRPMARM64InstallCommand,
  getWindowsInstallCommand,
  getWindowsStartCommand,
  transformOptionalsParamatersMacOSCommand,
} from './register-agent-os-commands-services';

let test: any;

beforeEach(() => {
  test = {
    optionals: {
      agentGroups: "BONGOSEC_AGENT_GROUP='default'",
      agentName: "BONGOSEC_AGENT_NAME='test'",
      serverAddress: "BONGOSEC_MANAGER='1.1.1.1'",
      bongosecPassword: "BONGOSEC_REGISTRATION_PASSWORD='<CUSTOM_PASSWORD>'",
    },
    urlPackage: 'https://test.com/agent.deb',
    bongosecVersion: '4.8.0',
  };
});

describe('getAllOptionals', () => {
  it('should return empty string if optionals is falsy', () => {
    const result = getAllOptionals(null);
    expect(result).toBe('');
  });

  it('should return the correct paramsText', () => {
    const optionals = {
      serverAddress: 'localhost',
      bongosecPassword: 'password',
      agentGroups: 'group1',
      agentName: 'agent1',
      protocol: 'http',
    };
    const result = getAllOptionals(optionals, 'linux');
    expect(result).toBe('localhost password group1 agent1 http ');
  });
});

describe('getDEBAMD64InstallCommand', () => {
  it('should return the correct install command', () => {
    const props = {
      optionals: {
        serverAddress: 'localhost',
        bongosecPassword: 'password',
        agentGroups: 'group1',
        agentName: 'agent1',
        protocol: 'http',
      },
      urlPackage: 'https://example.com/package.deb',
      bongosecVersion: '4.0.0',
    };
    const result = getDEBAMD64InstallCommand(props);
    expect(result).toBe(
      'wget https://example.com/package.deb && sudo localhost password group1 agent1 http dpkg -i ./bongosec-agent_4.0.0-1_amd64.deb',
    );
  });
});

describe('getDEBAMD64InstallCommand', () => {
  it('should return the correct command', () => {
    let expected = `wget ${test.urlPackage} && sudo ${test.optionals.serverAddress} ${test.optionals.bongosecPassword} ${test.optionals.agentGroups} ${test.optionals.agentName} dpkg -i ./bongosec-agent_${test.bongosecVersion}-1_amd64.deb`;
    const withAllOptionals = getDEBAMD64InstallCommand(test);
    expect(withAllOptionals).toEqual(expected);

    delete test.optionals.bongosecPassword;
    delete test.optionals.agentName;

    expected = `wget ${test.urlPackage} && sudo ${test.optionals.serverAddress} ${test.optionals.agentGroups} dpkg -i ./bongosec-agent_${test.bongosecVersion}-1_amd64.deb`;
    const withServerAddresAndAgentGroupsOptions =
      getDEBAMD64InstallCommand(test);
    expect(withServerAddresAndAgentGroupsOptions).toEqual(expected);
  });
});

describe('getDEBARM64InstallCommand', () => {
  it('should return the correct command', () => {
    let expected = `wget ${test.urlPackage} && sudo ${test.optionals.serverAddress} ${test.optionals.bongosecPassword} ${test.optionals.agentGroups} ${test.optionals.agentName} dpkg -i ./bongosec-agent_${test.bongosecVersion}-1_arm64.deb`;
    const withAllOptionals = getDEBARM64InstallCommand(test);
    expect(withAllOptionals).toEqual(expected);

    delete test.optionals.bongosecPassword;
    delete test.optionals.agentName;

    expected = `wget ${test.urlPackage} && sudo ${test.optionals.serverAddress} ${test.optionals.agentGroups} dpkg -i ./bongosec-agent_${test.bongosecVersion}-1_arm64.deb`;
    const withServerAddresAndAgentGroupsOptions =
      getDEBARM64InstallCommand(test);
    expect(withServerAddresAndAgentGroupsOptions).toEqual(expected);
  });
});

describe('getRPMAMD64InstallCommand', () => {
  it('should return the correct command', () => {
    let expected = `curl -o bongosec-agent-4.8.0-1.x86_64.rpm ${test.urlPackage} && sudo ${test.optionals.serverAddress} ${test.optionals.bongosecPassword} ${test.optionals.agentGroups} ${test.optionals.agentName} rpm -ihv bongosec-agent-${test.bongosecVersion}-1.x86_64.rpm`;
    const withAllOptionals = getRPMAMD64InstallCommand(test);
    expect(withAllOptionals).toEqual(expected);

    delete test.optionals.bongosecPassword;
    delete test.optionals.agentName;

    expected = `curl -o bongosec-agent-4.8.0-1.x86_64.rpm ${test.urlPackage} && sudo ${test.optionals.serverAddress} ${test.optionals.agentGroups} rpm -ihv bongosec-agent-${test.bongosecVersion}-1.x86_64.rpm`;
    const withServerAddresAndAgentGroupsOptions =
      getRPMAMD64InstallCommand(test);
    expect(withServerAddresAndAgentGroupsOptions).toEqual(expected);
  });
});

describe('getRPMARM64InstallCommand', () => {
  it('should return the correct command', () => {
    let expected = `curl -o bongosec-agent-4.8.0-1.aarch64.rpm ${test.urlPackage} && sudo ${test.optionals.serverAddress} ${test.optionals.bongosecPassword} ${test.optionals.agentGroups} ${test.optionals.agentName} rpm -ihv bongosec-agent-${test.bongosecVersion}-1.aarch64.rpm`;
    const withAllOptionals = getRPMARM64InstallCommand(test);
    expect(withAllOptionals).toEqual(expected);

    delete test.optionals.bongosecPassword;
    delete test.optionals.agentName;

    expected = `curl -o bongosec-agent-4.8.0-1.aarch64.rpm ${test.urlPackage} && sudo ${test.optionals.serverAddress} ${test.optionals.agentGroups} rpm -ihv bongosec-agent-${test.bongosecVersion}-1.aarch64.rpm`;
    const withServerAddresAndAgentGroupsOptions =
      getRPMARM64InstallCommand(test);
    expect(withServerAddresAndAgentGroupsOptions).toEqual(expected);
  });
});

describe('getLinuxStartCommand', () => {
  it('returns the correct start command for Linux', () => {
    const startCommand = getLinuxStartCommand({});
    const expectedCommand =
      'sudo systemctl daemon-reload\nsudo systemctl enable bongosec-agent\nsudo systemctl start bongosec-agent';

    expect(startCommand).toEqual(expectedCommand);
  });
});

// Windows

describe('getWindowsInstallCommand', () => {
  it('should return the correct install command', () => {
    let expected = `Invoke-WebRequest -Uri ${test.urlPackage} -OutFile \$env:tmp\\bongosec-agent; msiexec.exe /i \$env:tmp\\bongosec-agent /q ${test.optionals.serverAddress} ${test.optionals.bongosecPassword} ${test.optionals.agentGroups} ${test.optionals.agentName} `;

    const withAllOptionals = getWindowsInstallCommand(test);
    expect(withAllOptionals).toEqual(expected);

    delete test.optionals.bongosecPassword;
    delete test.optionals.agentName;

    expected = `Invoke-WebRequest -Uri ${test.urlPackage} -OutFile \$env:tmp\\bongosec-agent; msiexec.exe /i \$env:tmp\\bongosec-agent /q ${test.optionals.serverAddress} ${test.optionals.agentGroups} `;
    const withServerAddresAndAgentGroupsOptions =
      getWindowsInstallCommand(test);

    expect(withServerAddresAndAgentGroupsOptions).toEqual(expected);
  });
});

describe('getWindowsStartCommand', () => {
  it('should return the correct start command', () => {
    const expectedCommand = 'NET START BongosecSvc';

    const result = getWindowsStartCommand({});

    expect(result).toEqual(expectedCommand);
  });
});

// MacOS

describe('getAllOptionalsMacos', () => {
  it('should return empty string if optionals is falsy', () => {
    const result = getAllOptionalsMacos(null);
    expect(result).toBe('');
  });

  it('should return the correct paramsValueList', () => {
    const optionals = {
      serverAddress: 'localhost',
      agentGroups: 'group1',
      agentName: 'agent1',
      protocol: 'http',
      bongosecPassword: 'password',
    };
    const result = getAllOptionalsMacos(optionals);
    expect(result).toBe('localhost && group1 && agent1 && http && password');
  });
});

describe('transformOptionalsParamatersMacOSCommand', () => {
  it('should transform the command correctly', () => {
    const command =
      "' serverAddress && agentGroups && agentName && protocol && bongosecPassword";
    const result = transformOptionalsParamatersMacOSCommand(command);
    expect(result).toBe(
      "' && serverAddress && agentGroups && agentName && protocol && bongosecPassword",
    );
  });
});

describe('getMacOsInstallCommand', () => {
  it('should return the correct macOS installation script', () => {
    let expected = `curl -so bongosec-agent.pkg ${test.urlPackage} && echo "${test.optionals.serverAddress} && ${test.optionals.agentGroups} && ${test.optionals.agentName} && ${test.optionals.bongosecPassword}\" > /tmp/bongosec_envs && sudo installer -pkg ./bongosec-agent.pkg -target /`;

    const withAllOptionals = getMacOsInstallCommand(test);
    expect(withAllOptionals).toEqual(expected);

    delete test.optionals.bongosecPassword;
    delete test.optionals.agentName;
    expected = `curl -so bongosec-agent.pkg ${test.urlPackage} && echo "${test.optionals.serverAddress} && ${test.optionals.agentGroups}" > /tmp/bongosec_envs && sudo installer -pkg ./bongosec-agent.pkg -target /`;

    const withServerAddresAndAgentGroupsOptions = getMacOsInstallCommand(test);
    expect(withServerAddresAndAgentGroupsOptions).toEqual(expected);
  });
});

describe('getMacosStartCommand', () => {
  it('returns the correct start command for macOS', () => {
    const startCommand = getMacosStartCommand({});
    expect(startCommand).toEqual('sudo /Library/Ossec/bin/bongosec-control start');
  });
});
