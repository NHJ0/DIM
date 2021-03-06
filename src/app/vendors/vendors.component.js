import { subscribeOnScope } from '../rx-utils';

import template from './vendors.html';
import './vendors.scss';

export const VendorsComponent = {
  controller: VendorsController,
  template: template,
  bindings: {
    account: '<'
  },
  controllerAs: 'vm'
};

function VendorsController($scope, $state, $q, dimStoreService, dimSettingsService, dimVendorService) {
  'ngInject';

  const vm = this;

  vm.activeTab = 'hasArmorWeaps';
  vm.activeTypeDefs = {
    armorweaps: ['armor', 'weapons'],
    vehicles: ['ships', 'vehicles'],
    shadersembs: ['shaders', 'emblems'],
    emotes: ['emotes']
  };

  vm.settings = dimSettingsService;

  this.$onInit = function() {
    subscribeOnScope($scope, dimVendorService.getVendorsStream(vm.account), ([stores, vendors]) => {
      vm.stores = stores;
      vm.vendors = vendors;
      vm.totalCoins = dimVendorService.countCurrencies(stores, vendors);
      dimVendorService.requestRatings();
    });
  };

  $scope.$on('dim-refresh', () => {
    dimVendorService.reloadVendors();
  });
}
