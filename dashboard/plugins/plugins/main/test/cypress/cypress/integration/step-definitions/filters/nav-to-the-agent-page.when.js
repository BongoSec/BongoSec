import { When } from 'cypress-cucumber-preprocessor/steps';
import { clickElement, elementIsVisible, getSelector} from '../../utils/driver';

import { BONGOSEC_MENU_PAGE as pageName} from '../../utils/pages-constants';
const bongosecMenuButton = getSelector('bongosecMenuButton', pageName);
const agentsButton = getSelector('agentsButton', pageName);

When('The user navigates to the agent page', () => {
  clickElement(bongosecMenuButton);
  elementIsVisible(agentsButton);
  clickElement(agentsButton);
});
