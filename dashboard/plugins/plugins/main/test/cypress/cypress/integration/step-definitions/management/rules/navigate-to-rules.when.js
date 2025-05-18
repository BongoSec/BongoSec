import { When } from 'cypress-cucumber-preprocessor/steps';
import { clickElement, elementIsVisible, validateURLIncludes, getSelector } from '../../../utils/driver';
import { BONGOSEC_MENU_PAGE as pageName} from '../../../utils/pages-constants';
const managementButton = getSelector('managementButton', pageName);
const bongosecMenuButton = getSelector('bongosecMenuButton', pageName);
const rulesLink = getSelector('rulesLink', pageName);

When('The user navigates to rules', () => {
  elementIsVisible(bongosecMenuButton);
  clickElement(bongosecMenuButton);
  elementIsVisible(managementButton);
  clickElement(managementButton);
  elementIsVisible(rulesLink);
  clickElement(rulesLink);
  validateURLIncludes('/manager/?tab=rules');
});
