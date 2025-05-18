import { When } from 'cypress-cucumber-preprocessor/steps';
import { clickElement, elementIsVisible, getSelector} from '../../utils/driver';
import { BONGOSEC_MENU_PAGE as pageName} from '../../utils/pages-constants';
const bongosecMenuButton = getSelector('bongosecMenuButton', pageName);
const modulesDirectoryLink = getSelector('modulesDirectoryLink', pageName);
const modulesButton = getSelector('modulesButton', pageName);

When('The user navigates overview page', () => {
  elementIsVisible(bongosecMenuButton);
  clickElement(bongosecMenuButton);
  elementIsVisible(modulesButton);
  clickElement(modulesButton);
  elementIsVisible(modulesDirectoryLink);
  clickElement(modulesDirectoryLink);
});
