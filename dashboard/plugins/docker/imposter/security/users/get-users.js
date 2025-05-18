var storeBongosec = stores.open('storeBongosec');
var deleteUser = storeBongosec.load('deleteUser');

switch (deleteUser) {
  case false:
    respond().withStatusCode(200).withFile('security/users/get-users.json');
    break;
  case true:
    storeBongosec.save('deleteUser', false);
    respond()
      .withStatusCode(200)
      .withFile('security/users/get-users-after-delete.json');
    break;
  default:
    respond().withStatusCode(200).withFile('security/users/get-users.json');
    break;
}
