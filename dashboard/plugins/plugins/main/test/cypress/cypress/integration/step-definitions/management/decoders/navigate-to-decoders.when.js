import { When } from 'cypress-cucumber-preprocessor/steps';
import { clickElement, elementIsVisible, getSelector } from '../../../utils/driver';
import { BONGOSEC_MENU_PAGE as pageName} from '../../../utils/pages-constants';
const decodersLink = getSelector('decodersLink', pageName);
const bongosecMenuButton = getSelector('bongosecMenuButton', pageName);
const managementButton = getSelector('managementButton', pageName);

When('The user navigates to decoders', () => {
  elementIsVisible(bongosecMenuButton);
  clickElement(bongosecMenuButton);
  elementIsVisible(managementButton);
  clickElement(managementButton);
  elementIsVisible(decodersLink);
  clickElement(decodersLink);
});
