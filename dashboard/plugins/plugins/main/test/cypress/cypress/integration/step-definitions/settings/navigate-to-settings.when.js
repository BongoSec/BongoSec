import { When } from 'cypress-cucumber-preprocessor/steps';
import { clickElement, elementIsVisible, getSelector } from '../../utils/driver';
import { BONGOSEC_MENU_PAGE as pageName, SETTINGS_MENU_LINKS } from '../../utils/pages-constants';
const settingsButton = getSelector('settingsButton', pageName);
const bongosecMenuButton = getSelector('bongosecMenuButton', pageName);
const bongosecMenuLeft = getSelector('bongosecMenuLeft', pageName);
const bongosecMenuRight = getSelector('bongosecMenuRight', pageName);
const bongosecMenuSettingRight = getSelector('bongosecMenuSettingRight', pageName);

When('The user navigates to {} settings', (menuOption) => {
  elementIsVisible(bongosecMenuButton);
  clickElement(bongosecMenuButton);
  elementIsVisible(bongosecMenuLeft);
  elementIsVisible(bongosecMenuRight);
  elementIsVisible(settingsButton);
  clickElement(settingsButton);
  elementIsVisible(bongosecMenuSettingRight);
  if (Cypress.env('type') == 'wzd') {
    cy.wait(1000);
    elementIsVisible(getSelector(menuOption, SETTINGS_MENU_LINKS)).click()
  } else {
    elementIsVisible(getSelector(menuOption, SETTINGS_MENU_LINKS));
    clickElement(getSelector(menuOption, SETTINGS_MENU_LINKS));
  };
});
