var storeBongosec = stores.open('storeBongosec');
var deletePolicies = storeBongosec.load('deletePolicies');

switch (deletePolicies) {
  case false:
    respond()
      .withStatusCode(200)
      .withFile('security/policies/get-policies.json');
    break;
  case true:
    storeBongosec.save('deletePolicies', false);
    respond()
      .withStatusCode(200)
      .withFile('security/policies/get-policies-after-delete.json');
    break;
  default:
    respond()
      .withStatusCode(200)
      .withFile('security/policies/get-policies.json');
    break;
}
