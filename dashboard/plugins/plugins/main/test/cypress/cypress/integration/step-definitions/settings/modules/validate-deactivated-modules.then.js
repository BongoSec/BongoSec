import { clickElement, elementIsNotVisible, elementIsVisible, getSelector } from '../../../utils/driver';
import { BONGOSEC_MENU_PAGE as pageName, MODULES_CARDS } from '../../../utils/pages-constants';
const modulesButton = getSelector('modulesButton', pageName);
const modulesDirectoryLink = getSelector('modulesDirectoryLink', pageName);
const bongosecMenuButton = getSelector('bongosecMenuButton', pageName);
const bongosecMenuLeft = getSelector('bongosecMenuLeft', pageName);
const bongosecMenuRight = getSelector('bongosecMenuRight', pageName);
const bongosecMenuSettingRight = getSelector('bongosecMenuSettingRight', pageName);

Then('The deactivated modules with {} are not displayed on home page', (moduleName) => {
  elementIsVisible(bongosecMenuButton);
  clickElement(bongosecMenuButton);
  elementIsVisible(bongosecMenuLeft);
  elementIsVisible(bongosecMenuRight);
  elementIsVisible(modulesButton);
  clickElement(modulesButton);
  cy.wait(1000)
  elementIsVisible(bongosecMenuSettingRight);
  elementIsVisible(modulesDirectoryLink);
  clickElement(modulesDirectoryLink);
  cy.get('react-component[name="OverviewWelcome"]', { timeout: 15000 });
  elementIsNotVisible(getSelector(moduleName, MODULES_CARDS));
});
