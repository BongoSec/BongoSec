var storeBongosec = stores.open('storeBongosec');
var deleteRolesMapping = storeBongosec.load('deleteRolesMapping');

switch (deleteRolesMapping) {
  case false:
    respond()
      .withStatusCode(200)
      .withFile('security/roles-mapping/get-rules.json');
    break;
  case true:
    storeBongosec.save('deleteRolesMapping', false);
    respond()
      .withStatusCode(200)
      .withFile('security/roles-mapping/get-rules-after-delete.json');
    break;
  default:
    respond()
      .withStatusCode(200)
      .withFile('security/roles-mapping/get-rules.json');
    break;
}
