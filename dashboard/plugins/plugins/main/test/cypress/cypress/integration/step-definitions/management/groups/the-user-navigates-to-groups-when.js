import { When } from 'cypress-cucumber-preprocessor/steps';
import { clickElement, elementIsVisible, getSelector } from '../../../utils/driver';
import { BONGOSEC_MENU_PAGE as pageName} from '../../../utils/pages-constants';
const groupsLink = getSelector('groupsLink', pageName);
const bongosecMenuButton = getSelector('bongosecMenuButton', pageName);
const managementButton = getSelector('managementButton', pageName);

When('The user navigates to groups page', () => {
  elementIsVisible(bongosecMenuButton);
  clickElement(bongosecMenuButton);
  elementIsVisible(managementButton);
  clickElement(managementButton);
  elementIsVisible(groupsLink);
  clickElement(groupsLink);
});
