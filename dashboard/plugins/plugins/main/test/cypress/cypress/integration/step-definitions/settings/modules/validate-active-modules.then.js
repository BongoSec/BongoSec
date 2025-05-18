import { clickElement, elementIsVisible, getSelector } from '../../../utils/driver';
import { BONGOSEC_MENU_PAGE as pageName, MODULES_CARDS } from '../../../utils/pages-constants';
const modulesButton = getSelector('modulesButton', pageName);
const modulesDirectoryLink = getSelector('modulesDirectoryLink', pageName);
const bongosecMenuButton = getSelector('bongosecMenuButton', pageName);
const bongosecMenuLeft = getSelector('bongosecMenuLeft', pageName);
const bongosecMenuRight = getSelector('bongosecMenuRight', pageName);
const bongosecMenuSettingRight = getSelector('bongosecMenuSettingRight', pageName);

Then('The activated modules with {} are displayed on home page', (moduleName) => {
  elementIsVisible(bongosecMenuButton);
  clickElement(bongosecMenuButton);
  elementIsVisible(bongosecMenuLeft);
  elementIsVisible(bongosecMenuRight);
  elementIsVisible(modulesButton);
  clickElement(modulesButton);
  elementIsVisible(bongosecMenuSettingRight);
  elementIsVisible(modulesDirectoryLink);
  clickElement(modulesDirectoryLink);
  elementIsVisible(getSelector(moduleName, MODULES_CARDS));
});
