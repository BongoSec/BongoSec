import { When } from 'cypress-cucumber-preprocessor/steps';
import { xpathElementIsVisible, forceClickElementByXpath, getSelector, forceClickElement, elementIsVisible} from '../../utils/driver';

import { BASIC_MODULES} from '../../utils/pages-constants';
import { BONGOSEC_MENU_PAGE as pageName} from '../../utils/pages-constants';
const bongosecMenuButton = getSelector('bongosecMenuButton', pageName);
When('The user goes to {}', (moduleName) => {
  
  cy.wait(500);
  elementIsVisible(bongosecMenuButton);
  cy.wait(500);
  forceClickElement(bongosecMenuButton);
  xpathElementIsVisible(getSelector(moduleName, BASIC_MODULES));
  forceClickElementByXpath(getSelector(moduleName, BASIC_MODULES));
});
